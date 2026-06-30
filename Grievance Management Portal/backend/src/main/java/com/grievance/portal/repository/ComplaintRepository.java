package com.grievance.portal.repository;

import com.grievance.portal.model.Complaint;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface ComplaintRepository extends MongoRepository<Complaint, String> {

    // Citizen
    @Query("{ 'userId': ?0 }")
    List<Complaint> findByCitizenIdOrderByCreatedAtDesc(String citizenId);

    // Officer
    @Query("{ 'assignedOfficer': ?0 }")
    List<Complaint> findByOfficerIdOrderByCreatedAtDesc(String officerId);

    @Query("{ 'assignedOfficer': ?0 }")
    List<Complaint> findByOfficerId(String officerId);

    @Query("{ 'assignedOfficer': ?0 }")
    List<Complaint> findByOfficerIdOrderByCreatedAtAsc(String officerId);

    @Query(value = "{ 'assignedOfficer': ?0, 'status': ?1 }", count = true)
    long countByOfficerIdAndStatus(String officerId, String status);

    // Admin — all complaints
    @Query("{}")
    List<Complaint> findAllByOrderByCreatedAtDesc();

    // Filter by status
    @Query("{ 'status': ?0 }")
    List<Complaint> findByStatusOrderByCreatedAtDesc(String status);

    // Filter by category
    @Query("{ 'category': ?0 }")
    List<Complaint> findByCategoryOrderByCreatedAtDesc(String category);

    // Count by status
    @Query(value = "{ 'status': ?0 }", count = true)
    long countByStatus(String status);

    // Department
    @Query("{ 'departmentId': ?0 }")
    List<Complaint> findByDepartmentId(String departmentId);

    @Query(value = "{ 'departmentId': ?0 }", count = true)
    long countByDepartmentId(String departmentId);

    // Unassigned
    @Query("{ 'assignedOfficer': null }")
    List<Complaint> findUnassignedComplaints();

    // Escalation scheduler
    @Query("{ 'status': { $nin: ['Resolved'] }, 'escalated': false, 'createdAt': { $lt: ?0 } }")
    List<Complaint> findNonResolvedCreatedBefore(Instant cutoff);
}
