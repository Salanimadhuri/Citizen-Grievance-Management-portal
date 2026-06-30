package com.grievance.portal.controller;

import com.grievance.portal.dto.request.LoginRequest;
import com.grievance.portal.dto.request.RegisterRequest;
import com.grievance.portal.dto.response.ApiResponse;
import com.grievance.portal.dto.response.AuthResponse;
import com.grievance.portal.dto.response.UserResponse;
import com.grievance.portal.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("User registered successfully", authService.register(request)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Login successful", authService.login(request)));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(ApiResponse.ok("Logout successful", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMe(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok("Profile fetched",
                authService.getProfile(userDetails.getUsername())));
    }

    @PatchMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @RequestBody Map<String, String> updates,
            @AuthenticationPrincipal UserDetails userDetails) {
        UserResponse updated = authService.updateProfile(
                userDetails.getUsername(),
                updates.get("name"),
                updates.get("phone"),
                updates.get("address"),
                updates.get("password")
        );
        return ResponseEntity.ok(ApiResponse.ok("Profile updated", updated));
    }
}
