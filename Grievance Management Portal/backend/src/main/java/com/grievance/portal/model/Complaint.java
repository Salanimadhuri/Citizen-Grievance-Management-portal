package com.grievance.portal.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Complaint model — maps to the 'complaints' collection.
 *
 * Equivalent to Mongoose Complaint schema with all original fields preserved:
 *   title, description, category, location, imageUrl, images, status,
 *   priorityScore, duplicateOf, duplicateCount, escalated, feedbackSubmitted,
 *   userId (citizenId), departmentId, assignedOfficer (officerId), remarks,
 *   submittedAt, reviewedAt, assignedAt, inProgressAt, resolvedAt, timestamps
 *
 * Status lifecycle:
 *   Submitted → Under Review → Assigned → In Progress → Work Scheduled → Resolved
 */
@Data
@NoArgsConstructor
@Document(collection = "complaints")
public class Complaint {

    @Id
    private String id;

    // ─── Core Fields ─────────────────────────────────────────────────

    private String title;
    private String description;

    /**
     * Category — one of the predefined values matching the React frontend dropdown.
     * Values: Road & Infrastructure | Water Supply | Electricity |
     *         Waste Management | Public Safety | Other
     */
    private String category;

    /**
     * Current status. Defaults to "Submitted" on creation.
     */
    private String status = "Submitted";

    // ─── Relations ───────────────────────────────────────────────────

    /**
     * ID of the citizen who submitted this complaint.
     * Equivalent to Mongoose: userId (ref: 'User')
     */
    @Indexed
    @Field("userId")
    private String citizenId;

    /**
     * ID of the assigned officer (nullable until assigned).
     * Equivalent to Mongoose: assignedOfficer (ref: 'User')
     */
    @Indexed
    @Field("assignedOfficer")
    private String officerId;

    /**
     * Department ID this complaint is assigned to.
     * Equivalent to Mongoose: departmentId (ref: 'Department')
     */
    @Field("departmentId")
    private String departmentId;

    // ─── Embedded Documents ───────────────────────────────────────────

    /**
     * Geographic location of the complaint.
     */
    private Location location;

    /**
     * Primary image URL (first uploaded image).
     * Equivalent to Mongoose: imageUrl field.
     */
    private String imageUrl;

    /**
     * All uploaded image paths.
     * Equivalent to Mongoose: images: [String]
     */
    private List<String> images = new ArrayList<>();

    /**
     * Timeline of all status changes.
     */
    private List<StatusHistory> statusHistory = new ArrayList<>();

    // ─── AI / Priority Fields ─────────────────────────────────────────

    /**
     * AI-calculated priority score (0-100).
     * Higher = more urgent. Used for sorting in admin view.
     */
    private int priorityScore = 0;

    /** AI-predicted category (from ML service) */
    private String aiCategory;

    /** AI-predicted priority label: High / Medium / Low */
    private String aiPriority;

    /** AI sentiment: Positive / Neutral / Negative */
    private String aiSentiment;

    /** AI-generated short summary */
    private String aiSummary;

    /** AI-recommended department name */
    private String aiRecommendedDepartment;

    /**
     * Whether this complaint has been escalated due to SLA breach.
     */
    private boolean escalated = false;

    /**
     * ID of the original complaint this is a duplicate of.
     * Equivalent to Mongoose: duplicateOf (ref: 'Complaint')
     */
    @Field("duplicateOf")
    private String duplicateOf;

    /**
     * Count of duplicate complaints linked to this one.
     */
    private int duplicateCount = 0;

    // ─── Resolution Fields ────────────────────────────────────────────

    private String remarks;

    /**
     * Whether the citizen has submitted feedback for this resolved complaint.
     */
    private boolean feedbackSubmitted = false;

    // ─── Status Timestamps ────────────────────────────────────────────

    @Field("submittedAt")
    private Instant submittedAt = Instant.now();

    @Field("reviewedAt")
    private Instant reviewedAt;

    @Field("assignedAt")
    private Instant assignedAt;

    @Field("inProgressAt")
    private Instant inProgressAt;

    @Field("resolvedAt")
    private Instant resolvedAt;

    // ─── Audit Timestamps ─────────────────────────────────────────────

    @CreatedDate
    @Field("createdAt")
    private Instant createdAt;

    @LastModifiedDate
    @Field("updatedAt")
    private Instant updatedAt;

    // ─── Embedded Classes ─────────────────────────────────────────────

    /**
     * Embedded location sub-document.
     * Matches the React frontend location object: { address, latitude, longitude }
     */
    @Data
    @NoArgsConstructor
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
    public static class Location {
        private String address;
        private double latitude;
        private double longitude;
    }

    /**
     * Single entry in the complaint's status history timeline.
     * Appended on every status change — never modified.
     */
    @Data
    @NoArgsConstructor
    public static class StatusHistory {
        private String status;
        private String remarks;
        private String updatedBy;
        private Instant updatedAt = Instant.now();
    }
}
