package com.grievance.portal.controller;

import com.grievance.portal.dto.request.MessageRequest;
import com.grievance.portal.dto.response.ApiResponse;
import com.grievance.portal.model.Communication;
import com.grievance.portal.service.CommunicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * CommunicationController — handles /api/communications/* endpoints.
 *
 * Routes (identical to Express):
 *   POST /api/communications
 *   GET  /api/communications/:complaintId
 *   GET  /api/communications/unread/count
 */
@RestController
@RequestMapping("/api/communications")
@RequiredArgsConstructor
public class CommunicationController {

    private final CommunicationService communicationService;

    /** POST /api/communications — send a message */
    @PostMapping
    public ResponseEntity<ApiResponse<Communication>> send(
            @Valid @RequestBody MessageRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String role = userDetails.getAuthorities().iterator().next()
                .getAuthority().replace("ROLE_", "").toLowerCase();
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Message sent",
                communicationService.sendMessage(request, userDetails.getUsername(), role)));
    }

    /** GET /api/communications/:complaintId — get conversation + mark as read */
    @GetMapping("/{complaintId}")
    public ResponseEntity<ApiResponse<List<Communication>>> getMessages(
            @PathVariable String complaintId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok("Messages fetched",
                communicationService.getAndMarkRead(complaintId, userDetails.getUsername())));
    }

    /** GET /api/communications/unread/count — unread badge count */
    @GetMapping("/unread/count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(
            @AuthenticationPrincipal UserDetails userDetails) {
        long count = communicationService.getUnreadCount(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Unread count", Map.of("count", count)));
    }
}
