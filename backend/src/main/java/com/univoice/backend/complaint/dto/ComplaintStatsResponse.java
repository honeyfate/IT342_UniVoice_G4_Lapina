package com.univoice.backend.complaint.dto;

import java.util.Map;

public record ComplaintStatsResponse(
        long total,
        long open,
        long inProgress,
        long resolved,
        Map<String, Long> byCategory,
        Map<String, Long> byPriority
) {
}
