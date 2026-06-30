package com.grievance.portal.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

/**
 * Communication model — maps to the 'communications' collection.
 *
 * Equivalent to Mongoose Communication schema:
 *   { complaintId, senderId, receiverId, message, read, timestamps }
 *
 * Implements the messaging system between citizens and officers:
 *   - Citizens can message officers about their complaints
 *   - Officers can message citizens about assigned complaints
 *   - Messages are grouped by complaintId for conversation view
 *
 * Displayed in:
 *   - CitizenCommunication.jsx (citizen chat view)
 *   - OfficerCommunication.jsx (officer chat view)
 */
@Data
@NoArgsConstructor
@Document(collection = "communications")
public class Communication {

    @Id
    private String id;

    /**
     * The complaint this message belongs to.
     * Groups messages into conversations.
     * Indexed for fast conversation retrieval.
     */
    @Indexed
    @Field("complaintId")
    private String complaintId;

    /**
     * User ID of the message sender (citizen or officer).
     */
    @Field("senderId")
    private String senderId;

    /**
     * User ID of the message recipient.
     * Indexed for unread count queries.
     */
    @Indexed
    @Field("receiverId")
    private String receiverId;

    /**
     * The message content.
     */
    private String message;

    /**
     * Read/unread status.
     * Set to true when the recipient fetches the conversation.
     * Drives unread message indicators in the UI.
     */
    private boolean read = false;

    // Transient fields — populated by CommunicationService, not stored in MongoDB
    @org.springframework.data.annotation.Transient
    private String senderName;

    @org.springframework.data.annotation.Transient
    private String senderRole;

    @CreatedDate
    @Field("createdAt")
    private Instant createdAt;

    @LastModifiedDate
    @Field("updatedAt")
    private Instant updatedAt;
}
