package com.grievance.portal.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Data;

/**
 * Request body for PATCH /api/admin/officers/:id
 * Admin updates an officer's details.
 */
@Data
public class UpdateOfficerRequest {

    private String name;

    @Email(message = "Please provide a valid email")
    private String email;

    private String phone;

    private String department;
}
