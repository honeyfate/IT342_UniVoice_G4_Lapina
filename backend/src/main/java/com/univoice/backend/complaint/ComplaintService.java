package com.univoice.backend.complaint;

import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.univoice.backend.complaint.dto.BulkComplaintRequest;
import com.univoice.backend.complaint.dto.CommentRequest;
import com.univoice.backend.complaint.dto.ComplaintRequest;
import com.univoice.backend.complaint.dto.ComplaintUpdateRequest;

import jakarta.persistence.criteria.Predicate;

@Service
@Transactional
public class ComplaintService {
    private static final String DEFAULT_CATEGORY = "Other";
    private static final String DEFAULT_PRIORITY = "Medium";
    private static final String DEFAULT_STATUS = "Open";
    private static final List<String> ALLOWED_STATUSES = List.of("Open", "In Progress", "Resolved");

    private final ComplaintRepository repository;

    public ComplaintService(ComplaintRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Complaint> findAll(String query, String status, String priority) {
        Specification<Complaint> spec = (root, cq, cb) -> {
            Predicate predicate = cb.conjunction();

            if (hasValue(status) && !"all".equalsIgnoreCase(status)) {
                predicate = cb.and(predicate, cb.equal(root.get("status"), status));
            }
            if (hasValue(priority) && !"all".equalsIgnoreCase(priority)) {
                predicate = cb.and(predicate, cb.equal(root.get("priority"), priority));
            }
            if (hasValue(query)) {
                String pattern = "%" + query.toLowerCase(Locale.ROOT) + "%";
                Predicate search = cb.or(
                        cb.like(cb.lower(root.get("subject")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern),
                        cb.like(cb.lower(root.get("course")), pattern),
                        cb.like(cb.lower(root.get("id")), pattern),
                        cb.like(cb.lower(root.get("studentId")), pattern),
                        cb.like(cb.lower(root.get("name")), pattern),
                        cb.like(cb.lower(root.get("category")), pattern)
                );
                predicate = cb.and(predicate, search);
            }
            return predicate;
        };
        return repository.findAll(spec, Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Transactional(readOnly = true)
    public Complaint getById(String id) {
        return repository.findById(id).orElseThrow(() -> new ComplaintNotFoundException(id));
    }

    public Complaint create(ComplaintRequest request) {
        Complaint complaint = new Complaint();
        complaint.setId(generateId());
        complaint.setName(clean(request.name()));
        complaint.setStudentId(clean(request.studentId()));
        complaint.setEmail(clean(request.email()));
        complaint.setCourse(clean(request.course()));
        complaint.setCategory(defaultIfBlank(request.category(), DEFAULT_CATEGORY));
        complaint.setPriority(defaultIfBlank(request.priority(), DEFAULT_PRIORITY));
        complaint.setSubject(request.subject().trim());
        complaint.setDescription(request.description().trim());
        complaint.setStatus(normalizeStatus(defaultIfBlank(request.status(), DEFAULT_STATUS)));
        complaint.setDueDate(request.dueDate());
        applyStatusTimestamps(complaint, null, complaint.getStatus());
        return repository.save(complaint);
    }

    public Complaint update(String id, ComplaintUpdateRequest request) {
        Complaint complaint = getById(id);
        String oldStatus = complaint.getStatus();

        setIfPresent(request.name(), complaint::setName);
        setIfPresent(request.studentId(), complaint::setStudentId);
        setIfPresent(request.email(), complaint::setEmail);
        setIfPresent(request.course(), complaint::setCourse);
        setIfPresent(request.category(), complaint::setCategory);
        setIfPresent(request.priority(), complaint::setPriority);
        setIfPresent(request.subject(), value -> complaint.setSubject(value.trim()));
        setIfPresent(request.description(), value -> complaint.setDescription(value.trim()));
        setIfPresent(request.assignedTo(), value -> {
            String assignedTo = clean(value);
            complaint.setAssignedTo(assignedTo);
            complaint.setAssignedAt(assignedTo == null ? null : Instant.now());
        });

        if (request.dueDate() != null) {
            complaint.setDueDate(request.dueDate());
        }
        if (hasValue(request.status())) {
            complaint.setStatus(normalizeStatus(request.status()));
        }

        applyStatusTimestamps(complaint, oldStatus, complaint.getStatus());
        return repository.save(complaint);
    }

    public Complaint updateStatus(String id, String status) {
        Complaint complaint = getById(id);
        String oldStatus = complaint.getStatus();
        complaint.setStatus(normalizeStatus(status));
        applyStatusTimestamps(complaint, oldStatus, complaint.getStatus());
        return repository.save(complaint);
    }

    public Complaint assign(String id, String assignedTo) {
        Complaint complaint = getById(id);
        String cleaned = clean(assignedTo);
        complaint.setAssignedTo(cleaned);
        complaint.setAssignedAt(cleaned == null ? null : Instant.now());
        return repository.save(complaint);
    }

    public Complaint setDueDate(String id, Instant dueDate) {
        Complaint complaint = getById(id);
        complaint.setDueDate(dueDate);
        return repository.save(complaint);
    }

    public ComplaintComment addComment(String id, CommentRequest request) {
        Complaint complaint = getById(id);
        ComplaintComment comment = new ComplaintComment();
        comment.setId("cm-" + UUID.randomUUID());
        comment.setText(request.text().trim());
        complaint.addComment(comment);
        repository.save(complaint);
        return comment;
    }

    public void deleteComment(String complaintId, String commentId) {
        Complaint complaint = getById(complaintId);
        ComplaintComment comment = complaint.getComments().stream()
                .filter(item -> item.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new ComplaintNotFoundException(commentId));
        complaint.removeComment(comment);
        repository.save(complaint);
    }

    public int bulkUpdate(BulkComplaintRequest request) {
        List<Complaint> complaints = repository.findAllById(request.ids());
        for (Complaint complaint : complaints) {
            if (hasValue(request.status())) {
                String oldStatus = complaint.getStatus();
                complaint.setStatus(normalizeStatus(request.status()));
                applyStatusTimestamps(complaint, oldStatus, complaint.getStatus());
            }
            if (request.assignedTo() != null) {
                String cleaned = clean(request.assignedTo());
                complaint.setAssignedTo(cleaned);
                complaint.setAssignedAt(cleaned == null ? null : Instant.now());
            }
        }
        repository.saveAll(complaints);
        return complaints.size();
    }

    public void delete(String id) {
        if (!repository.existsById(id)) {
            throw new ComplaintNotFoundException(id);
        }
        repository.deleteById(id);
    }

    public int bulkDelete(List<String> ids) {
        List<Complaint> complaints = repository.findAllById(ids);
        repository.deleteAll(complaints);
        return complaints.size();
    }

    private static void applyStatusTimestamps(Complaint complaint, String oldStatus, String newStatus) {
        if ("Resolved".equals(newStatus) && !"Resolved".equals(oldStatus) && complaint.getResolvedAt() == null) {
            complaint.setResolvedAt(Instant.now());
        }
        if (!"Resolved".equals(newStatus)) {
            complaint.setResolvedAt(null);
        }
    }

    private static String normalizeStatus(String status) {
        String cleaned = defaultIfBlank(status, DEFAULT_STATUS);
        return ALLOWED_STATUSES.stream()
                .filter(item -> item.equalsIgnoreCase(cleaned))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid status: " + status));
    }

    private static String defaultIfBlank(String value, String fallback) {
        return hasValue(value) ? value.trim() : fallback;
    }

    private static String clean(String value) {
        return hasValue(value) ? value.trim() : null;
    }

    private static boolean hasValue(String value) {
        return StringUtils.hasText(value);
    }

    private static void setIfPresent(String value, java.util.function.Consumer<String> setter) {
        if (value != null) {
            setter.accept(clean(value));
        }
    }

    private static String generateId() {
        return "c-" + UUID.randomUUID();
    }
}
