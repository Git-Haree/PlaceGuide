package com.placeiq.service;

import com.placeiq.dto.AnalysisRequest;
import com.placeiq.dto.AnalysisResponse;
import com.placeiq.dto.CompanyGapResult;
import com.placeiq.model.Company;
import com.placeiq.model.GapAnalysis;
import com.placeiq.model.UserProfile;
import com.placeiq.repository.CompanyRepository;
import com.placeiq.repository.GapAnalysisRepository;
import com.placeiq.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class AnalysisService {

    @Autowired private CompanyRepository companyRepository;
    @Autowired private UserProfileRepository userProfileRepository;
    @Autowired private GapAnalysisRepository gapAnalysisRepository;
    @Autowired private GapScorerService gapScorerService;
    @Autowired private GeminiService geminiService;
    @Autowired private RoadmapService roadmapService;
    @Autowired private ResumeParserService resumeParserService;

    /**
     * Full analysis pipeline: parse skills → save profile → score companies → get AI advice → return results.
     */
    public AnalysisResponse analyzeStudent(AnalysisRequest request) {

        // --- Step 1: Detect/merge skills ---
        List<String> detectedSkills = new ArrayList<>();

        // From resume text
        if (request.getResumeText() != null && !request.getResumeText().trim().isEmpty()) {
            detectedSkills.addAll(resumeParserService.extractSkillsFromText(request.getResumeText()));
        }

        // From explicit skills list (avoids duplicates)
        if (request.getSkills() != null) {
            for (String skill : request.getSkills()) {
                String trimmed = skill.trim();
                if (!trimmed.isEmpty() && !detectedSkills.contains(trimmed)) {
                    detectedSkills.add(trimmed);
                }
            }
        }

        // --- Step 2: Save user profile ---
        UserProfile profile = new UserProfile();
        profile.setName(request.getName());
        profile.setEmail(request.getEmail());
        profile.setDomain(request.getDomain());
        profile.setExperienceLevel(request.getExperience());
        profile.setCgpa(request.getCgpa());
        profile.setLocation(request.getLocation());
        profile.setSalaryMin(request.getSalaryMin());
        profile.setSkills(String.join(",", detectedSkills));
        profile.setTargetCompanies(
                request.getTargetCompanies() != null
                        ? String.join(",", request.getTargetCompanies())
                        : ""
        );
        profile = userProfileRepository.save(profile);

        // --- Step 3: Resolve target companies ---
        List<Company> companies = resolveCompanies(request.getTargetCompanies());

        // --- Step 4: Gap analysis per company ---
        List<CompanyGapResult> results = new ArrayList<>();
        String studentSkillsStr = String.join(", ", detectedSkills);
        int weeks = (request.getInterviewWeeks() != null && request.getInterviewWeeks() > 0)
                ? request.getInterviewWeeks() : 4;

        for (Company company : companies) {
            Map<String, Object> scoreData = gapScorerService.computeScore(company, detectedSkills);
            int score = (int) scoreData.get("score");

            @SuppressWarnings("unchecked")
            List<String> matched = (List<String>) scoreData.get("matched");
            @SuppressWarnings("unchecked")
            List<String> missing = (List<String>) scoreData.get("missing");

            // Generate roadmap
            Map<String, List<String>> roadmap = roadmapService.generateRoadmap(missing, weeks);

            // Gemini AI advice
            Map<String, String> geminiResponse = geminiService.getPlacementAdvice(
                    studentSkillsStr, company.getName(), String.join(", ", missing), score
            );

            // Salary info
            Map<String, Object> salaryInfo = new HashMap<>();
            salaryInfo.put("min", company.getMinFresherCtc() != null ? company.getMinFresherCtc() : BigDecimal.ZERO);
            salaryInfo.put("max", company.getMaxFresherCtc() != null ? company.getMaxFresherCtc() : BigDecimal.ZERO);
            salaryInfo.put("currency", "LPA");

            // PYQ links
            List<String> pyqLinks = new ArrayList<>();
            if (company.getPyqLinks() != null && !company.getPyqLinks().isEmpty()) {
                for (String link : company.getPyqLinks().split(",")) {
                    pyqLinks.add(link.trim());
                }
            }

            // Persist gap analysis
            GapAnalysis ga = new GapAnalysis();
            ga.setUserProfileId(profile.getId());
            ga.setCompanyName(company.getName());
            ga.setGapScore(score);
            ga.setMatchedSkills(String.join(",", matched));
            ga.setMissingSkills(String.join(",", missing));
            ga.setGeminiAdvice(geminiResponse.getOrDefault("advice", ""));
            gapAnalysisRepository.save(ga);

            // Build CompanyGapResult
            CompanyGapResult result = new CompanyGapResult();
            result.setCompany(company.getName());
            result.setCategory(company.getCategory());
            result.setScore(score);
            result.setMatchedSkills(matched);
            result.setMissingSkills(missing);
            result.setRoadmap(roadmap);
            result.setSalaryInfo(salaryInfo);
            result.setPyqLinks(pyqLinks);
            result.setHiringMonths(company.getHiringMonths());
            result.setInterviewRounds(company.getInterviewRounds());
            result.setGeminiAdvice(geminiResponse.getOrDefault("advice", ""));
            result.setPrioritySkill(geminiResponse.getOrDefault("priority_skill", "DSA"));
            result.setInterviewTip(geminiResponse.getOrDefault("interview_tip", "Practice regularly."));
            result.setConfidenceLevel(geminiResponse.getOrDefault("confidence_level", "Moderate"));

            results.add(result);
        }

        // Sort by score descending
        results.sort((a, b) -> b.getScore() - a.getScore());

        // Build and return response
        AnalysisResponse response = new AnalysisResponse();
        response.setProfileId(profile.getId());
        response.setStudentName(request.getName());
        response.setDetectedSkills(detectedSkills);
        response.setResults(results);
        response.setRankedCompanies(results);

        return response;
    }

    private List<Company> resolveCompanies(List<String> targetCompanies) {
        if (targetCompanies == null || targetCompanies.isEmpty()) {
            return companyRepository.findAll();
        }
        List<Company> companies = new ArrayList<>();
        for (String name : targetCompanies) {
            companyRepository.findByNameIgnoreCase(name.trim()).ifPresent(companies::add);
        }
        // Fallback to all if none matched
        return companies.isEmpty() ? companyRepository.findAll() : companies;
    }
}
