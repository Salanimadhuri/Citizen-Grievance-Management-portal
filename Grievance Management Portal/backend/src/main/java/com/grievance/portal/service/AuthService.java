package com.grievance.portal.service;

import com.grievance.portal.dto.request.LoginRequest;
import com.grievance.portal.dto.request.RegisterRequest;
import com.grievance.portal.dto.response.AuthResponse;
import com.grievance.portal.dto.response.UserResponse;
import com.grievance.portal.exception.BadRequestException;
import com.grievance.portal.exception.ResourceNotFoundException;
import com.grievance.portal.exception.UnauthorizedException;
import com.grievance.portal.model.User;
import com.grievance.portal.repository.UserRepository;
import com.grievance.portal.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * AuthService — handles user registration, login, and profile operations.
 *
 * Replaces Express authController.js:
 *   register, login
 *
 * Also handles officer login check (pending approval guard).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * Register a new citizen.
     * Officers use /api/officer/register instead.
     */
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : "citizen");
        user.setStatus("approved");
        user.setPhone(request.getPhone());
        user.setDepartment(request.getDepartment());
        user.setAddress(request.getAddress());

        user = userRepository.save(user);
        log.info("Registered new user: {} with role: {}", user.getEmail(), user.getRole());

        String token = jwtUtil.generateToken(user.getId(), user.getRole());
        return new AuthResponse(token, toUserResponse(user));
    }

    /**
     * Authenticate user and return JWT token.
     * Checks officer approval status before allowing login.
     *
     * Equivalent to Express:
     *   if (user.role === 'officer' && user.status !== 'approved') → 401
     */
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        // Officers must be approved before they can log in
        if ("officer".equals(user.getRole()) && !"approved".equals(user.getStatus())) {
            throw new UnauthorizedException("Your account is pending admin approval.");
        }

        log.info("User logged in: {} (role: {})", user.getEmail(), user.getRole());
        String token = jwtUtil.generateToken(user.getId(), user.getRole());
        return new AuthResponse(token, toUserResponse(user));
    }

    public UserResponse getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toUserResponse(user);
    }

    public UserResponse updateProfile(String userId, String name, String phone,
                                      String address, String password) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (name != null && !name.isBlank()) user.setName(name);
        if (phone != null) user.setPhone(phone);
        if (address != null) user.setAddress(address);
        if (password != null && !password.isBlank()) {
            user.setPassword(passwordEncoder.encode(password));
        }
        return toUserResponse(userRepository.save(user));
    }

    public UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .phone(user.getPhone())
                .address(user.getAddress())
                .department(user.getDepartment())
                .avatar(user.getAvatar())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
