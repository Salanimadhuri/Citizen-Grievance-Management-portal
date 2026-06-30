package com.grievance.portal.controller;

import com.grievance.portal.dto.request.CreateOfficerRequest;
import com.grievance.portal.dto.request.UpdateOfficerRequest;
import com.grievance.portal.dto.response.ApiResponse;
import com.grievance.portal.dto.response.UserResponse;
import com.grievance.portal.model.Department;
import com.grievance.portal.model.User;
import com.grievance.portal.service.AdminService;
import com.grievance.portal.service.ComplaintService;
import com.grievance.portal.service.DepartmentService;
import com.grievance.portal.service.MLService;
import com.grievance.portal.service.UserService;
import com.grievance.portal.dto.response.ComplaintWithUsersResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * AdminController — /api/admin/*
 *
 * Mirrors Express adminRoutes.js exactly:
 *   POST   /api/admin/create-officer
 *   GET    /api/admin/officers
 *   GET    /api/admin/officers/department/:departmentId
 *   GET    /api/admin/officer-requests
 *   PATCH  /api/admin/approve-officer/:id
 *   PATCH  /api/admin/reject-officer/:id
 *   PATCH  /api/admin/officers/:id
 *   GET    /api/admin/analytics
 *   GET    /api/admin/stats
 *   GET    /api/admin/charts
 *
 * Plus extra admin-only routes:
 *   GET    /api/admin/dashboard
 *   GET    /api/admin/departments
 *   PATCH  /api/admin/complaints/:id/escalate
 *   DELETE /api/admin/users/:id
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final DepartmentService departmentService;
    private final ComplaintService complaintService;
    private final UserService userService;
    private final MLService mlService;

    // ─── DASHBOARD ───────────────────────────────────────────────────

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.ok("Dashboard stats", adminService.getDashboardStats()));
    }

    // ─── DEPARTMENTS ─────────────────────────────────────────────────

    @GetMapping("/departments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Department>>> getDepartments() {
        return ResponseEntity.ok(ApiResponse.ok("Departments", departmentService.getAllDepartments()));
    }

    // ─── OFFICER MANAGEMENT ──────────────────────────────────────────

    /** POST /api/admin/create-officer — admin creates officer (approved immediately) */
    @PostMapping("/create-officer")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> createOfficer(
            @Valid @RequestBody CreateOfficerRequest request) {
        User officer = adminService.createOfficer(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Officer created successfully", userService.toResponse(officer)));
    }

    /** GET /api/admin/officers — all officers */
    @GetMapping("/officers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllOfficers() {
        return ResponseEntity.ok(ApiResponse.ok("Officers fetched", adminService.getAllOfficers()));
    }

    /** GET /api/admin/officers/department/:departmentId */
    @GetMapping("/officers/department/{departmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getOfficersByDepartment(
            @PathVariable String departmentId) {
        return ResponseEntity.ok(ApiResponse.ok("Officers by department",
                adminService.getOfficersByDepartment(departmentId)));
    }

    /** GET /api/admin/officer-requests — pending officer registrations */
    @GetMapping("/officer-requests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getOfficerRequests() {
        return ResponseEntity.ok(ApiResponse.ok("Officer requests", adminService.getOfficerRequests()));
    }

    /** PATCH /api/admin/approve-officer/:id */
    @PatchMapping("/approve-officer/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> approveOfficer(@PathVariable String id) {
        User officer = adminService.approveOfficer(id);
        return ResponseEntity.ok(ApiResponse.ok("Officer approved successfully", userService.toResponse(officer)));
    }

    /** PATCH /api/admin/reject-officer/:id */
    @PatchMapping("/reject-officer/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> rejectOfficer(@PathVariable String id) {
        User officer = adminService.rejectOfficer(id, null);
        return ResponseEntity.ok(ApiResponse.ok("Officer rejected successfully", userService.toResponse(officer)));
    }

    /** PATCH /api/admin/officers/:id — update officer details */
    @PatchMapping("/officers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> updateOfficer(
            @PathVariable String id,
            @Valid @RequestBody UpdateOfficerRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Officer updated", adminService.updateOfficer(id, request)));
    }

    // ─── AI INSIGHTS ─────────────────────────────────────────────────

    /** GET /api/admin/ai-insights — AI summary for dashboard */
    @GetMapping("/ai-insights")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAIInsights() {
        return ResponseEntity.ok(ApiResponse.ok("AI insights", adminService.getAIInsights()));
    }

    // ─── ANALYTICS ───────────────────────────────────────────────────

    /** GET /api/admin/analytics — full analytics for charts */
    @GetMapping("/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.ok("Analytics data", adminService.getAnalytics()));
    }

    /** GET /api/admin/stats — alias for analytics */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok("Stats", adminService.getAnalytics()));
    }

    /** GET /api/admin/charts — alias for analytics */
    @GetMapping("/charts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCharts() {
        return ResponseEntity.ok(ApiResponse.ok("Charts data", adminService.getAnalytics()));
    }

    // ─── COMPLAINT OVERRIDES ─────────────────────────────────────────

    /** PATCH /api/admin/complaints/:id/escalate — manually escalate */
    @PatchMapping("/complaints/{id}/escalate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ComplaintWithUsersResponse>> escalate(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok("Complaint escalated",
                complaintService.populate(adminService.escalateComplaint(id))));
    }

    // ─── USER MANAGEMENT ─────────────────────────────────────────────

    /** DELETE /api/admin/users/:id */
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.ok("User deleted successfully"));
    }
}
