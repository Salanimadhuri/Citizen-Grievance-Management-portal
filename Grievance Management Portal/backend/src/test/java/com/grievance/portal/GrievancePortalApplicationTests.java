package com.grievance.portal;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.data.mongodb.uri=mongodb://localhost:27017/grievance-portal-test",
    "app.jwt.secret=test-secret-key-minimum-32-characters-long!",
})
class GrievancePortalApplicationTests {

    @Test
    void contextLoads() {
        // Verifies the Spring context starts up without errors
    }
}
