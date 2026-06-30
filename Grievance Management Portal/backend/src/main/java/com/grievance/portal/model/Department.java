package com.grievance.portal.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

/**
 * Department model — maps to the 'departments' collection.
 *
 * Equivalent to Mongoose Department schema:
 *   { name (unique), slaHours, contactEmail, timestamps }
 *
 * Departments are created by admin and assigned to complaints.
 * Officers belong to a department.
 */
@Data
@NoArgsConstructor
@Document(collection = "departments")
public class Department {

    @Id
    private String id;

    private String name;

    /**
     * Service Level Agreement hours — how many hours to resolve a complaint.
     * Used by the escalation scheduler to detect overdue complaints.
     */
    private int slaHours;

    /**
     * Contact email for the department.
     */
    private String contactEmail;

    @CreatedDate
    @Field("createdAt")
    private Instant createdAt;

    @LastModifiedDate
    @Field("updatedAt")
    private Instant updatedAt;
}
