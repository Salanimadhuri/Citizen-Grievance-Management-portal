package com.grievance.portal.controller;

import com.grievance.portal.dto.request.FeedbackRequest;
import com.grievance.portal.dto.response.ApiResponse;
import com.grievance.portal.model.Feedback;
import com.grievance.portal.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * FeedbackController — handles /api/feedback/* endpoints.
 *
 * Routes (identical to Express):
 *   POST /api/feedback             (citizen)
 *   GET  /api/feedback/recent      (admin)
 *   GET  /api/feedback/officer     (officer)
 *   GET  /api/feedback/:complaintId
 */
@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    /** POST /api/feedback */
    @PostMapping
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<ApiResponse<Feedback>> create(
            @Valid @RequestBody FeedbackRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Feedback submitted",
                feedbackService.createFeedback(request, userDetails.getUsername())));
    }

    /** GET /api/feedback/recent — admin: latest feedback */
    @GetMapping("/recent")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Feedback>>> getRecent() {
        return ResponseEntity.ok(ApiResponse.ok("Recent feedback", feedbackService.getRecentFeedback(20)));
    }

    /** GET /api/feedback/officer — officer: feedback on their resolved complaints */
    @GetMapping("/officer")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<ApiResponse<List<Feedback>>> getOfficerFeedback(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok("Officer feedback",
                feedbackService.getOfficerFeedback(userDetails.getUsername())));
    }

    /** GET /api/feedback/:complaintId */
    @GetMapping("/{complaintId}")
    public ResponseEntity<ApiResponse<Feedback>> getForComplaint(@PathVariable String complaintId) {
        return ResponseEntity.ok(ApiResponse.ok("Feedback fetched",
                feedbackService.getFeedbackForComplaint(complaintId)));
    }
}
