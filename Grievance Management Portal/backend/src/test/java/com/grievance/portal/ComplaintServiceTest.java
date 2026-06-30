package com.grievance.portal;

import com.grievance.portal.dto.request.AssignRequest;
import com.grievance.portal.dto.request.StatusUpdateRequest;
import com.grievance.portal.exception.ResourceNotFoundException;
import com.grievance.portal.exception.UnauthorizedException;
import com.grievance.portal.model.Complaint;
import com.grievance.portal.model.User;
import com.grievance.portal.repository.ComplaintRepository;
import com.grievance.portal.repository.UserRepository;
import com.grievance.portal.service.ComplaintService;
import com.grievance.portal.service.EmailService;
import com.grievance.portal.service.MLService;
import com.grievance.portal.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ComplaintServiceTest {

    @Mock ComplaintRepository complaintRepository;
    @Mock UserRepository       userRepository;
    @Mock NotificationService  notificationService;
    @Mock EmailService         emailService;
    @Mock MLService            mlService;
    @InjectMocks ComplaintService complaintService;

    private Complaint complaint;
    private User citizen;
    private User officer;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(complaintService, "uploadDir", "uploads");

        citizen = new User();
        citizen.setId("citizen-1");
        citizen.setName("Test Citizen");
        citizen.setEmail("citizen@test.com");
        citizen.setRole("citizen");

        officer = new User();
        officer.setId("officer-1");
        officer.setName("Test Officer");
        officer.setEmail("officer@test.com");
        officer.setRole("officer");

        complaint = new Complaint();
        complaint.setId("complaint-1");
        complaint.setTitle("Broken Road");
        complaint.setDescription("Large pothole on main road causing accidents");
        complaint.setCategory("Roads");
        complaint.setCitizenId("citizen-1");
        complaint.setStatus("Submitted");
    }

    // ── getComplaintById ─────────────────────────────────────────────

    @Test
    void getComplaintById_found_returnsPopulated() {
        when(complaintRepository.findById("complaint-1")).thenReturn(Optional.of(complaint));
        when(userRepository.findById("citizen-1")).thenReturn(Optional.of(citizen));

        var result = complaintService.getComplaintById("complaint-1");

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Broken Road");
        assertThat(result.getCitizenId().getName()).isEqualTo("Test Citizen");
    }

    @Test
    void getComplaintById_notFound_throwsResourceNotFoundException() {
        when(complaintRepository.findById("bad-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> complaintService.getComplaintById("bad-id"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("bad-id");
    }

    // ── updateStatus ─────────────────────────────────────────────────

    @Test
    void updateStatus_byAssignedOfficer_succeeds() {
        complaint.setOfficerId("officer-1");
        when(complaintRepository.findById("complaint-1")).thenReturn(Optional.of(complaint));
        when(complaintRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(userRepository.findById("citizen-1")).thenReturn(Optional.of(citizen));

        var req = new StatusUpdateRequest();
        req.setStatus("In Progress");
        req.setRemarks("Started work");

        var result = complaintService.updateStatus("complaint-1", req, "officer-1", "officer");

        assertThat(result.getStatus()).isEqualTo("In Progress");
        verify(notificationService).create(eq("citizen-1"), anyString(), anyString(), anyString(), eq("complaint-1"));
    }

    @Test
    void updateStatus_byUnassignedOfficer_throwsUnauthorized() {
        complaint.setOfficerId("officer-2");
        when(complaintRepository.findById("complaint-1")).thenReturn(Optional.of(complaint));

        var req = new StatusUpdateRequest();
        req.setStatus("In Progress");

        assertThatThrownBy(() -> complaintService.updateStatus("complaint-1", req, "officer-1", "officer"))
                .isInstanceOf(UnauthorizedException.class);
    }

    @Test
    void updateStatus_toResolved_setsResolvedAt() {
        complaint.setOfficerId("officer-1");
        when(complaintRepository.findById("complaint-1")).thenReturn(Optional.of(complaint));
        when(complaintRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(userRepository.findById("citizen-1")).thenReturn(Optional.of(citizen));
        doNothing().when(emailService).sendComplaintResolved(any(), any(), any(), any());

        var req = new StatusUpdateRequest();
        req.setStatus("Resolved");

        var result = complaintService.updateStatus("complaint-1", req, "officer-1", "officer");

        assertThat(result.getStatus()).isEqualTo("Resolved");
    }

    // ── assignComplaint ──────────────────────────────────────────────

    @Test
    void assignComplaint_validOfficer_succeeds() {
        when(complaintRepository.findById("complaint-1")).thenReturn(Optional.of(complaint));
        when(userRepository.findById("officer-1")).thenReturn(Optional.of(officer));
        when(complaintRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(userRepository.findById("citizen-1")).thenReturn(Optional.of(citizen));
        doNothing().when(emailService).sendComplaintAssigned(any(), any(), any(), any());

        var req = new AssignRequest();
        req.setOfficerId("officer-1");

        var result = complaintService.assignComplaint("complaint-1", req);

        assertThat(result.getStatus()).isEqualTo("Assigned");
        verify(notificationService).create(eq("officer-1"), contains("Assigned"), anyString(), anyString(), eq("complaint-1"));
    }

    // ── deleteComplaint ──────────────────────────────────────────────

    @Test
    void deleteComplaint_existing_deletesFromRepository() {
        when(complaintRepository.findById("complaint-1")).thenReturn(Optional.of(complaint));
        complaintService.deleteComplaint("complaint-1");
        verify(complaintRepository).delete(complaint);
    }

    @Test
    void deleteComplaint_notFound_throwsResourceNotFoundException() {
        when(complaintRepository.findById("x")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> complaintService.deleteComplaint("x"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    // ── getMyComplaints ──────────────────────────────────────────────

    @Test
    void getMyComplaints_returnsMappedList() {
        when(complaintRepository.findByCitizenIdOrderByCreatedAtDesc("citizen-1"))
                .thenReturn(List.of(complaint));
        when(userRepository.findById("citizen-1")).thenReturn(Optional.of(citizen));

        var result = complaintService.getMyComplaints("citizen-1");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Broken Road");
    }
}
