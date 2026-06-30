package com.grievance.portal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Department response DTO — returned to clients.
 * Matches the shape the React frontend expects.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentResponse {

    private String id;
    private String name;
    private int slaHours;
    private String contactEmail;
    private Instant createdAt;
    private Instant updatedAt;
}
