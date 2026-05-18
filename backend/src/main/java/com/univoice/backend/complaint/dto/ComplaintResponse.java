package com.univoice.backend.complaint.dto;

import java.time.Instant;
import java.util.List;

public record ComplaintResponse(
        String id,
        String name,
        String studentId,
        String email,
        String course,
        String category,
        String priority,
        String subject,
        String description,
        String status,
        Instant createdAt,
        Instant updatedAt,
        Instant resolvedAt,
        String assignedTo,
        Instant assignedAt,
        Instant dueDate,
        List<CommentResponse> comments
) {
}
