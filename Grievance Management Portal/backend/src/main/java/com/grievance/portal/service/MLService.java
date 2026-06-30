package com.grievance.portal.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class MLService {

    private final RestTemplate restTemplate;

    @Value("${app.ml.base-url:http://localhost:8000}")
    private String mlBaseUrl;

    public Map<String, Object> analyzeComplaint(String title, String text) {
        try {
            var body = Map.of("title", title != null ? title : "", "text", text != null ? text : "");
            var headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            var entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    mlBaseUrl + "/api/ml/analyze",
                    HttpMethod.POST, entity, Map.class);
            return response.getBody();
        } catch (Exception e) {
            log.warn("ML service unavailable, skipping AI analysis: {}", e.getMessage());
            return Map.of(
                    "category", "Other",
                    "priority", "Medium",
                    "sentiment", "Neutral",
                    "summary", text != null && text.length() > 100 ? text.substring(0, 100) + "..." : text,
                    "recommendedDepartment", "General",
                    "possibleDuplicates", java.util.List.of()
            );
        }
    }

    public Map<String, Object> classifyComplaint(String title, String text) {
        return callML("/api/ml/classify", title, text);
    }

    public Map<String, Object> predictPriority(String title, String text) {
        return callML("/api/ml/priority", title, text);
    }

    public Map<String, Object> analyzeSentiment(String title, String text) {
        return callML("/api/ml/sentiment", title, text);
    }

    private Map<String, Object> callML(String path, String title, String text) {
        try {
            var body = Map.of("title", title != null ? title : "", "text", text != null ? text : "");
            var headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            var entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                    mlBaseUrl + path, HttpMethod.POST, entity, Map.class);
            return response.getBody();
        } catch (Exception e) {
            log.warn("ML service call to {} failed: {}", path, e.getMessage());
            return Map.of();
        }
    }
}
