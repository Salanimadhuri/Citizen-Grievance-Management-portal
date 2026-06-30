package com.grievance.portal.service;

import com.grievance.portal.dto.response.UserResponse;
import com.grievance.portal.exception.ResourceNotFoundException;
import com.grievance.portal.model.User;
import com.grievance.portal.repository.DepartmentRepository;
import com.grievance.portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;

    public List<UserResponse> getOfficers() {
        return userRepository.findByRole("officer")
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /** Returns UserResponse by ID — used by controllers */
    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        return toResponse(user);
    }

    /** Returns raw User entity — used internally by AdminController helper */
    public User getRawUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    public void deleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        userRepository.delete(user);
    }

    public UserResponse toResponse(User u) {
        String deptName = null;
        if (u.getDepartment() != null) {
            deptName = departmentRepository.findById(u.getDepartment())
                    .map(d -> d.getName()).orElse(null);
        }
        return UserResponse.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .role(u.getRole())
                .status(u.getStatus())
                .phone(u.getPhone())
                .address(u.getAddress())
                .department(u.getDepartment())
                .departmentName(deptName)
                .avatar(u.getAvatar())
                .createdAt(u.getCreatedAt())
                .updatedAt(u.getUpdatedAt())
                .build();
    }
}
