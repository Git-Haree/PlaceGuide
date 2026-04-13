package com.placeiq.service;

import com.placeiq.model.Company;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GapScorerService {

    // Alias groups for skill matching
    private static final Map<String, List<String>> ALIASES = new HashMap<>();

    static {
        ALIASES.put("dsa", Arrays.asList("data structures", "algorithms", "data structure", "problem solving"));
        ALIASES.put("data structures", Arrays.asList("dsa", "algorithms", "data structure"));
        ALIASES.put("algorithms", Arrays.asList("dsa", "data structures", "problem solving"));
        ALIASES.put("problem solving", Arrays.asList("dsa", "algorithms", "data structures"));
        ALIASES.put("oops", Arrays.asList("object oriented", "oop", "object-oriented", "oo"));
        ALIASES.put("object oriented", Arrays.asList("oops", "oop", "object-oriented"));
        ALIASES.put("nodejs", Arrays.asList("node.js", "node js", "node"));
        ALIASES.put("node.js", Arrays.asList("nodejs", "node js"));
        ALIASES.put("ml", Arrays.asList("machine learning", "deep learning"));
        ALIASES.put("machine learning", Arrays.asList("ml", "ai", "artificial intelligence", "deep learning"));
        ALIASES.put("ai", Arrays.asList("artificial intelligence", "machine learning", "ml"));
        ALIASES.put("artificial intelligence", Arrays.asList("ai", "ml", "machine learning"));
        ALIASES.put("db", Arrays.asList("dbms", "database", "rdbms"));
        ALIASES.put("dbms", Arrays.asList("db", "database", "rdbms", "sql"));
        ALIASES.put("database", Arrays.asList("dbms", "db", "sql", "rdbms"));
        ALIASES.put("rest api", Arrays.asList("restful", "rest", "api", "web services"));
        ALIASES.put("system design", Arrays.asList("hld", "lld", "high level design", "low level design"));
        ALIASES.put("cloud", Arrays.asList("aws", "azure", "gcp", "cloud computing"));
        ALIASES.put("aws", Arrays.asList("cloud", "amazon web services"));
        ALIASES.put("azure", Arrays.asList("cloud", "microsoft azure"));
        ALIASES.put("gcp", Arrays.asList("cloud", "google cloud"));
        ALIASES.put("spring boot", Arrays.asList("spring", "springboot"));
        ALIASES.put("spring", Arrays.asList("spring boot", "springboot", "spring framework"));
        ALIASES.put("communication", Arrays.asList("verbal", "interpersonal"));
        ALIASES.put("aptitude", Arrays.asList("logical reasoning", "verbal reasoning", "quantitative"));
        ALIASES.put("logical reasoning", Arrays.asList("aptitude", "reasoning"));
        ALIASES.put("verbal reasoning", Arrays.asList("aptitude", "communication"));
        ALIASES.put("full stack", Arrays.asList("react", "node.js", "html", "css"));
    }

    /**
     * Computes a gap score between student skills and company requirements.
     * Uses substring matching + alias lookups.
     */
    public Map<String, Object> computeScore(Company company, List<String> studentSkills) {
        List<String> requiredSkills = parseSkills(company.getTopSkills());
        List<String> normalizedStudent = normalizeSkills(studentSkills);

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String required : requiredSkills) {
            String normalizedRequired = required.toLowerCase().trim();
            if (isSkillMatched(normalizedRequired, normalizedStudent)) {
                matched.add(required);
            } else {
                missing.add(required);
            }
        }

        int total = requiredSkills.size();
        int score = total > 0 ? (int) Math.round((double) matched.size() / total * 100) : 0;

        Map<String, Object> result = new HashMap<>();
        result.put("score", score);
        result.put("matched", matched);
        result.put("missing", missing);
        return result;
    }

    private boolean isSkillMatched(String required, List<String> studentSkillsNormalized) {
        // 1. Direct substring match
        for (String studentSkill : studentSkillsNormalized) {
            if (studentSkill.contains(required) || required.contains(studentSkill)) {
                return true;
            }
        }

        // 2. Alias-based match
        List<String> aliases = ALIASES.getOrDefault(required, Collections.emptyList());
        for (String alias : aliases) {
            for (String studentSkill : studentSkillsNormalized) {
                if (studentSkill.contains(alias) || alias.contains(studentSkill)) {
                    return true;
                }
            }
        }

        // 3. Check if student's alias matches the required skill
        for (String studentSkill : studentSkillsNormalized) {
            List<String> studentAliases = ALIASES.getOrDefault(studentSkill, Collections.emptyList());
            for (String sa : studentAliases) {
                if (sa.contains(required) || required.contains(sa)) {
                    return true;
                }
            }
        }

        return false;
    }

    private List<String> normalizeSkills(List<String> skills) {
        List<String> normalized = new ArrayList<>();
        for (String skill : skills) {
            if (skill != null) {
                normalized.add(skill.toLowerCase().trim());
            }
        }
        return normalized;
    }

    private List<String> parseSkills(String skillsStr) {
        if (skillsStr == null || skillsStr.trim().isEmpty()) return Collections.emptyList();
        List<String> skills = new ArrayList<>();
        for (String s : skillsStr.split(",")) {
            String trimmed = s.trim();
            if (!trimmed.isEmpty()) skills.add(trimmed);
        }
        return skills;
    }
}
