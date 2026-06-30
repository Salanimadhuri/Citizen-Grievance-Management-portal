package com.grievance.portal.controller;

import com.grievance.portal.service.PdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * PdfController — handles PDF export endpoints.
 *
 * GET /api/pdf/complaint/:id       — single complaint PDF
 * GET /api/pdf/my-complaints       — citizen's full complaint history PDF
 */
@RestController
@RequestMapping("/api/pdf")
@RequiredArgsConstructor
public class PdfController {

    private final PdfService pdfService;

    /** GET /api/pdf/complaint/:id — download single complaint as PDF */
    @GetMapping("/complaint/{id}")
    public ResponseEntity<byte[]> downloadComplaint(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {

        byte[] pdf = pdfService.generateComplaintPdf(id, userDetails.getUsername());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"complaint-" + id.substring(Math.max(0, id.length() - 8)) + ".pdf\"")
                .body(pdf);
    }

    /** GET /api/pdf/my-complaints — citizen downloads all their complaints as PDF */
    @GetMapping("/my-complaints")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<byte[]> downloadMyComplaints(
            @AuthenticationPrincipal UserDetails userDetails) {

        byte[] pdf = pdfService.generateMyComplaintsPdf(userDetails.getUsername());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"my-complaints.pdf\"")
                .body(pdf);
    }
}
