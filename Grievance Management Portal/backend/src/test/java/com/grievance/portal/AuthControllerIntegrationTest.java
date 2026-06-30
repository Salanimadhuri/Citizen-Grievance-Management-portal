package com.grievance.portal;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.grievance.portal.dto.request.LoginRequest;
import com.grievance.portal.dto.request.RegisterRequest;
import com.grievance.portal.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
    "spring.data.mongodb.uri=mongodb://localhost:27017/grievance-portal-test",
    "app.jwt.secret=test-secret-key-minimum-256-bits-integration-test!",
    "app.ml.base-url=http://localhost:9999",   // non-existent → ML calls fallback gracefully
    "app.mail.enabled=false",
})
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AuthControllerIntegrationTest {

    @Autowired MockMvc       mockMvc;
    @Autowired ObjectMapper  objectMapper;
    @Autowired UserRepository userRepository;

    private static final String EMAIL    = "integtest_" + System.currentTimeMillis() + "@test.com";
    private static final String PASSWORD = "Test@1234";

    @Test
    @Order(1)
    void register_withValidData_returns201AndToken() throws Exception {
        var req = new RegisterRequest();
        req.setName("Integration User");
        req.setEmail(EMAIL);
        req.setPassword(PASSWORD);
        req.setRole("citizen");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.user.email").value(EMAIL));
    }

    @Test
    @Order(2)
    void login_withCorrectCredentials_returns200AndToken() throws Exception {
        var req = new LoginRequest();
        req.setEmail(EMAIL);
        req.setPassword(PASSWORD);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.token").isNotEmpty());
    }

    @Test
    @Order(3)
    void login_withWrongPassword_returns401() throws Exception {
        var req = new LoginRequest();
        req.setEmail(EMAIL);
        req.setPassword("WrongPassword!");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(4)
    void register_withDuplicateEmail_returns400() throws Exception {
        var req = new RegisterRequest();
        req.setName("Duplicate");
        req.setEmail(EMAIL);
        req.setPassword(PASSWORD);
        req.setRole("citizen");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @AfterAll
    static void cleanup(@Autowired UserRepository repo) {
        repo.findByEmail(EMAIL).ifPresent(repo::delete);
    }
}
