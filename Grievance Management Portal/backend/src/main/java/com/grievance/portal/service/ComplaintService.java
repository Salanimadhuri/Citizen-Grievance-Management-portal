package com.grievance.portal.service;

import com.grievance.portal.dto.request.AssignRequest;
import com.grievance.portal.dto.request.ComplaintRequest;
import com.grievance.portal.dto.request.StatusUpdateRequest;
import com.grievance.portal.dto.response.ComplaintWithUsersResponse;
import com.grievance.portal.dto.response.UserResponse;
import com.grievance.portal.exception.BadRequestException;
import com.grievance.portal.exception.ResourceNotFoundException;
import com.grievance.portal.exception.UnauthorizedException;
import com.grievance.portal.model.Complaint;
import com.grievance.portal.model.Complaint.StatusHistory;
import com.grievance.portal.model.User;
import com.grievance.portal.repository.ComplaintRepository;
import com.grievance.portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * ComplaintService — full business logic for complaint management.
 *
 * Replaces Express complaintController.js with all original functionality:
 *   createComplaint, getAllComplaints, getMyComplaints, getComplaintById,
 *   updateComplaintStatus, deleteComplaint, getAssignedComplaints,
 *   getOfficerComplaintById, assignComplaint
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;
    private final MLService mlService;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    // ─── CREATE ───────────────────────────────────────────────────────

    /**
     * Citizen submits a new complaint with optional image uploads.
     * Equivalent to Express: createComplaint controller
     */
    public ComplaintWithUsersResponse createComplaint(ComplaintRequest request,
                                                       List<MultipartFile> files,
                                                       String citizenId) throws IOException {
        Complaint complaint = new Complaint();
        complaint.setCitizenId(citizenId);
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setCategory(request.getCategory());
        complaint.setLocation(request.getLocation());
        complaint.setStatus("Submitted");
        complaint.setSubmittedAt(Instant.now());

        // Handle uploaded images (replaces Multer middleware)
        if (files != null && !files.isEmpty()) {
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);
            List<String> imagePaths = new ArrayList<>();
            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;
                String ext = Optional.ofNullable(file.getOriginalFilename())
                        .filter(f -> f.contains("."))
                        .map(f -> f.substring(f.lastIndexOf(".")))
                        .orElse(".jpg");
                String filename = UUID.randomUUID() + ext;
                Path dest = uploadPath.resolve(filename);
                Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);
                imagePaths.add("/uploads/" + filename);
            }
            complaint.setImages(imagePaths);
            if (!imagePaths.isEmpty()) complaint.setImageUrl(imagePaths.get(0));
        }

        // Initial status history entry
        StatusHistory initial = new StatusHistory();
        initial.setStatus("Submitted");
        initial.setRemarks("Complaint submitted successfully");
        initial.setUpdatedBy(citizenId);
        initial.setUpdatedAt(Instant.now());
        complaint.getStatusHistory().add(initial);

        // Run AI/ML analysis
        try {
            Map<String, Object> analysis = mlService.analyzeComplaint(request.getTitle(), request.getDescription());
            complaint.setAiCategory((String) analysis.get("category"));
            complaint.setAiPriority((String) analysis.get("priority"));
            complaint.setAiSentiment((String) analysis.get("sentiment"));
            complaint.setAiSummary((String) analysis.get("summary"));
            complaint.setAiRecommendedDepartment((String) analysis.get("recommendedDepartment"));
            
            // Convert priority to score: High=90, Medium=50, Low=20
            String priority = (String) analysis.get("priority");
            if ("High".equals(priority)) complaint.setPriorityScore(90);
            else if ("Medium".equals(priority)) complaint.setPriorityScore(50);
            else complaint.setPriorityScore(20);
        } catch (Exception e) {
            log.warn("ML analysis failed, continuing without AI: {}", e.getMessage());
        }

        complaint = complaintRepository.save(complaint);
        log.info("Created complaint [{}] by citizen [{}]", complaint.getId(), citizenId);

        // Notify all admins about new complaint
        final String emailTitle = complaint.getTitle();
        final String emailId = complaint.getId();
        userRepository.findByRole("admin").forEach(admin -> {
            notificationService.create(admin.getId(),
                    "New Complaint Submitted",
                    "A new complaint \"" + emailTitle + "\" has been submitted",
                    "complaint_submitted", emailId);
        });

        // Email confirmation to citizen
        userRepository.findById(citizenId).ifPresent(citizen ->
            emailService.sendComplaintSubmitted(citizen.getEmail(), citizen.getName(), emailTitle, emailId));

        return populate(complaint);
    }

    public List<ComplaintWithUsersResponse> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::populate).collect(Collectors.toList());
    }

    public List<ComplaintWithUsersResponse> getMyComplaints(String citizenId) {
        return complaintRepository.findByCitizenIdOrderByCreatedAtDesc(citizenId)
                .stream().map(this::populate).collect(Collectors.toList());
    }

    public List<ComplaintWithUsersResponse> getOfficerComplaints(String officerId) {
        return complaintRepository.findByOfficerIdOrderByCreatedAtDesc(officerId)
                .stream().map(this::populate).collect(Collectors.toList());
    }

    public ComplaintWithUsersResponse getComplaintById(String id) {
        Complaint c = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found: " + id));
        return populate(c);
    }

    public ComplaintWithUsersResponse getOfficerComplaintById(String id, String officerId) {
        Complaint c = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found: " + id));
        if (!officerId.equals(c.getOfficerId())) {
            throw new UnauthorizedException("Complaint not assigned to you");
        }
        return populate(c);
    }

    // ─── UPDATE STATUS ────────────────────────────────────────────────

    /**
     * Officer or admin updates complaint status.
     * Equivalent to Express: updateComplaintStatus controller
     * Sets timestamp fields based on which status is being set.
     */
    public ComplaintWithUsersResponse updateStatus(String id, StatusUpdateRequest request,
                                                    String userId, String role) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found: " + id));

        if ("officer".equals(role) && !userId.equals(complaint.getOfficerId())) {
            throw new UnauthorizedException("You are not assigned to this complaint");
        }

        String oldStatus = complaint.getStatus();
        complaint.setStatus(request.getStatus());
        if (request.getRemarks() != null) complaint.setRemarks(request.getRemarks());

        // Set status-specific timestamps (matches original Node.js logic)
        switch (request.getStatus()) {
            case "Under Review" -> { if (complaint.getReviewedAt() == null) complaint.setReviewedAt(Instant.now()); }
            case "Assigned"     -> { if (complaint.getAssignedAt() == null) complaint.setAssignedAt(Instant.now()); }
            case "In Progress"  -> { if (complaint.getInProgressAt() == null) complaint.setInProgressAt(Instant.now()); }
            case "Resolved"     -> { if (complaint.getResolvedAt() == null) complaint.setResolvedAt(Instant.now()); }
        }

        StatusHistory history = new StatusHistory();
        history.setStatus(request.getStatus());
        history.setRemarks(request.getRemarks());
        history.setUpdatedBy(userId);
        history.setUpdatedAt(Instant.now());
        complaint.getStatusHistory().add(history);

