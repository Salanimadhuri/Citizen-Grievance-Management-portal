package com.grievance.portal.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Request body for officer-related actions managed by AdminController.
 *
 * Examples:
 *   - Admin changing officer status to "approved" or "rejected"
 *   - Officer updating their department
 *
 * Equivalent to Express:
 *   const { status, department } = req.body;
 */
@Data
public class OfficerRequest {

    /**
     * New status value for the officer account.
     * Values: "pending", "approved", "rejected"
     */
    @NotBlank(message = "Status is required")
    private String status;

    /**
     * New department ID for the officer.
     * Nullable — only included when admin is transferring an officer.
     */
    private String department;
}
