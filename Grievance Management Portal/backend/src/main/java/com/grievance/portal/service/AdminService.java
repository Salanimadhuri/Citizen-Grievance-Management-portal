package com.grievance.portal.service;

import com.grievance.portal.dto.request.CreateOfficerRequest;
import com.grievance.portal.dto.request.UpdateOfficerRequest;
import com.grievance.portal.dto.response.AnalyticsResponse;
import com.grievance.portal.dto.response.UserResponse;
import com.grievance.portal.exception.BadRequestException;
import com.grievance.portal.exception.ResourceNotFoundException;
import com.grievance.portal.model.Complaint;
import com.grievance.portal.model.User;
import com.grievance.portal.repository.ComplaintRepository;
import com.grievance.portal.repository.DepartmentRepository;
import com.grievance.portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;
    private final PasswordEncoder passwordEncoder;
    private final DepartmentRepository departmentRepository;

    // ─── OFFICER MANAGEMENT ──────────────────────────────────────────

    /** Admin directly creates an officer with approved status. Returns raw User. */
    public User createOfficer(CreateOfficerRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("User already exists with email: " + request.getEmail());
        }
        User officer = new User();
        officer.setName(request.getName());
        officer.setEmail(request.getEmail());
        officer.setPassword(passwordEncoder.encode(request.getPassword()));
        officer.setPhone(request.getPhone());
        officer.setRole("officer");
        officer.setStatus("approved");
        officer.setDepartment(request.getDepartmentId());
        officer = userRepository.save(officer);
        log.info("Admin created officer: {} in dept: {}", officer.getEmail(), officer.getDepartment());
        return officer;
    }

    /** Get all officers (approved + pending). Returns raw User list. */
    public List<User> getPendingOfficers() {
        return userRepository.findByRoleAndStatus("officer", "pending");
    }

    public List<UserResponse> getAllOfficers() {
        return userRepository.findByRoleOrderByNameAsc("officer")
                .stream()
                .filter(u -> List.of("approved", "pending").contains(u.getStatus()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getOfficersByDepartment(String departmentId) {
        return userRepository.findByRoleAndDepartment("officer", departmentId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<UserResponse> getOfficerRequests() {
        return userRepository.findByRoleAndStatus("officer", "pending")
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /** Approve officer — returns raw User for controller helper. */
    public User approveOfficer(String officerId) {
        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found: " + officerId));
        if (!"officer".equals(officer.getRole())) throw new BadRequestException("User is not an officer");
        officer.setStatus("approved");
        officer = userRepository.save(officer);
        log.info("Approved officer: {}", officer.getEmail());
        return officer;
    }

    /** Reject officer — returns raw User for controller helper. */
    public User rejectOfficer(String officerId, String reason) {
        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found: " + officerId));
        if (!"officer".equals(officer.getRole())) throw new BadRequestException("User is not an officer");
        officer.setStatus("rejected");
        officer = userRepository.save(officer);
        log.info("Rejected officer: {}", officer.getEmail());
        return officer;
    }

    public UserResponse updateOfficer(String officerId, UpdateOfficerRequest request) {
        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found: " + officerId));
        if (request.getName() != null && !request.getName().isBlank()) officer.setName(request.getName());
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (!request.getEmail().equals(officer.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email already in use");
            }
            officer.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) officer.setPhone(request.getPhone());
        if (request.getDepartment() != null) officer.setDepartment(request.getDepartment());
        return toResponse(userRepository.save(officer));
    }

    /** Update only the department field of an officer. */
    public void updateOfficerDepartment(String officerId, String departmentId) {
        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found: " + officerId));
        officer.setDepartment(departmentId);
        userRepository.save(officer);
    }

    // ─── ESCALATION ──────────────────────────────────────────────────

    /** Manually escalate a complaint — sets escalated=true. */
    public Complaint escalateComplaint(String complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found: " + complaintId));
        complaint.setEscalated(true);
        return complaintRepository.save(complaint);
    }

    // ─── ANALYTICS ───────────────────────────────────────────────────

    /** Dashboard stats map — used by /api/admin/dashboard and /api/admin/complaints/stats */
    public Map<String, Object> getDashboardStats() {
        long total     = complaintRepository.count();
        long pending   = complaintRepository.countByStatus("Submitted")
                       + complaintRepository.countByStatus("Under Review");
        long inProgress = complaintRepository.countByStatus("Assigned")
                        + complaintRepository.countByStatus("In Progress")
                        + complaintRepository.countByStatus("Work Scheduled");
        long resolved  = complaintRepository.countByStatus("Resolved");
        long officers  = userRepository.findByRoleAndStatus("officer", "approved").size();
        long citizens  = userRepository.findByRole("citizen").size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalComplaints", total);
        stats.put("pendingComplaints", pending);
        stats.put("inProgressComplaints", inProgress);
        stats.put("resolvedComplaints", resolved);
        stats.put("totalOfficers", officers);
        stats.put("totalCitizens", citizens);
        return stats;
    }

    /** AI insights — aggregates AI fields stored on complaints */
    public Map<String, Object> getAIInsights() {
        List<Complaint> all = complaintRepository.findAllByOrderByCreatedAtDesc();
        long aiProcessed = all.stream().filter(c -> c.getAiCategory() != null).count();

        Map<String, Long> bySentiment = all.stream()
                .filter(c -> c.getAiSentiment() != null)
                .collect(Collectors.groupingBy(Complaint::getAiSentiment, Collectors.counting()));

        Map<String, Long> byPriority = all.stream()
                .filter(c -> c.getAiPriority() != null)
                .collect(Collectors.groupingBy(Complaint::getAiPriority, Collectors.counting()));

        Map<String, Long> byAiCategory = all.stream()
                .filter(c -> c.getAiCategory() != null)
                .collect(Collectors.groupingBy(Complaint::getAiCategory, Collectors.counting()));

        Map<String, Object> result = new HashMap<>();
        result.put("aiProcessed", aiProcessed);
        result.put("totalComplaints", all.size());
        result.put("bySentiment", bySentiment);
        result.put("byPriority", byPriority);
        result.put("byAiCategory", byAiCategory);
        return result;
    }

    /** Full analytics response — used by /api/admin/analytics */
    public Map<String, Object> getAnalytics() {
        long total      = complaintRepository.count();
        long pending    = complaintRepository.countByStatus("Submitted")
                        + complaintRepository.countByStatus("Under Review");
        long inProgress = complaintRepository.countByStatus("Assigned")
                        + complaintRepository.countByStatus("In Progress")
                        + complaintRepository.countByStatus("Work Scheduled");
        long resolved   = complaintRepository.countByStatus("Resolved");

        List<String> categories = List.of(
                "Road & Infrastructure", "Water Supply", "Electricity",
                "Waste Management", "Public Safety", "Other");
        List<Map<String, Object>> byCategory = categories.stream().map(cat -> {
            Map<String, Object> e = new HashMap<>();
            e.put("name", cat);
            e.put("value", complaintRepository.findByCategoryOrderByCreatedAtDesc(cat).size());
            return e;
        }).filter(e -> (int) e.get("value") > 0).collect(Collectors.toList());

        List<String> statuses = List.of(
                "Submitted", "Under Review", "Assigned", "In Progress", "Work Scheduled", "Resolved");
        List<Map<String, Object>> byStatus = statuses.stream().map(s -> {
            Map<String, Object> e = new HashMap<>();
            e.put("name", s);
            e.put("value", complaintRepository.countByStatus(s));
            return e;
        }).filter(e -> (long) e.get("value") > 0).collect(Collectors.toList());

        Map<String, Object> statsMap = new HashMap<>();
        statsMap.put("total", total);
        statsMap.put("pending", pending);
        statsMap.put("inProgress", inProgress);
        statsMap.put("resolved", resolved);

        Map<String, Object> result = new HashMap<>();
        result.put("stats", statsMap);
        result.put("byCategory", byCategory);
        result.put("byStatus", byStatus);
        result.put("resolutionRate", List.of(Map.of("name", "Current", "resolved", resolved, "pending", pending + inProgress)));
        result.put("departmentPerformance", List.of());
        result.put("monthlyTrends", List.of());
        return result;
    }

    public UserResponse toResponse(User u) {
        String deptName = null;
        if (u.getDepartment() != null) {
            deptName = departmentRepository.findById(u.getDepartment())
                    .map(d -> d.getName()).orElse(null);
        }
        return UserResponse.builder()
                .id(u.getId()).name(u.getName()).email(u.getEmail())
                .role(u.getRole()).status(u.getStatus()).phone(u.getPhone())
                .address(u.getAddress()).department(u.getDepartment())
                .departmentName(deptName)
                .avatar(u.getAvatar()).createdAt(u.getCreatedAt()).updatedAt(u.getUpdatedAt())
                .build();
    }
}
