package com.placeiq.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.placeiq.config.GeminiConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

    @Autowired
    private GeminiConfig geminiConfig;

    @Autowired
    private RestTemplate restTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Gets AI-powered placement advice for a student + company pairing.
     */
    public Map<String, String> getPlacementAdvice(String studentSkills, String company,
                                                    String missingSkills, int score) {
        // Skip API call if key is not configured
        if (isKeyPlaceholder()) {
            return buildDefaultAdvice(score);
        }

        try {
            String prompt = String.format(
                    "You are a placement advisor for Indian engineering students. " +
                    "A student has these skills: %s. They are applying to %s. " +
                    "Missing skills are: %s. Gap score is %d%%. " +
                    "In JSON format only (no markdown, no code block), return: " +
                    "{\"advice\": \"2 sentences of personalised advice\", " +
                    "\"priority_skill\": \"single most important skill to learn first\", " +
                    "\"interview_tip\": \"one specific tip for this company\", " +
                    "\"confidence_level\": \"one of: Strong, Moderate, Needs Work\"}",
                    studentSkills, company, missingSkills, score
            );

            String url = GEMINI_URL + geminiConfig.getApiKey();
            Map<String, Object> requestBody = buildRequestBody(prompt);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return parseAdviceResponse(response.getBody(), score);
            }
        } catch (Exception e) {
            System.err.println("[GeminiService] API error for " + company + ": " + e.getMessage());
        }

        return buildDefaultAdvice(score);
    }

    /**
     * Gets salary negotiation advice for a given offer.
     */
    public Map<String, String> getSalaryNegotiationAdvice(String offeredSalary, String company, String role) {
        Map<String, String> defaultResponse = new HashMap<>();
        defaultResponse.put("advice", "Research the market rate for this role at " + company +
                " and negotiate confidently based on your skills and value.");
        defaultResponse.put("recommendation", "Negotiate");
        defaultResponse.put("counter_offer", offeredSalary);

        if (isKeyPlaceholder()) return defaultResponse;

        try {
            String prompt = String.format(
                    "An Indian fresher engineer received an offer of %s LPA from %s for a %s role. " +
                    "Based on typical Indian IT market rates in 2024-2025, should they accept, negotiate, or decline? " +
                    "In JSON format only (no markdown), return: " +
                    "{\"advice\": \"2 sentences of actionable advice\", " +
                    "\"recommendation\": \"one of: Accept/Negotiate/Decline\", " +
                    "\"counter_offer\": \"suggested counter offer in LPA as a number\"}",
                    offeredSalary, company, role
            );

            String url = GEMINI_URL + geminiConfig.getApiKey();
            Map<String, Object> requestBody = buildRequestBody(prompt);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                String content = extractContent(response.getBody());
                if (content != null) {
                    content = cleanJson(content);
                    JsonNode json = objectMapper.readTree(content);
                    Map<String, String> result = new HashMap<>();
                    result.put("advice", json.has("advice") ? json.get("advice").asText() : defaultResponse.get("advice"));
                    result.put("recommendation", json.has("recommendation") ? json.get("recommendation").asText() : "Negotiate");
                    result.put("counter_offer", json.has("counter_offer") ? json.get("counter_offer").asText() : offeredSalary);
                    return result;
                }
            }
        } catch (Exception e) {
            System.err.println("[GeminiService] Salary advice error: " + e.getMessage());
        }

        return defaultResponse;
    }

    // ---- Private helpers ----

    private Map<String, Object> buildRequestBody(String prompt) {
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", Collections.singletonList(textPart));

        Map<String, Object> body = new HashMap<>();
        body.put("contents", Collections.singletonList(content));

        // Safety settings to avoid refusals on innocent placement topics
        Map<String, Object> safetySettings = new HashMap<>();
        safetySettings.put("category", "HARM_CATEGORY_DANGEROUS_CONTENT");
        safetySettings.put("threshold", "BLOCK_ONLY_HIGH");
        body.put("safetySettings", Collections.singletonList(safetySettings));

        return body;
    }

    private Map<String, String> parseAdviceResponse(String responseBody, int score) {
        try {
            String content = extractContent(responseBody);
            if (content != null) {
                content = cleanJson(content);
                JsonNode json = objectMapper.readTree(content);
                Map<String, String> result = new HashMap<>();
                result.put("advice", json.has("advice") ? json.get("advice").asText()
                        : "Focus on strengthening your technical fundamentals.");
                result.put("priority_skill", json.has("priority_skill") ? json.get("priority_skill").asText() : "DSA");
                result.put("interview_tip", json.has("interview_tip") ? json.get("interview_tip").asText()
                        : "Research the company's recent projects and align your answers accordingly.");
                result.put("confidence_level", json.has("confidence_level") ? json.get("confidence_level").asText()
                        : getConfidenceLevel(score));
                return result;
            }
        } catch (Exception e) {
            System.err.println("[GeminiService] Response parse error: " + e.getMessage());
        }
        return buildDefaultAdvice(score);
    }

    private String extractContent(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode candidates = root.get("candidates");
            if (candidates != null && candidates.isArray() && !candidates.isEmpty()) {
                JsonNode content = candidates.get(0).get("content");
                if (content != null) {
                    JsonNode parts = content.get("parts");
                    if (parts != null && parts.isArray() && !parts.isEmpty()) {
                        return parts.get(0).get("text").asText();
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("[GeminiService] Extract content error: " + e.getMessage());
        }
        return null;
    }

    private String cleanJson(String content) {
        content = content.trim();
        if (content.startsWith("```json")) content = content.substring(7);
        else if (content.startsWith("```")) content = content.substring(3);
        if (content.endsWith("```")) content = content.substring(0, content.length() - 3);
        return content.trim();
    }

    private boolean isKeyPlaceholder() {
        String key = geminiConfig.getApiKey();
        return key == null || key.isBlank() || key.contains("YOUR_GEMINI");
    }

    private Map<String, String> buildDefaultAdvice(int score) {
        Map<String, String> result = new HashMap<>();
        result.put("advice", "Focus on strengthening your technical skills through daily practice on LeetCode and building real-world projects. " +
                "Consistent effort on the missing skills will significantly improve your interview readiness.");
        result.put("priority_skill", "DSA");
        result.put("interview_tip", "Research the company's technology stack and practice system design questions relevant to their scale and domain.");
        result.put("confidence_level", getConfidenceLevel(score));
        return result;
    }

    private String getConfidenceLevel(int score) {
        if (score >= 70) return "Strong";
        if (score >= 40) return "Moderate";
        return "Needs Work";
    }
}
