package com.grievance.portal.repository;

import com.grievance.portal.model.Department;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * DepartmentRepository — Spring Data MongoDB repository for Department documents.
 *
 * Equivalent to Mongoose Department model queries:
 *   Department.find(), Department.findOne({ name }), Department.create(), etc.
 */
@Repository
public interface DepartmentRepository extends MongoRepository<Department, String> {

    /**
     * Find department by name — used to prevent duplicates.
     * Equivalent to: Department.findOne({ name })
     */
    Optional<Department> findByName(String name);

    /**
     * Check if department name already exists.
     * Equivalent to: Department.exists({ name })
     */
    boolean existsByName(String name);

    /**
     * Get all departments sorted alphabetically.
     * Equivalent to: Department.find().sort({ name: 1 })
     */
    List<Department> findAllByOrderByNameAsc();
}
