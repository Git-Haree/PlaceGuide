package com.placeiq.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RoadmapService {

    // Estimated study days per skill
    private static final Map<String, Integer> SKILL_DAYS = new LinkedHashMap<>();

    static {
        SKILL_DAYS.put("dsa", 21);
        SKILL_DAYS.put("data structures", 21);
        SKILL_DAYS.put("algorithms", 14);
        SKILL_DAYS.put("system design", 14);
        SKILL_DAYS.put("machine learning", 21);
        SKILL_DAYS.put("deep learning", 21);
        SKILL_DAYS.put("java", 10);
        SKILL_DAYS.put("python", 7);
        SKILL_DAYS.put("c++", 10);
        SKILL_DAYS.put("c#", 10);
        SKILL_DAYS.put("javascript", 7);
        SKILL_DAYS.put("kotlin", 10);
        SKILL_DAYS.put("go", 10);
        SKILL_DAYS.put("react", 10);
        SKILL_DAYS.put("angular", 10);
        SKILL_DAYS.put("spring", 10);
        SKILL_DAYS.put("spring boot", 7);
        SKILL_DAYS.put("microservices", 10);
        SKILL_DAYS.put("aws", 14);
        SKILL_DAYS.put("azure", 14);
        SKILL_DAYS.put("gcp", 14);
        SKILL_DAYS.put("docker", 7);
        SKILL_DAYS.put("kubernetes", 10);
        SKILL_DAYS.put("kafka", 7);
        SKILL_DAYS.put("sql", 7);
        SKILL_DAYS.put("mysql", 5);
        SKILL_DAYS.put("postgresql", 5);
        SKILL_DAYS.put("mongodb", 5);
        SKILL_DAYS.put("oops", 5);
        SKILL_DAYS.put("object oriented", 5);
        SKILL_DAYS.put("dbms", 7);
        SKILL_DAYS.put("networking", 7);
        SKILL_DAYS.put("operating systems", 7);
        SKILL_DAYS.put("git", 3);
        SKILL_DAYS.put("linux", 5);
        SKILL_DAYS.put("cloud", 10);
        SKILL_DAYS.put("testing", 5);
        SKILL_DAYS.put("agile", 3);
        SKILL_DAYS.put("rest api", 5);
        SKILL_DAYS.put("communication", 7);
        SKILL_DAYS.put("aptitude", 7);
        SKILL_DAYS.put("problem solving", 14);
        SKILL_DAYS.put("full stack", 21);
        SKILL_DAYS.put("analytics", 7);
        SKILL_DAYS.put("pl/sql", 7);
        SKILL_DAYS.put("apex", 10);
        SKILL_DAYS.put("abap", 10);
        SKILL_DAYS.put("data analysis", 10);
        SKILL_DAYS.put("spark", 10);
        SKILL_DAYS.put("hadoop", 10);
        SKILL_DAYS.put("flutter", 10);
        SKILL_DAYS.put("excel", 3);
        SKILL_DAYS.put("logical reasoning", 5);
        SKILL_DAYS.put("verbal reasoning", 5);
    }

    // Priority order: quick wins first, heavy topics last
    private static final Set<String> HIGH_PRIORITY = new HashSet<>(Arrays.asList(
            "dsa", "data structures", "algorithms", "system design", "problem solving", "machine learning"
    ));
    private static final Set<String> MED_PRIORITY = new HashSet<>(Arrays.asList(
            "java", "python", "c++", "sql", "oops", "microservices", "aws", "docker",
            "spring boot", "react", "mongodb", "cloud"
    ));

    /**
     * Generates a week-by-week roadmap from the list of missing skills.
     */
    public Map<String, List<String>> generateRoadmap(List<String> missingSkills, int totalWeeks) {
        Map<String, List<String>> roadmap = new LinkedHashMap<>();
        roadmap.put("Week 1", new ArrayList<>());
        roadmap.put("Week 2", new ArrayList<>());
        roadmap.put("Week 3", new ArrayList<>());
        roadmap.put("Week 4+", new ArrayList<>());

        // Sort: quick/soft skills first, heavy technical stuff later
        List<String> prioritized = prioritizeSkills(missingSkills);

        int week1Days = 0, week2Days = 0, week3Days = 0;

        for (String skill : prioritized) {
            int days = getDaysForSkill(skill.toLowerCase());
            if (week1Days + days <= 7) {
                roadmap.get("Week 1").add(skill);
                week1Days += days;
            } else if (week2Days + days <= 7) {
                roadmap.get("Week 2").add(skill);
                week2Days += days;
            } else if (week3Days + days <= 7) {
                roadmap.get("Week 3").add(skill);
                week3Days += days;
            } else {
                roadmap.get("Week 4+").add(skill);
            }
        }

        return roadmap;
    }

    private List<String> prioritizeSkills(List<String> skills) {
        List<String> low = new ArrayList<>();
        List<String> med = new ArrayList<>();
        List<String> high = new ArrayList<>();

        for (String skill : skills) {
            String lower = skill.toLowerCase();
            if (HIGH_PRIORITY.stream().anyMatch(lower::contains)) {
                high.add(skill);
            } else if (MED_PRIORITY.stream().anyMatch(lower::contains)) {
                med.add(skill);
            } else {
                low.add(skill); // quick wins go first
            }
        }

        List<String> result = new ArrayList<>();
        result.addAll(low);
        result.addAll(med);
        result.addAll(high);
        return result;
    }

    private int getDaysForSkill(String skill) {
        for (Map.Entry<String, Integer> entry : SKILL_DAYS.entrySet()) {
            if (skill.contains(entry.getKey()) || entry.getKey().contains(skill)) {
                return entry.getValue();
            }
        }
        return 5; // default: 5 days for unknown skills
    }
}
