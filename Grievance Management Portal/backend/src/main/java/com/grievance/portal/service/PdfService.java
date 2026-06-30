package com.grievance.portal.service;

import com.grievance.portal.exception.ResourceNotFoundException;
import com.grievance.portal.model.Complaint;
import com.grievance.portal.model.User;
import com.grievance.portal.repository.ComplaintRepository;
import com.grievance.portal.repository.UserRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.pdf.draw.LineSeparator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * PdfService — generates PDF reports for complaints.
 * Uses iText 5 library.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PdfService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    private static final DateTimeFormatter FMT =
            DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a").withZone(ZoneId.systemDefault());

    private static final BaseColor PRIMARY   = new BaseColor(25, 118, 210);
    private static final BaseColor LIGHT_BG  = new BaseColor(232, 240, 254);
    private static final BaseColor GRAY_TEXT = new BaseColor(100, 100, 100);

    /**
     * Generate PDF for a single complaint.
     */
    public byte[] generateComplaintPdf(String complaintId, String requestingUserId) {
        Complaint c = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found: " + complaintId));

        User citizen = userRepository.findById(c.getCitizenId()).orElse(null);
        User officer = c.getOfficerId() != null
                ? userRepository.findById(c.getOfficerId()).orElse(null) : null;

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4, 50, 50, 60, 60);
            PdfWriter.getInstance(doc, out);
            doc.open();

            addHeader(doc, c);
            addSection(doc, "Complaint Details");
            addField(doc, "Complaint ID",  "#" + c.getId().substring(Math.max(0, c.getId().length() - 8)));
            addField(doc, "Title",         c.getTitle());
            addField(doc, "Category",      c.getCategory());
            addField(doc, "Status",        c.getStatus());
            addField(doc, "Priority Score", String.valueOf(c.getPriorityScore()));
            addField(doc, "Submitted At",  c.getSubmittedAt() != null ? FMT.format(c.getSubmittedAt()) : "N/A");
            if (c.getResolvedAt() != null)
                addField(doc, "Resolved At", FMT.format(c.getResolvedAt()));

            addSection(doc, "Description");
            doc.add(new Paragraph(c.getDescription() != null ? c.getDescription() : "N/A",
                    FontFactory.getFont(FontFactory.HELVETICA, 11, GRAY_TEXT)));
            doc.add(Chunk.NEWLINE);

            if (c.getLocation() != null && c.getLocation().getLatitude() != 0) {
                addSection(doc, "Location");
                addField(doc, "Address",   c.getLocation().getAddress() != null ? c.getLocation().getAddress() : "N/A");
                addField(doc, "Latitude",  String.valueOf(c.getLocation().getLatitude()));
                addField(doc, "Longitude", String.valueOf(c.getLocation().getLongitude()));
            }

            addSection(doc, "People Involved");
            addField(doc, "Citizen",  citizen != null ? citizen.getName() + " (" + citizen.getEmail() + ")" : "N/A");
            addField(doc, "Officer",  officer != null ? officer.getName() + " (" + officer.getEmail() + ")" : "Not Assigned");

            if (c.getRemarks() != null && !c.getRemarks().isBlank()) {
                addSection(doc, "Officer Remarks");
                doc.add(new Paragraph(c.getRemarks(),
                        FontFactory.getFont(FontFactory.HELVETICA, 11, GRAY_TEXT)));
                doc.add(Chunk.NEWLINE);
            }

            if (c.getStatusHistory() != null && !c.getStatusHistory().isEmpty()) {
                addSection(doc, "Status Timeline");
                for (Complaint.StatusHistory h : c.getStatusHistory()) {
                    String line = "• " + h.getStatus()
                            + (h.getUpdatedAt() != null ? "  —  " + FMT.format(h.getUpdatedAt()) : "")
                            + (h.getRemarks() != null ? "\n  " + h.getRemarks() : "");
                    doc.add(new Paragraph(line,
                            FontFactory.getFont(FontFactory.HELVETICA, 10, GRAY_TEXT)));
                }
                doc.add(Chunk.NEWLINE);
            }

            addFooter(doc);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("PDF generation failed: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate PDF: " + e.getMessage());
        }
    }

    /**
     * Generate PDF for all complaints of a citizen.
     */
    public byte[] generateMyComplaintsPdf(String citizenId) {
        List<Complaint> complaints = complaintRepository.findByCitizenIdOrderByCreatedAtDesc(citizenId);
        User citizen = userRepository.findById(citizenId).orElse(null);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate(), 40, 40, 50, 50);
            PdfWriter.getInstance(doc, out);
            doc.open();

            // Title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, PRIMARY);
            Paragraph title = new Paragraph("My Complaint History", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            doc.add(title);

            if (citizen != null) {
                Font subFont = FontFactory.getFont(FontFactory.HELVETICA, 11, GRAY_TEXT);
                Paragraph sub = new Paragraph("Citizen: " + citizen.getName() + " | " + citizen.getEmail(), subFont);
                sub.setAlignment(Element.ALIGN_CENTER);
                doc.add(sub);
            }
            doc.add(Chunk.NEWLINE);

            // Table
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1.5f, 3f, 2f, 2f, 2f, 2f});

            addTableHeader(table, "ID", "Title", "Category", "Status", "Submitted", "Resolved");

            for (Complaint c : complaints) {
                addTableCell(table, "#" + c.getId().substring(Math.max(0, c.getId().length() - 6)));
                addTableCell(table, c.getTitle());
                addTableCell(table, c.getCategory());
                addTableCell(table, c.getStatus());
                addTableCell(table, c.getSubmittedAt() != null ? FMT.format(c.getSubmittedAt()) : "N/A");
                addTableCell(table, c.getResolvedAt() != null ? FMT.format(c.getResolvedAt()) : "Pending");
            }

            doc.add(table);
            doc.add(Chunk.NEWLINE);
            addFooter(doc);
            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("PDF generation failed: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate PDF: " + e.getMessage());
        }
    }

    // ─── Helpers ─────────────────────────────────────────────────────

    private void addHeader(Document doc, Complaint c) throws DocumentException {
        Font portalFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, PRIMARY);
        Paragraph portal = new Paragraph("🏛 Grievance Management Portal", portalFont);
        portal.setAlignment(Element.ALIGN_CENTER);
        doc.add(portal);

        Font subFont = FontFactory.getFont(FontFactory.HELVETICA, 11, GRAY_TEXT);
        Paragraph sub = new Paragraph("Official Complaint Report", subFont);
        sub.setAlignment(Element.ALIGN_CENTER);
        doc.add(sub);
        doc.add(Chunk.NEWLINE);

        // Colored status banner
        PdfPTable banner = new PdfPTable(1);
        banner.setWidthPercentage(100);
        PdfPCell cell = new PdfPCell(new Phrase("Status: " + c.getStatus(),
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.WHITE)));
        cell.setBackgroundColor(PRIMARY);
        cell.setPadding(8);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setBorder(Rectangle.NO_BORDER);
        banner.addCell(cell);
        doc.add(banner);
        doc.add(Chunk.NEWLINE);
    }

    private void addSection(Document doc, String title) throws DocumentException {
        Font f = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, PRIMARY);
        Paragraph p = new Paragraph(title, f);
        p.setSpacingBefore(10);
        doc.add(p);

        LineSeparator line = new LineSeparator();
        line.setLineColor(PRIMARY);
        line.setLineWidth(1);
        doc.add(new Chunk(line));
        doc.add(Chunk.NEWLINE);
    }

    private void addField(Document doc, String label, String value) throws DocumentException {
        Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, BaseColor.BLACK);
        Font valueFont = FontFactory.getFont(FontFactory.HELVETICA, 11, GRAY_TEXT);
        Paragraph p = new Paragraph();
        p.add(new Chunk(label + ": ", labelFont));
        p.add(new Chunk(value != null ? value : "N/A", valueFont));
        p.setSpacingAfter(4);
        doc.add(p);
    }

    private void addTableHeader(PdfPTable table, String... headers) {
        Font f = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.WHITE);
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, f));
            cell.setBackgroundColor(PRIMARY);
            cell.setPadding(6);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }
    }

    private void addTableCell(PdfPTable table, String value) {
        Font f = FontFactory.getFont(FontFactory.HELVETICA, 9, GRAY_TEXT);
        PdfPCell cell = new PdfPCell(new Phrase(value != null ? value : "N/A", f));
        cell.setPadding(5);
        table.addCell(cell);
    }

    private void addFooter(Document doc) throws DocumentException {
        Font f = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 9, GRAY_TEXT);
        Paragraph footer = new Paragraph(
                "Generated by Grievance Management Portal  •  " + FMT.format(java.time.Instant.now()), f);
        footer.setAlignment(Element.ALIGN_CENTER);
        doc.add(footer);
    }
}
