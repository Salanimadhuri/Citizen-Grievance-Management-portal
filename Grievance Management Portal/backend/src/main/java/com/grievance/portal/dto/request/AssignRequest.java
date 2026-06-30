package com.grievance.portal.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Request body for PATCH /api/complaints/:id/assign
 * Used by admin to assign a complaint to an officer and optionally a department.
 */
@Data
public class AssignRequest {

    @NotBlank(message = "Officer ID is required")
    private String officerId;

    private String departmentId;
}
