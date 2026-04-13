package com.placeiq.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyGapResult {
    private String company;
    private String category;
    private Integer score;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private Map<String, List<String>> roadmap;
    private Map<String, Object> salaryInfo;
    private List<String> pyqLinks;
    private String hiringMonths;
    private String interviewRounds;
    private String geminiAdvice;
    private String prioritySkill;
    private String interviewTip;
    private String confidenceLevel;
}
