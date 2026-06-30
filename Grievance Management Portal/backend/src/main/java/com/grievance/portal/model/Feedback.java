package com.grievance.portal.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

/**
 * Feedback model — maps to the 'feedbacks' collection.
 *
 * Equivalent to Mongoose Feedback schema:
 *   { complaintId, userId, rating (1-5), comment, timestamps }
 *
 * Business rules (enforced in FeedbackService):
 *   - Only for Resolved complaints
 *   - Only by the complaint's citizen
 *   - One feedback per complaint per user (compound index)
 *
 * Displayed in:
 *   - OfficerFeedback.jsx (officer view)
 *   - Admin analytics dashboard
 */
@Data
@NoArgsConstructor
@Document(collection = "feedbacks")
@CompoundIndexes({
    // Ensures one feedback per citizen per complaint (prevents duplicates)
    @CompoundIndex(name = "unique_feedback", def = "{'complaintId': 1, 'userId': 1}", unique = true)
})
public class Feedback {

    @Id
    private String id;

    /**
     * Reference to the complaint this feedback is for.
     * Indexed for fast officer feedback queries.
     */
    @Indexed
    @Field("complaintId")
    private String complaintId;

    /**
     * Reference to the citizen who submitted feedback.
     */
    @Indexed
    @Field("userId")
    private String userId;

    /**
     * Star rating from citizen. Range: 1 (worst) to 5 (best).
     * Displayed as stars in OfficerFeedback.jsx.
     */
    @Min(1)
    @Max(5)
    private int rating;

    /**
     * Optional text comment from citizen.
     */
    private String comment;

    @CreatedDate
    @Field("createdAt")
    private Instant createdAt;

    @LastModifiedDate
    @Field("updatedAt")
    private Instant updatedAt;
}
