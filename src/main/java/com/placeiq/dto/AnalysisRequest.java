package com.placeiq.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisRequest {
    private String name;
    private String email;
    private String domain;
    private String experience;
    private BigDecimal cgpa;
    private String location;
    private BigDecimal salaryMin;
    private List<String> skills;
    private List<String> targetCompanies;
    private Integer interviewWeeks;
    private String resumeText;
}
