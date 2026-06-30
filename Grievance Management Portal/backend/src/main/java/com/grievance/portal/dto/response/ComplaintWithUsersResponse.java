package com.grievance.portal.dto.response;

import com.grievance.portal.model.Complaint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

/**
 * Enriched complaint response — includes populated citizen and officer details.
 *
 * In Mongoose, this was done via .populate('userId').populate('assignedOfficer').
 * Spring Data MongoDB doesn't auto-populate, so the service layer manually
 * fetches and attaches user details.
 *
 * The React frontend reads complaint.userId.name, complaint.assignedOfficer.name, etc.
 * Field names citizenId/officerId are kept as-is for internal use but
 * the response also exposes userId and assignedOfficer aliases for frontend compatibility.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintWithUsersResponse {

    private String id;
    private String title;
    private String description;
    private String category;
    private String status;
    private Complaint.Location location;
    private String imageUrl;
    private List<String> images;
    private List<Complaint.StatusHistory> statusHistory;
    private String remarks;
    private boolean feedbackSubmitted;
    private int priorityScore;
    private boolean escalated;
    private String duplicateOf;
    private int duplicateCount;
    private String departmentId;

    // Status timestamps
    private Instant submittedAt;
    private Instant reviewedAt;
    private Instant assignedAt;
    private Instant inProgressAt;
    private Instant resolvedAt;
    private Instant createdAt;
    private Instant updatedAt;

    /**
     * Populated citizen details.
     * Field name kept as 'citizenId' but also exposed as 'userId' for frontend compatibility.
     */
    private UserResponse citizenId;

    /**
     * Populated officer details (nullable — complaint may be unassigned).
     * Field name kept as 'officerId' but also exposed as 'assignedOfficer' for frontend compatibility.
     */
    private UserResponse officerId;

    // Aliases for Node.js frontend compatibility
    public UserResponse getUserId() { return citizenId; }
    public UserResponse getAssignedOfficer() { return officerId; }
}
