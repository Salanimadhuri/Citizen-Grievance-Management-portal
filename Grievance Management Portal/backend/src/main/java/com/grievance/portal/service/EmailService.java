package com.grievance.portal.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

/**
 * EmailService — sends HTML email notifications to citizens and officers.
 * Only active when app.mail.enabled=true.
 */
@Slf4j
@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.mail.from:noreply@grievanceportal.gov}")
    private String fromEmail;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    /**
     * Send complaint submitted confirmation to citizen.
     */
    @Async
    public void sendComplaintSubmitted(String toEmail, String citizenName,
                                        String complaintTitle, String complaintId) {
        String subject = "Complaint Submitted Successfully - #" + complaintId.substring(Math.max(0, complaintId.length() - 8));
        String html = buildHtml(
            "Complaint Submitted",
            "Dear " + citizenName + ",",
            "Your complaint <strong>\"" + complaintTitle + "\"</strong> has been submitted successfully.",
            "Our team will review it shortly and assign it to the appropriate department.",
            "Complaint ID: <strong>#" + complaintId.substring(Math.max(0, complaintId.length() - 8)) + "</strong>",
            "#1976D2"
        );
        send(toEmail, subject, html);
    }

    /**
     * Send status update notification to citizen.
     */
    @Async
    public void sendStatusUpdate(String toEmail, String citizenName,
                                  String complaintTitle, String newStatus, String complaintId) {
        String subject = "Complaint Status Updated: " + newStatus;
        String color = switch (newStatus) {
            case "Resolved"    -> "#4CAF50";
            case "In Progress" -> "#FF9800";
            case "Assigned"    -> "#2196F3";
            default            -> "#1976D2";
        };
        String html = buildHtml(
            "Status Update",
            "Dear " + citizenName + ",",
            "Your complaint <strong>\"" + complaintTitle + "\"</strong> status has been updated.",
            "New Status: <strong style='color:" + color + "'>" + newStatus + "</strong>",
            "Complaint ID: <strong>#" + complaintId.substring(Math.max(0, complaintId.length() - 8)) + "</strong>",
            color
        );
        send(toEmail, subject, html);
    }

    /**
     * Send assignment notification to officer.
     */
    @Async
    public void sendComplaintAssigned(String toEmail, String officerName,
                                       String complaintTitle, String complaintId) {
        String subject = "New Complaint Assigned to You";
        String html = buildHtml(
            "New Assignment",
            "Dear " + officerName + ",",
            "A new complaint has been assigned to you.",
            "Complaint: <strong>\"" + complaintTitle + "\"</strong>",
            "Please log in to the portal to review and take action.",
            "#1976D2"
        );
        send(toEmail, subject, html);
    }

    /**
     * Send complaint resolved notification to citizen.
     */
    @Async
    public void sendComplaintResolved(String toEmail, String citizenName,
                                       String complaintTitle, String complaintId) {
        String subject = "Your Complaint Has Been Resolved ✓";
        String html = buildHtml(
            "Complaint Resolved",
            "Dear " + citizenName + ",",
            "Great news! Your complaint <strong>\"" + complaintTitle + "\"</strong> has been resolved.",
            "Please log in to the portal to provide your feedback and rating.",
            "Complaint ID: <strong>#" + complaintId.substring(Math.max(0, complaintId.length() - 8)) + "</strong>",
            "#4CAF50"
        );
        send(toEmail, subject, html);
    }

    /**
     * Send complaint reopened notification to admin.
     */
    @Async
    public void sendComplaintReopened(String toEmail, String adminName,
                                       String complaintTitle, String reason) {
        String subject = "Complaint Reopened by Citizen";
        String html = buildHtml(
            "Complaint Reopened",
            "Dear " + adminName + ",",
            "A citizen has reopened complaint: <strong>\"" + complaintTitle + "\"</strong>",
            "Reason: " + reason,
            "Please log in to review and reassign.",
            "#FF9800"
        );
        send(toEmail, subject, html);
    }

    private void send(String to, String subject, String htmlBody) {
        if (!mailEnabled || mailSender == null) {
            log.info("Email disabled. Would send to {}: {}", to, subject);
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.info("Email sent to {}: {}", to, subject);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    private String buildHtml(String heading, String greeting, String line1,
                               String line2, String line3, String accentColor) {
        return """
            <!DOCTYPE html>
            <html>
            <body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px">
              <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
                <div style="background:%s;padding:24px;text-align:center">
                  <h1 style="color:#fff;margin:0;font-size:22px">🏛️ Grievance Portal</h1>
                  <p style="color:rgba(255,255,255,0.9);margin:8px 0 0">%s</p>
                </div>
                <div style="padding:32px">
                  <p style="font-size:16px;color:#333">%s</p>
                  <p style="font-size:15px;color:#555">%s</p>
                  <p style="font-size:15px;color:#555">%s</p>
                  <p style="font-size:14px;color:#888;margin-top:8px">%s</p>
                  <div style="margin-top:24px;padding-top:16px;border-top:1px solid #eee">
                    <p style="font-size:12px;color:#aaa;text-align:center">
                      This is an automated message from the Citizen Grievance Management Portal.<br/>
                      Please do not reply to this email.
                    </p>
                  </div>
                </div>
              </div>
            </body>
            </html>
            """.formatted(accentColor, heading, greeting, line1, line2, line3);
    }
}
