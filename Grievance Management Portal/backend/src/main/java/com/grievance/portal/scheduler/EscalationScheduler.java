package com.grievance.portal.scheduler;

import com.grievance.portal.model.Complaint;
import com.grievance.portal.model.Department;
import com.grievance.portal.repository.ComplaintRepository;
import com.grievance.portal.repository.DepartmentRepository;
import com.grievance.portal.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * EscalationScheduler — replaces Node.js escalationSystem.js
 *
 * Runs every hour and checks all non-resolved complaints.
 * If a complaint has exceeded its department's SLA hours without resolution,
 * it is marked as escalated and the citizen is notified.
 *
 * Equivalent to Express:
 *   setInterval(checkEscalations, 60 * 60 * 1000)
 */
@Slf4j
@Component
@EnableScheduling
@RequiredArgsConstructor
public class EscalationScheduler {

    private final ComplaintRepository complaintRepository;
    private final DepartmentRepository departmentRepository;
    private final NotificationService notificationService;

    /**
     * Runs every hour (3600000 ms).
     * Checks all non-resolved, non-escalated complaints for SLA breach.
     */
    @Scheduled(fixedRate = 3_600_000)
    public void checkEscalations() {
        log.info("Running escalation check...");

        // Default SLA: 72 hours if no department assigned
        int defaultSlaHours = 72;

        List<Complaint> candidates = complaintRepository
                .findNonResolvedCreatedBefore(Instant.now().minus(defaultSlaHours, ChronoUnit.HOURS));

        int escalated = 0;
        for (Complaint complaint : candidates) {
            int slaHours = defaultSlaHours;

            // Use department-specific SLA if available
            if (complaint.getDepartmentId() != null) {
                slaHours = departmentRepository.findById(complaint.getDepartmentId())
                        .map(Department::getSlaHours)
                        .orElse(defaultSlaHours);
            }

            Instant cutoff = complaint.getCreatedAt().plus(slaHours, ChronoUnit.HOURS);
            if (Instant.now().isAfter(cutoff)) {
                complaint.setEscalated(true);
                complaintRepository.save(complaint);

                // Notify the citizen
                notificationService.create(
                        complaint.getCitizenId(),
                        "Complaint Escalated",
                        "Your complaint \"" + complaint.getTitle()
                                + "\" has been escalated due to delayed resolution.",
                        "status_updated",
                        complaint.getId()
                );
                escalated++;
                log.info("Escalated complaint [{}]: {}", complaint.getId(), complaint.getTitle());
            }
        }

        if (escalated > 0) {
            log.info("Escalation check complete. {} complaint(s) escalated.", escalated);
        } else {
            log.debug("Escalation check complete. No complaints escalated.");
        }
    }
}
