package com.placeiq.controller;

import com.placeiq.dto.AnalysisRequest;
import com.placeiq.dto.AnalysisResponse;
import com.placeiq.service.AnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AnalysisController {

    @Autowired
    private AnalysisService analysisService;

    /**
     * POST /api/analyse — Main endpoint for gap analysis.
     */
    @PostMapping("/analyse")
    public ResponseEntity<AnalysisResponse> analyse(@RequestBody AnalysisRequest request) {
        AnalysisResponse response = analysisService.analyzeStudent(request);
        return ResponseEntity.ok(response);
    }
}
