package com.grievance.portal.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request body for POST /api/communications
 *
 * Sent when citizen or officer sends a message.
 * Equivalent to Express:
 *   const { complaintId, receiverId, message } = req.body;
 */
@Data
public class MessageRequest {

    @NotBlank(message = "Complaint ID is required")
    private String complaintId;

    @NotBlank(message = "Receiver ID is required")
    private String receiverId;

    @NotBlank(message = "Message cannot be empty")
    @Size(max = 2000, message = "Message cannot exceed 2000 characters")
    private String message;
}
