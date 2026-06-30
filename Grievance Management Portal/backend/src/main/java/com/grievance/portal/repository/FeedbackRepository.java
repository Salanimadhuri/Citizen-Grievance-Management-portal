package com.grievance.portal.repository;

import com.grievance.portal.model.Feedback;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends MongoRepository<Feedback, String> {

    @Query("{ 'complaintId': ?0, 'userId': ?1 }")
    Optional<Feedback> findByComplaintIdAndUserId(String complaintId, String userId);

    @Query("{ 'complaintId': ?0 }")
    Optional<Feedback> findByComplaintId(String complaintId);

    @Query("{ 'complaintId': { $in: ?0 } }")
    List<Feedback> findByComplaintIdIn(List<String> complaintIds);

    @Query("{}")
    List<Feedback> findAllByOrderByCreatedAtDesc();
}
