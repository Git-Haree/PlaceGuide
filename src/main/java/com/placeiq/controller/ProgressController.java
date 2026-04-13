package com.placeiq.controller;

import com.placeiq.model.ProgressItem;
import com.placeiq.repository.ProgressRepository;
import com.placeiq.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProgressController {

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private GeminiService geminiService;

    /**
     * POST /api/progress — Save a progress item.
     */
    @PostMapping("/progress")
    public ResponseEntity<ProgressItem> saveProgress(@RequestBody ProgressItem item) {
        return ResponseEntity.ok(progressRepository.save(item));
    }

    /**
     * GET /api/progress/{profileId} — Get all progress items for a profile.
     */
    @GetMapping("/progress/{profileId}")
    public ResponseEntity<List<ProgressItem>> getProgress(@PathVariable Integer profileId) {
        return ResponseEntity.ok(progressRepository.findByUserProfileId(profileId));
    }

    /**
     * POST /api/salary-advice — Get AI-powered salary negotiation advice.
     * Body: { offeredSalary, company, role }
     */
    @PostMapping("/salary-advice")
    public ResponseEntity<Map<String, String>> getSalaryAdvice(@RequestBody Map<String, String> request) {
        String offeredSalary = request.getOrDefault("offeredSalary", "0");
        String company = request.getOrDefault("company", "Unknown Company");
        String role = request.getOrDefault("role", "Software Engineer");
        Map<String, String> advice = geminiService.getSalaryNegotiationAdvice(offeredSalary, company, role);
        return ResponseEntity.ok(advice);
    }
}
