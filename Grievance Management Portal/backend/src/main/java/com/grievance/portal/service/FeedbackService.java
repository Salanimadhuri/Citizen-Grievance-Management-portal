package com.grievance.portal.service;

import com.grievance.portal.dto.request.FeedbackRequest;
import com.grievance.portal.exception.BadRequestException;
import com.grievance.portal.exception.ResourceNotFoundException;
import com.grievance.portal.exception.UnauthorizedException;
import com.grievance.portal.model.Complaint;
import com.grievance.portal.model.Feedback;
import com.grievance.portal.repository.ComplaintRepository;
import com.grievance.portal.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final ComplaintRepository complaintRepository;

    public Feedback createFeedback(FeedbackRequest request, String userId) {
        Complaint complaint = complaintRepository.findById(request.getComplaintId())
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        if (!"Resolved".equals(complaint.getStatus())) {
            throw new BadRequestException("Feedback can only be submitted for resolved complaints");
        }
        if (!userId.equals(complaint.getCitizenId())) {
            throw new UnauthorizedException("You can only submit feedback for your own complaints");
        }
        feedbackRepository.findByComplaintIdAndUserId(request.getComplaintId(), userId)
                .ifPresent(f -> { throw new BadRequestException("You have already submitted feedback for this complaint"); });

        Feedback feedback = new Feedback();
        feedback.setComplaintId(request.getComplaintId());
        feedback.setUserId(userId);
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());

        // Mark complaint as having feedback
        complaint.setFeedbackSubmitted(true);
        complaintRepository.save(complaint);

        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getOfficerFeedback(String officerId) {
        List<String> ids = complaintRepository.findByOfficerId(officerId)
                .stream().map(Complaint::getId).collect(Collectors.toList());
        return feedbackRepository.findByComplaintIdIn(ids);
    }

    public List<Feedback> getRecentFeedback(int limit) {
        return feedbackRepository.findAllByOrderByCreatedAtDesc()
                .stream().limit(limit).collect(Collectors.toList());
    }

    public Feedback getFeedbackForComplaint(String complaintId) {
        return feedbackRepository.findByComplaintId(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("No feedback found for this complaint"));
    }
}
