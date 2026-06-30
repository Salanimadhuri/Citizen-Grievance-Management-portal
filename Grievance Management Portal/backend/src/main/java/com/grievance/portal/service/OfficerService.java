package com.grievance.portal.service;

import com.grievance.portal.dto.request.OfficerRegisterRequest;
import com.grievance.portal.dto.response.UserResponse;
import com.grievance.portal.exception.BadRequestException;
import com.grievance.portal.model.User;
import com.grievance.portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * OfficerService — handles officer self-registration.
 *
 * Replaces Express officerController.js:
 *   registerOfficer — creates officer with status "pending" for admin approval
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OfficerService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Officer self-registers — status starts as "pending".
     * Admin must approve before officer can log in.
     *
     * Equivalent to Express:
     *   const officer = await User.create({ role: 'officer', status: 'pending', ... })
     */
    public UserResponse registerOfficer(OfficerRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("User already exists with email: " + request.getEmail());
        }
        User officer = new User();
        officer.setName(request.getName());
        officer.setEmail(request.getEmail());
        officer.setPassword(passwordEncoder.encode(request.getPassword()));
        officer.setPhone(request.getPhone());
        officer.setRole("officer");
        officer.setStatus("pending");
        officer.setDepartment(request.getDepartment());
        officer = userRepository.save(officer);
        log.info("Officer registered (pending approval): {}", officer.getEmail());
        return toResponse(officer);
    }

    private UserResponse toResponse(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .role(u.getRole())
                .phone(u.getPhone())
                .department(u.getDepartment())
                .build();
    }
}
