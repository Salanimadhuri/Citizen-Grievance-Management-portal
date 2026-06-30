package com.grievance.portal.controller;

import com.grievance.portal.dto.response.ApiResponse;
import com.grievance.portal.dto.response.UserResponse;
import com.grievance.portal.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * UserController — handles /api/users/* endpoints.
 *
 * Routes (identical to Express):
 *   GET /api/users/officers   (admin)
 *   GET /api/users            (admin)
 *   GET /api/users/:id
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** GET /api/users/officers — admin: list officers for assignment dropdown */
    @GetMapping("/officers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getOfficers() {
        return ResponseEntity.ok(ApiResponse.ok("Officers fetched", userService.getOfficers()));
    }

    /** GET /api/users — admin: all users */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok("Users fetched", userService.getAllUsers()));
    }

    /** GET /api/users/:id */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok("User fetched", userService.getUserById(id)));
    }
}
