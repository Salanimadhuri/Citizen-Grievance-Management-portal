package com.grievance.portal.controller;

import com.grievance.portal.dto.request.OfficerRegisterRequest;
import com.grievance.portal.dto.response.ApiResponse;
import com.grievance.portal.dto.response.UserResponse;
import com.grievance.portal.model.Notification;
import com.grievance.portal.service.ComplaintService;
import com.grievance.portal.service.NotificationService;
import com.grievance.portal.service.OfficerService;
import com.grievance.portal.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * OfficerController — /api/officer/*
 *
 * Mirrors Express officerRoutes.js:
 *   POST /api/officer/register  — officer self-registration (pending approval)
 *
 * Plus officer dashboard endpoints:
 *   GET /api/officer/dashboard
 *   GET /api/officer/statistics
 *   GET /api/officer/profile
 *   GET /api/officer/notifications
 */
@RestController
@RequestMapping("/api/officer")
@RequiredArgsConstructor
public class OfficerController {

    private final OfficerService officerService;
    private final ComplaintService complaintService;
    private final UserService userService;
    private final NotificationService notificationService;

    /** POST /api/officer/register — officer self-registers, starts as pending */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(
            @Valid @RequestBody OfficerRegisterRequest request) {
        UserResponse officer = officerService.registerOfficer(request);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", "Your officer registration request has been sent to the admin for approval.");
        body.put("officer", officer);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Registration submitted", body));
    }

    /** GET /api/officer/dashboard */
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard(
            @AuthenticationPrincipal UserDetails userDetails) {
        String officerId = userDetails.getUsername();
        Map<String, Object> dashboard = new LinkedHashMap<>();
        dashboard.put("totalComplaints",  complaintService.getOfficerComplaints(officerId).size());
        dashboard.put("assigned",         complaintService.countByOfficerAndStatus(officerId, "Assigned"));
        dashboard.put("inProgress",       complaintService.countByOfficerAndStatus(officerId, "In Progress"));
        dashboard.put("resolved",         complaintService.countByOfficerAndStatus(officerId, "Resolved"));
        dashboard.put("submitted",        complaintService.countByOfficerAndStatus(officerId, "Submitted"));
        List<Notification> notifications = notificationService.getUserNotifications(officerId);
        dashboard.put("recentNotifications", notifications.stream().limit(10).toList());
        return ResponseEntity.ok(ApiResponse.ok("Officer dashboard fetched", dashboard));
    }

    /** GET /api/officer/statistics */
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatistics(
            @AuthenticationPrincipal UserDetails userDetails) {
        String officerId = userDetails.getUsername();
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalAssigned",  complaintService.countByOfficerAndStatus(officerId, "Assigned")
                                  + complaintService.countByOfficerAndStatus(officerId, "In Progress")
                                  + complaintService.countByOfficerAndStatus(officerId, "Work Scheduled"));
        stats.put("inProgress",     complaintService.countByOfficerAndStatus(officerId, "In Progress"));
        stats.put("assigned",       complaintService.countByOfficerAndStatus(officerId, "Assigned"));
        stats.put("resolved",       complaintService.countByOfficerAndStatus(officerId, "Resolved"));
        stats.put("pending",        complaintService.countByOfficerAndStatus(officerId, "Submitted"));
        stats.put("totalResolved",  complaintService.countByOfficerAndStatus(officerId, "Resolved"));
        return ResponseEntity.ok(ApiResponse.ok("Officer statistics", stats));
    }

    /** GET /api/officer/profile */
    @GetMapping("/profile")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok("Officer profile",
                userService.getUserById(userDetails.getUsername())));
    }

    /** GET /api/officer/notifications */
    @GetMapping("/notifications")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<ApiResponse<List<Notification>>> getNotifications(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok("Officer notifications",
                notificationService.getUserNotifications(userDetails.getUsername())));
    }
}
