package com.grievance.portal.repository;

import com.grievance.portal.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    @Query("{ 'userId': ?0 }")
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

    // match both 'isRead' (old Node.js field) and 'read' (new field)
    @Query("{ 'userId': ?0, $or: [{ 'isRead': false }, { 'isRead': { $exists: false } }] }")
    List<Notification> findByUserIdAndReadFalse(String userId);

    @Query(value = "{ 'userId': ?0, $or: [{ 'isRead': false }, { 'isRead': { $exists: false } }] }", count = true)
    long countByUserIdAndReadFalse(String userId);
}
