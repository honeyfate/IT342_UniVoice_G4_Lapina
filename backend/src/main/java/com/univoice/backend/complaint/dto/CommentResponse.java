package com.univoice.backend.complaint.dto;

import java.time.Instant;

public record CommentResponse(
        String id,
        String text,
        Instant createdAt
) {
}
