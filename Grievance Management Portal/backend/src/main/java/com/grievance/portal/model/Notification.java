package com.grievance.portal.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Data
@NoArgsConstructor
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    @Field("userId")
    private String userId;

    private String title;
    private String message;
    private String type;

    @Field("complaintId")
    private String complaintId;

    // stored as 'isRead' in old Node.js DB — map both field names
    @Field("isRead")
    private boolean read = false;

    @CreatedDate
    @Field("createdAt")
    private Instant createdAt;
}
