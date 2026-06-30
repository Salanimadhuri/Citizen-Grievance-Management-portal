package com.grievance.portal.repository;

import com.grievance.portal.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("{ 'role': ?0 }")
    List<User> findByRole(String role);

    @Query("{ 'role': ?0, 'department': ?1 }")
    List<User> findByRoleAndDepartment(String role, String department);

    @Query("{ 'role': ?0, 'status': ?1 }")
    List<User> findByRoleAndStatus(String role, String status);

    @Query("{ 'role': ?0 }")
    List<User> findByRoleOrderByNameAsc(String role);

    @Query("{ 'role': { $in: ?0 } }")
    List<User> findByRoleInOrderByNameAsc(List<String> roles);
}
