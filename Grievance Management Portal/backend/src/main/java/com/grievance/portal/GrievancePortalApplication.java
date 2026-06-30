package com.grievance.portal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
/**
 * GrievancePortalApplication — Spring Boot entry point.
 *
 * Replaces Node.js server.js:
 *   - @SpringBootApplication replaces express() + app.listen()
 *   - @EnableMongoAuditing enables automatic createdAt/updatedAt (replaces Mongoose timestamps)
 *   - @EnableScheduling enables the EscalationScheduler (replaces setInterval in escalationSystem.js)
 *   - DataSeeder (CommandLineRunner) replaces seedDefaultData.js
 */
@SpringBootApplication
@EnableMongoAuditing
@EnableScheduling
@RestController
public class GrievancePortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(GrievancePortalApplication.class, args);
    }

    /** GET /api/health — health check (replaces Express app.get('/api/health')) */
    @GetMapping("/api/health")
    public Map<String, String> health() {
        return Map.of("status", "OK", "message", "Server is running");
    }
}
