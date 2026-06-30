package com.grievance.portal.controller;

import com.grievance.portal.dto.response.ApiResponse;
import com.grievance.portal.model.Notification;
import com.grievance.portal.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /** GET /api/notifications */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getAll(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok("Notifications fetched",
                notificationService.getUserNotifications(userDetails.getUsername())));
    }

    /**
     * GET /api/notifications/unread-count
     * Frontend calls this URL (NotificationBell.jsx)
     */
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(
            @AuthenticationPrincipal UserDetails userDetails) {
        long count = notificationService.getUnreadCount(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Unread count", Map.of("count", count)));
    }

    /**
     * GET /api/notifications/unread/count
     * Alias — kept for compatibility
     */
    @GetMapping("/unread/count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCountAlias(
            @AuthenticationPrincipal UserDetails userDetails) {
        long count = notificationService.getUnreadCount(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Unread count", Map.of("count", count)));
    }

    /** PATCH /api/notifications/read-all */
    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllRead(
            @AuthenticationPrincipal UserDetails userDetails) {
        notificationService.markAllRead(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("All notifications marked as read"));
    }

    /** PATCH /api/notifications/:id/read */
    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markRead(@PathVariable String id) {
        notificationService.markRead(id);
        return ResponseEntity.ok(ApiResponse.ok("Notification marked as read"));
    }

    /** PATCH /api/notifications/mark-all-read — alias used by some frontend calls */
    @PatchMapping("/mark-all-read")
    public ResponseEntity<ApiResponse<Void>> markAllReadAlias(
            @AuthenticationPrincipal UserDetails userDetails) {
        notificationService.markAllRead(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("All notifications marked as read"));
    }

    /** DELETE /api/notifications/:id */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        notificationService.deleteNotification(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Notification deleted"));
    }

    /** DELETE /api/notifications — delete all for current user */
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteAll(
            @AuthenticationPrincipal UserDetails userDetails) {
        notificationService.deleteAllNotifications(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("All notifications deleted"));
    }
}
