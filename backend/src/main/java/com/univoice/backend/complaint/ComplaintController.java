package com.univoice.backend.complaint;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.univoice.backend.complaint.dto.BulkComplaintRequest;
import com.univoice.backend.complaint.dto.CommentRequest;
import com.univoice.backend.complaint.dto.CommentResponse;
import com.univoice.backend.complaint.dto.ComplaintRequest;
import com.univoice.backend.complaint.dto.ComplaintResponse;
import com.univoice.backend.complaint.dto.ComplaintUpdateRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {
    private final ComplaintService service;

    public ComplaintController(ComplaintService service) {
        this.service = service;
    }

    @GetMapping
    public List<ComplaintResponse> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority
    ) {
        return service.findAll(q, status, priority).stream()
                .map(ComplaintMapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public ComplaintResponse get(@PathVariable String id) {
        return ComplaintMapper.toResponse(service.getById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ComplaintResponse create(@Valid @RequestBody ComplaintRequest request) {
        return ComplaintMapper.toResponse(service.create(request));
    }

    @PutMapping("/{id}")
    public ComplaintResponse update(@PathVariable String id, @Valid @RequestBody ComplaintUpdateRequest request) {
        return ComplaintMapper.toResponse(service.update(id, request));
    }

    @PatchMapping("/{id}/status")
    public ComplaintResponse updateStatus(@PathVariable String id, @RequestBody Map<String, String> request) {
        return ComplaintMapper.toResponse(service.updateStatus(id, request.get("status")));
    }

    @PatchMapping("/{id}/assignment")
    public ComplaintResponse assign(@PathVariable String id, @RequestBody Map<String, String> request) {
        return ComplaintMapper.toResponse(service.assign(id, request.get("assignedTo")));
    }

    @PatchMapping("/{id}/due-date")
    public ComplaintResponse setDueDate(@PathVariable String id, @RequestBody Map<String, Instant> request) {
        return ComplaintMapper.toResponse(service.setDueDate(id, request.get("dueDate")));
    }

    @PostMapping("/{id}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public CommentResponse addComment(@PathVariable String id, @Valid @RequestBody CommentRequest request) {
        return ComplaintMapper.toResponse(service.addComment(id, request));
    }

    @DeleteMapping("/{complaintId}/comments/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteComment(@PathVariable String complaintId, @PathVariable String commentId) {
        service.deleteComment(complaintId, commentId);
    }

    @PatchMapping("/bulk")
    public Map<String, Integer> bulkUpdate(@Valid @RequestBody BulkComplaintRequest request) {
        return Map.of("updated", service.bulkUpdate(request));
    }

    @DeleteMapping("/bulk")
    public Map<String, Integer> bulkDelete(@Valid @RequestBody BulkComplaintRequest request) {
        return Map.of("deleted", service.bulkDelete(request.ids()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
