package com.univoice.backend.complaint.dto;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;

public record BulkComplaintRequest(
        @NotEmpty List<String> ids,
        String status,
        String assignedTo
) {
}
