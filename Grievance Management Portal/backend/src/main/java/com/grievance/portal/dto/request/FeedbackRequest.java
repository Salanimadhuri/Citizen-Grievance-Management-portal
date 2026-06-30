package com.grievance.portal.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Request body for POST /api/feedback
 *
 * Submitted by citizens after their complaint is resolved.
 * Equivalent to Express:
 *   const { complaintId, rating, comment } = req.body;
 */
@Data
public class FeedbackRequest {

    @NotBlank(message = "Complaint ID is required")
    private String complaintId;

    /**
     * Star rating. Min 1, Max 5.
     * Displayed as star icons in OfficerFeedback.jsx.
     */
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private int rating;

    /**
     * Optional text review from citizen.
     */
    private String comment;
}
