package com.grievance.portal.dto.request;

import com.grievance.portal.model.Complaint;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Request body for POST /api/complaints
 *
 * NOTE: The complaint endpoint uses multipart/form-data (because of file uploads),
 * so individual fields are bound via @RequestPart in the controller.
 * This DTO is assembled in the controller from those parts.
 *
 * Matches the React complaint submission form fields.
 */
@Data
public class ComplaintRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    /**
     * Optional geographic location of the complaint.
     * Matches Complaint.Location embedded document.
     */
    private Complaint.Location location;
}
