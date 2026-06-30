package com.grievance.portal.service;

import com.grievance.portal.dto.request.DepartmentRequest;
import com.grievance.portal.exception.BadRequestException;
import com.grievance.portal.exception.ResourceNotFoundException;
import com.grievance.portal.model.Department;
import com.grievance.portal.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public List<Department> getAllDepartments() {
        return departmentRepository.findAllByOrderByNameAsc();
    }

    public Department getDepartmentById(String id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + id));
    }

    public Department createDepartment(DepartmentRequest request) {
        if (departmentRepository.existsByName(request.getName())) {
            throw new BadRequestException("Department '" + request.getName() + "' already exists");
        }
        Department dept = new Department();
        dept.setName(request.getName());
        dept.setSlaHours(request.getSlaHours());
        dept.setContactEmail(request.getContactEmail());
        Department saved = departmentRepository.save(dept);
        log.info("Created department: {}", saved.getName());
        return saved;
    }

    public Department updateDepartment(String id, DepartmentRequest request) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + id));
        if (!dept.getName().equalsIgnoreCase(request.getName())
                && departmentRepository.existsByName(request.getName())) {
            throw new BadRequestException("Department '" + request.getName() + "' already exists");
        }
        dept.setName(request.getName());
        dept.setSlaHours(request.getSlaHours());
        dept.setContactEmail(request.getContactEmail());
        return departmentRepository.save(dept);
    }

    public void deleteDepartment(String id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + id));
        departmentRepository.delete(dept);
        log.info("Deleted department: {}", dept.getName());
    }
}
