package com.placeiq.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResponse {
    private Integer profileId;
    private String studentName;
    private List<String> detectedSkills;
    private List<CompanyGapResult> results;
    private List<CompanyGapResult> rankedCompanies;
}
