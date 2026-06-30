package com.grievance.portal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * User response DTO — safe user object returned to clients.
 * Intentionally omits: password.
 * This is the object stored in React's AuthContext as `user`.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private String id;
    private String name;
    private String email;
    private String role;
    private String status;
    private String phone;
    private String address;
    private String department;
    private String departmentName;
    private String avatar;
    private Instant createdAt;
    private Instant updatedAt;
}
