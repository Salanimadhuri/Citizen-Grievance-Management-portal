package com.grievance.portal.config;

import com.grievance.portal.model.Department;
import com.grievance.portal.model.User;
import com.grievance.portal.repository.DepartmentRepository;
import com.grievance.portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * DataSeeder — replaces Node.js seedDefaultData.js
 *
 * Runs once on application startup.
 * Seeds default admin, officer, citizen accounts and departments
 * if they don't already exist in MongoDB.
 *
 * Default credentials (for testing):
 *   Admin:   admin@example.com   / admin123
 *   Officer: officer@example.com / officer123
 *   Citizen: citizen@example.com / citizen123
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedDepartments();
        seedUsers();
    }

    private void seedDepartments() {
        List<String[]> departments = List.of(
                new String[]{"Road & Infrastructure", "72", "roads@grievance.gov"},
                new String[]{"Water Supply",          "48", "water@grievance.gov"},
                new String[]{"Electricity",           "24", "electricity@grievance.gov"},
                new String[]{"Waste Management",      "48", "waste@grievance.gov"},
                new String[]{"Public Safety",         "12", "safety@grievance.gov"}
        );

        for (String[] d : departments) {
            if (!departmentRepository.existsByName(d[0])) {
                Department dept = new Department();
                dept.setName(d[0]);
                dept.setSlaHours(Integer.parseInt(d[1]));
                dept.setContactEmail(d[2]);
                departmentRepository.save(dept);
                log.info("Seeded department: {}", d[0]);
            }
        }
    }

    private void seedUsers() {
        // Admin
        if (!userRepository.existsByEmail("admin@example.com")) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("admin");
            admin.setStatus("approved");
            admin.setPhone("1234567890");
            userRepository.save(admin);
            log.info("Seeded admin: admin@example.com / admin123");
        }

        // Officer
        if (!userRepository.existsByEmail("officer@example.com")) {
            // Get first department ID for the officer
            String deptId = departmentRepository.findAllByOrderByNameAsc()
                    .stream().findFirst().map(Department::getId).orElse(null);
            User officer = new User();
            officer.setName("Default Officer");
            officer.setEmail("officer@example.com");
            officer.setPassword(passwordEncoder.encode("officer123"));
            officer.setRole("officer");
            officer.setStatus("approved");
            officer.setPhone("0987654321");
            officer.setDepartment(deptId);
            userRepository.save(officer);
            log.info("Seeded officer: officer@example.com / officer123");
        }

        // Citizen
        if (!userRepository.existsByEmail("citizen@example.com")) {
            User citizen = new User();
            citizen.setName("Default Citizen");
            citizen.setEmail("citizen@example.com");
            citizen.setPassword(passwordEncoder.encode("citizen123"));
            citizen.setRole("citizen");
            citizen.setStatus("approved");
            citizen.setPhone("1122334455");
            userRepository.save(citizen);
            log.info("Seeded citizen: citizen@example.com / citizen123");
        }
    }
}
