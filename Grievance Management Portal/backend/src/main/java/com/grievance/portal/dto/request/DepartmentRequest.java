package com.grievance.portal.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request body for POST /api/departments (admin creates a department).
 *
 * Equivalent to Express:
 *   const { name, slaHours, contactEmail } = req.body;
 *
 * Used by DepartmentController to create and update departments.
 */
@Data
public class DepartmentRequest {

    @NotBlank(message = "Department name is required")
    @Size(min = 2, max = 100, message = "Department name must be between 2 and 100 characters")
    private String name;

    /**
     * SLA hours — how many hours the department has to resolve complaints.
     * Used by the escalation scheduler to detect overdue complaints.
     */
    @NotBlank(message = "SLA hours is required")
    private int slaHours;

    /**
     * Contact email for the department — used for email notification placeholders.
     */
    @Email(message = "Please provide a valid contact email")
    private String contactEmail;
}
