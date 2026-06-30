package com.grievance.portal.service;

import com.grievance.portal.dto.request.MessageRequest;
import com.grievance.portal.exception.ResourceNotFoundException;
import com.grievance.portal.exception.UnauthorizedException;
import com.grievance.portal.model.Communication;
import com.grievance.portal.model.Complaint;
import com.grievance.portal.model.User;
import com.grievance.portal.repository.CommunicationRepository;
import com.grievance.portal.repository.ComplaintRepository;
import com.grievance.portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommunicationService {

    private final CommunicationRepository communicationRepository;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public Communication sendMessage(MessageRequest request, String senderId, String role) {
        Complaint complaint = complaintRepository.findById(request.getComplaintId())
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        if ("citizen".equals(role) && !senderId.equals(complaint.getCitizenId())) {
            throw new UnauthorizedException("You can only message about your own complaints");
        }
        if ("officer".equals(role) && !senderId.equals(complaint.getOfficerId())) {
            throw new UnauthorizedException("You are not assigned to this complaint");
        }

        Communication comm = new Communication();
        comm.setComplaintId(request.getComplaintId());
        comm.setSenderId(senderId);
        comm.setReceiverId(request.getReceiverId());
        comm.setMessage(request.getMessage());
        comm.setRead(false);

        Communication saved = communicationRepository.save(comm);
        return populateSender(saved);
    }

    public List<Communication> getAndMarkRead(String complaintId, String userId) {
        List<Communication> messages = communicationRepository
                .findByComplaintIdOrderByCreatedAtAsc(complaintId);

        messages.stream()
                .filter(m -> userId.equals(m.getReceiverId()) && !m.isRead())
                .forEach(m -> {
                    m.setRead(true);
                    communicationRepository.save(m);
                });

        return messages.stream().map(this::populateSender).toList();
    }

    public long getUnreadCount(String userId) {
        return communicationRepository.countByReceiverIdAndReadFalse(userId);
    }

    /**
     * Populate senderId field with full user object (name, role)
     * so the frontend can display sender name and align messages correctly.
     */
    private Communication populateSender(Communication comm) {
        if (comm.getSenderId() != null) {
            userRepository.findById(comm.getSenderId()).ifPresent(user -> {
                // Store sender info as a nested object by overriding senderId
                // We use a transient approach — embed name/role into a map
                comm.setSenderName(user.getName());
                comm.setSenderRole(user.getRole());
            });
        }
        return comm;
    }
}