complaint = complaintRepository.save(complaint);

        // Notify citizen about status change
        if (!oldStatus.equals(request.getStatus())) {
            final String compTitle = complaint.getTitle();
            final String compId = complaint.getId();
            String notifType = "Resolved".equals(request.getStatus()) ? "complaint_resolved" : "status_updated";
            notificationService.create(complaint.getCitizenId(),
                    "Complaint Status Updated",
                    "Your complaint \"" + compTitle + "\" status changed to " + request.getStatus(),
                    notifType, compId);
            // Send email
            userRepository.findById(complaint.getCitizenId()).ifPresent(citizen -> {
                if ("Resolved".equals(request.getStatus())) {
                    emailService.sendComplaintResolved(citizen.getEmail(), citizen.getName(), compTitle, compId);
                } else {
                    emailService.sendStatusUpdate(citizen.getEmail(), citizen.getName(), compTitle, request.getStatus(), compId);
                }
            });
        }

        return populate(complaint);
    }

    /**
     * Admin assigns a complaint to an officer and optionally a department.
     * Equivalent to Express: assignComplaint controller
     */
    public ComplaintWithUsersResponse assignComplaint(String id, AssignRequest request) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found: " + id));

        User officer = userRepository.findById(request.getOfficerId())
                .orElseThrow(() -> new BadRequestException("Officer not found: " + request.getOfficerId()));
        if (!"officer".equals(officer.getRole())) {
            throw new BadRequestException("User is not an officer");
        }

        complaint.setOfficerId(request.getOfficerId());
        if (request.getDepartmentId() != null) complaint.setDepartmentId(request.getDepartmentId());
        complaint.setStatus("Assigned");
        complaint.setAssignedAt(Instant.now());

        StatusHistory history = new StatusHistory();
        history.setStatus("Assigned");
        history.setRemarks("Assigned to officer: " + officer.getName());
        history.setUpdatedAt(Instant.now());
        complaint.getStatusHistory().add(history);

