package com.grievance.portal.repository;

import com.grievance.portal.model.Communication;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunicationRepository extends MongoRepository<Communication, String> {

    @Query("{ 'complaintId': ?0 }")
    List<Communication> findByComplaintIdOrderByCreatedAtAsc(String complaintId);

    @Query("{ 'receiverId': ?0, 'read': false }")
    List<Communication> findByReceiverIdAndReadFalse(String receiverId);

    @Query(value = "{ 'receiverId': ?0, 'read': false }", count = true)
    long countByReceiverIdAndReadFalse(String receiverId);

    @Query("{ 'complaintId': ?0, $or: [{ 'senderId': ?1 }, { 'receiverId': ?1 }] }")
    List<Communication> findByComplaintIdAndParticipant(String complaintId, String userId);

    @Query(value = "{ $or: [{ 'senderId': ?0 }, { 'receiverId': ?0 }] }", fields = "{ 'complaintId': 1 }")
    List<Communication> findConversationsByUserId(String userId);
}
