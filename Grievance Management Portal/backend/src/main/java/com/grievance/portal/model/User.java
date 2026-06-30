package com.grievance.portal.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

/**
 * User model — maps to the 'users' collection in MongoDB.
 *
 * Equivalent to Mongoose User schema:
 *   { name, email, phone, password, role, status, department, timestamps }
 *
 * Roles:
 *   "citizen"  — submits and tracks complaints
 *   "officer"  — manages and resolves assigned complaints
 *   "admin"    — full system access, assigns officers
 *
 * Status (for officers):
 *   "pending"  — registered, awaiting admin approval
 *   "approved" — active officer
 *   "rejected" — rejected by admin
 */
@Data
@NoArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    private String email;

    /**
     * Hashed password — never serialized to JSON responses.
     * BCryptPasswordEncoder replaces bcryptjs.
     */
    @JsonIgnore
    private String password;

    /**
     * Role-based access control.
     * Values: "citizen", "officer", "admin"
     */
    private String role = "citizen";

    /**
     * Account status — primarily used for officer approval workflow.
     * Values: "pending", "approved", "rejected"
     * Citizens are auto-approved on registration.
     * Officers start as "pending" until admin approves.
     */
    private String status = "approved";

    private String phone;
    private String address;

    /**
     * Department ID reference — relevant for officers.
     * Equivalent to Mongoose: { type: Schema.Types.ObjectId, ref: 'Department' }
     */
    @Field("department")
    private String department;

    /**
     * Avatar/profile picture URL or path
     */
    private String avatar;

    @CreatedDate
    @Field("createdAt")
    private Instant createdAt;

    @LastModifiedDate
    @Field("updatedAt")
    private Instant updatedAt;
}
