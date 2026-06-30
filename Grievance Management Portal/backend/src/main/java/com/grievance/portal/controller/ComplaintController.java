package com.grievance.portal.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.grievance.portal.dto.request.AssignRequest;
import com.grievance.portal.dto.request.ComplaintRequest;
import com.grievance.portal.dto.request.StatusUpdateRequest;
import com.grievance.portal.dto.response.ApiResponse;
import com.grievance.portal.dto.response.ComplaintWithUsersResponse;
import com.grievance.portal.model.Complaint;
import com.grievance.portal.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * ComplaintController — handles /api/complaints/* endpoints.
 *
 * Routes (identical to Express):
 *   GET    /api/complaints            (admin)
 *   GET    /api/complaints/my         (citizen)
 *   GET    /api/complaints/officer    (officer)
 *   GET    /api/complaints/:id
 *   POST   /api/complaints            (citizen, multipart)
 *   PATCH  /api/complaints/:id/status (officer/admin)
 *   PATCH  /api/complaints/:id/assign (admin)
 */
@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;
    private final ObjectMapper objectMapper;

    /** GET /api/complaints — admin: all complaints */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ComplaintWithUsersResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok("Complaints fetched", complaintService.getAllComplaints()));
    }

    /** GET /api/complaints/my — citizen: own complaints */
    @GetMapping("/my")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<ApiResponse<List<ComplaintWithUsersResponse>>> getMy(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok("My complaints",
                complaintService.getMyComplaints(userDetails.getUsername())));
    }

    /** GET /api/complaints/officer — officer: assigned complaints */
    @GetMapping("/officer")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<ApiResponse<List<ComplaintWithUsersResponse>>> getOfficer(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok("Officer complaints",
                complaintService.getOfficerComplaints(userDetails.getUsername())));
    }

    /** GET /api/complaints/:id — any authenticated user */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ComplaintWithUsersResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok("Complaint fetched", complaintService.getComplaintById(id)));
    }

    /**
     * POST /api/complaints — citizen submits a complaint.
     * Uses multipart/form-data to support image file uploads.
     * Replaces Express Multer middleware.
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<ApiResponse<ComplaintWithUsersResponse>> create(
            @RequestPart("title")                          String title,
            @RequestPart("description")                    String description,
            @RequestPart("category")                       String category,
            @RequestPart(value = "location",        required = false) String locationJson,
            @RequestPart(value = "locationAddress", required = false) String locationAddress,
            @RequestPart(value = "locationLat",     required = false) String locationLat,
            @RequestPart(value = "locationLng",     required = false) String locationLng,
            @RequestPart(value = "images",          required = false) List<MultipartFile> images,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {

        ComplaintRequest req = new ComplaintRequest();
        req.setTitle(title);
        req.setDescription(description);
        req.setCategory(category);

        // Handle location sent as JSON string: {"latitude":13.6,"longitude":79.4}
        if (locationJson != null && !locationJson.isBlank()) {
            try {
                Complaint.Location loc = objectMapper.readValue(locationJson, Complaint.Location.class);
                req.setLocation(loc);
            } catch (Exception ignored) {}
        } else if (locationAddress != null) {
            Complaint.Location loc = new Complaint.Location();
            loc.setAddress(locationAddress);
            if (locationLat != null) loc.setLatitude(Double.parseDouble(locationLat));
            if (locationLng != null) loc.setLongitude(Double.parseDouble(locationLng));
            req.setLocation(loc);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Complaint submitted",
                complaintService.createComplaint(req, images, userDetails.getUsername())));
    }

    /** PATCH /api/complaints/:id/status — officer or admin updates status */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('OFFICER','ADMIN')")
    public ResponseEntity<ApiResponse<ComplaintWithUsersResponse>> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String role = userDetails.getAuthorities().iterator().next()
                .getAuthority().replace("ROLE_", "").toLowerCase();
        return ResponseEntity.ok(ApiResponse.ok("Status updated",
                complaintService.updateStatus(id, request, userDetails.getUsername(), role)));
    }

    /** PATCH /api/complaints/:id/assign — admin assigns officer */
    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ComplaintWithUsersResponse>> assign(
            @PathVariable String id,
            @Valid @RequestBody AssignRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Complaint assigned",
                complaintService.assignComplaint(id, request)));
    }

    /** PATCH /api/complaints/:id/reopen — citizen reopens a resolved complaint */
    @PatchMapping("/{id}/reopen")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<ApiResponse<ComplaintWithUsersResponse>> reopen(
            @PathVariable String id,
            @RequestBody java.util.Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        String reason = body.getOrDefault("reason", "Not satisfied with resolution");
        return ResponseEntity.ok(ApiResponse.ok("Complaint reopened",
                complaintService.reopenComplaint(id, reason, userDetails.getUsername())));
    }

    /** DELETE /api/complaints/:id — admin deletes a complaint */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.ok(ApiResponse.ok("Complaint deleted successfully"));
    }

    /** GET /api/complaints/locations — heatmap data (admin) */
    @GetMapping("/locations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ComplaintWithUsersResponse>>> getLocations(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok("Locations fetched",
                complaintService.getComplaintLocations(category, status)));
    }

    /** GET /api/complaints/officer/:id — officer gets one specific assigned complaint */
    @GetMapping("/officer/{id}")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<ApiResponse<ComplaintWithUsersResponse>> getOfficerComplaintById(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok("Complaint fetched",
                complaintService.getOfficerComplaintById(id, userDetails.getUsername())));
    }
}