complaint = complaintRepository.save(complaint);

        final String compTitle = complaint.getTitle();
        final String compId = complaint.getId();
        // Notify officer about assignment
        notificationService.create(officer.getId(),
                "New Complaint Assigned",
                "You have been assigned complaint \"" + compTitle + "\"",
                "complaint_assigned", compId);
        emailService.sendComplaintAssigned(officer.getEmail(), officer.getName(),
                compTitle, compId);

        // Notify citizen about assignment
        userRepository.findById(complaint.getCitizenId()).ifPresent(citizen ->
            emailService.sendStatusUpdate(citizen.getEmail(), citizen.getName(), compTitle, "Assigned", compId));

        return populate(complaint);
    }

    // ─── COUNT (used by OfficerController dashboard) ─────────────────────

    /**
     * Count complaints assigned to an officer with a specific status.
     * Used by OfficerController /api/officer/dashboard and statistics endpoints.
     * Equivalent to Express: Complaint.countDocuments({ officerId, status })
     */
    public long countByOfficerAndStatus(String officerId, String status) {
        return complaintRepository.countByOfficerIdAndStatus(officerId, status);
    }

    // ─── REOPEN ───────────────────────────────────────────────────────

    /**
     * Citizen reopens a resolved complaint if unsatisfied.
     * Sets status back to 'Under Review' and notifies admins.
     */
    public ComplaintWithUsersResponse reopenComplaint(String id, String reason, String citizenId) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found: " + id));

        if (!citizenId.equals(complaint.getCitizenId())) {
            throw new UnauthorizedException("You can only reopen your own complaints");
        }
        if (!"Resolved".equals(complaint.getStatus())) {
            throw new BadRequestException("Only resolved complaints can be reopened");
        }

        complaint.setStatus("Under Review");
        complaint.setRemarks("Reopened by citizen. Reason: " + reason);
        complaint.setResolvedAt(null);
        complaint.setFeedbackSubmitted(false);

        StatusHistory history = new StatusHistory();
        history.setStatus("Under Review");
        history.setRemarks("Complaint reopened by citizen. Reason: " + reason);
        history.setUpdatedBy(citizenId);
        history.setUpdatedAt(Instant.now());
        complaint.getStatusHistory().add(history);

        complaint = complaintRepository.save(complaint);

        // Notify all admins
        final String title = complaint.getTitle();
        final String complaintId = complaint.getId();
        userRepository.findByRole("admin").forEach(admin -> {
            notificationService.create(admin.getId(),
                    "Complaint Reopened",
                    "Citizen reopened complaint \"" + title + "\". Reason: " + reason,
                    "status_updated", complaintId);
            emailService.sendComplaintReopened(admin.getEmail(), admin.getName(), title, reason);
        });

        return populate(complaint);
    }

    // ─── DELETE ───────────────────────────────────────────────────────

    public void deleteComplaint(String id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found: " + id));
        complaintRepository.delete(complaint);
        log.info("Deleted complaint: {}", id);
    }

    // ─── HEATMAP / LOCATIONS ─────────────────────────────────────────

    /**
     * Returns complaints that have location data for heatmap visualization.
     * Equivalent to Express: getComplaintLocations controller
     */
    public List<ComplaintWithUsersResponse> getComplaintLocations(String category, String status) {
        List<Complaint> complaints = complaintRepository.findAllByOrderByCreatedAtDesc();
        return complaints.stream()
                .filter(c -> c.getLocation() != null
                        && c.getLocation().getLatitude() != 0
                        && c.getLocation().getLongitude() != 0)
                .filter(c -> category == null || category.equals(c.getCategory()))
                .filter(c -> status == null || status.equals(c.getStatus()))
                .map(this::populate)
                .collect(Collectors.toList());
    }

    // ─── POPULATE (Mongoose .populate() equivalent) ───────────────────

    /**
     * Manually populate citizenId and officerId with full User objects.
     * Spring Data MongoDB doesn't auto-populate like Mongoose,
     * so we fetch related users and embed them in the response.
     */
    public ComplaintWithUsersResponse populate(Complaint c) {
        UserResponse citizen = userRepository.findById(c.getCitizenId())
                .map(this::toUserResponse).orElse(null);
        UserResponse officer = c.getOfficerId() != null
                ? userRepository.findById(c.getOfficerId()).map(this::toUserResponse).orElse(null)
                : null;

        return ComplaintWithUsersResponse.builder()
                .id(c.getId())
                .title(c.getTitle())
                .description(c.getDescription())
                .category(c.getCategory())
                .status(c.getStatus())
                .location(c.getLocation())
                .imageUrl(c.getImageUrl())
                .images(c.getImages())
                .statusHistory(c.getStatusHistory())
                .remarks(c.getRemarks())
                .feedbackSubmitted(c.isFeedbackSubmitted())
                .priorityScore(c.getPriorityScore())
                .escalated(c.isEscalated())
                .duplicateOf(c.getDuplicateOf())
                .duplicateCount(c.getDuplicateCount())
                .departmentId(c.getDepartmentId())
                .submittedAt(c.getSubmittedAt())
                .reviewedAt(c.getReviewedAt())
                .assignedAt(c.getAssignedAt())
                .inProgressAt(c.getInProgressAt())
                .resolvedAt(c.getResolvedAt())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .citizenId(citizen)
                .officerId(officer)
                .build();
    }

    private UserResponse toUserResponse(User u) {
        return UserResponse.builder()
                .id(u.getId()).name(u.getName()).email(u.getEmail())
                .role(u.getRole()).phone(u.getPhone())
                .department(u.getDepartment()).avatar(u.getAvatar())
                .build();
    }
}
