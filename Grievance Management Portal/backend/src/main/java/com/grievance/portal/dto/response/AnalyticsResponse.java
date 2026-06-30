package com.grievance.portal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * Analytics response DTO — returned by GET /api/admin/analytics
 * Matches the shape the React StatisticsCharts component expects.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {

    private StatsDto stats;
    private List<ChartEntry> byCategory;
    private List<ChartEntry> byStatus;
    private List<ResolutionEntry> resolutionRate;
    private List<Map<String, Object>> departmentPerformance;
    private List<Map<String, Object>> monthlyTrends;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatsDto {
        private long total;
        private long pending;
        private long inProgress;
        private long resolved;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChartEntry {
        private String name;
        private long value;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResolutionEntry {
        private String name;
        private long resolved;
        private long pending;
    }
}
