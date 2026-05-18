package com.univoice.backend.complaint;

import java.util.List;

import com.univoice.backend.complaint.dto.CommentResponse;
import com.univoice.backend.complaint.dto.ComplaintResponse;

public final class ComplaintMapper {
    private ComplaintMapper() {
    }

    public static ComplaintResponse toResponse(Complaint complaint) {
        List<CommentResponse> comments = complaint.getComments().stream()
                .map(ComplaintMapper::toResponse)
                .toList();

        return new ComplaintResponse(
                complaint.getId(),
                complaint.getName(),
                complaint.getStudentId(),
                complaint.getEmail(),
                complaint.getCourse(),
                complaint.getCategory(),
                complaint.getPriority(),
                complaint.getSubject(),
                complaint.getDescription(),
                complaint.getStatus(),
                complaint.getCreatedAt(),
                complaint.getUpdatedAt(),
                complaint.getResolvedAt(),
                complaint.getAssignedTo(),
                complaint.getAssignedAt(),
                complaint.getDueDate(),
                comments
        );
    }

    public static CommentResponse toResponse(ComplaintComment comment) {
        return new CommentResponse(comment.getId(), comment.getText(), comment.getCreatedAt());
    }
}
