package com.grievance.portal.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class IndexCleanupConfig {

    private final MongoClient mongoClient;

    @Bean
    @Order(1)
    public String dropLegacyIndexes() {
        try {
            MongoDatabase db = mongoClient.getDatabase("grievance-portal");
            dropNonIdIndexes(db, "departments");
            dropNonIdIndexes(db, "users");
            dropNonIdIndexes(db, "complaints");
            dropNonIdIndexes(db, "feedbacks");
            dropNonIdIndexes(db, "communications");
            dropNonIdIndexes(db, "notifications");
            log.info("Legacy index cleanup completed.");
        } catch (Exception e) {
            log.warn("Index cleanup skipped: {}", e.getMessage());
        }
        return "indexesDropped";
    }

    private void dropNonIdIndexes(MongoDatabase db, String collectionName) {
        try {
            MongoCollection<Document> collection = db.getCollection(collectionName);
            for (Document index : collection.listIndexes()) {
                String indexName = index.getString("name");
                if (indexName != null && !indexName.equals("_id_")) {
                    collection.dropIndex(indexName);
                    log.info("Dropped index '{}' from '{}'", indexName, collectionName);
                }
            }
        } catch (Exception e) {
            log.debug("Could not drop indexes for '{}': {}", collectionName, e.getMessage());
        }
    }
}
