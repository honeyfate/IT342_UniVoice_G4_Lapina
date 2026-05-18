package com.univoice.backend.complaint.dto;

import java.time.Instant;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ComplaintRequest(
        @Size(max = 120) String name,
        @Size(max = 60) String studentId,
        @Email @Size(max = 180) String email,
        @Size(max = 120) String course,
        @Size(max = 80) String category,
        @Size(max = 40) String priority,
        @NotBlank @Size(max = 180) String subject,
        @NotBlank @Size(max = 4000) String description,
        @Size(max = 40) String status,
        Instant dueDate
) {
}
