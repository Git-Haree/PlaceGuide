package com.placeiq.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ResumeParserService {

    // Master list of all recognized technical skills
    private static final List<String> KNOWN_SKILLS = Arrays.asList(
            "java", "python", "c++", "c#", "javascript", "typescript", "kotlin", "go", "rust", "scala",
            "react", "angular", "vue", "node.js", "nodejs", "spring", "spring boot", "django", "flask", "fastapi",
            "sql", "mysql", "postgresql", "mongodb", "redis", "cassandra", "oracle", "pl/sql",
            "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins", "ci/cd",
            "dsa", "data structures", "algorithms", "system design", "microservices", "rest api", "graphql",
            "machine learning", "deep learning", "artificial intelligence", "tensorflow", "pytorch", "pandas", "numpy",
            "oops", "object oriented", "design patterns", "agile", "scrum", "git", "linux",
            "networking", "dbms", "operating systems", "computer networks",
            "html", "css", "bootstrap", "full stack", "android", "ios", "flutter",
            "kafka", "rabbitmq", "spark", "hadoop", "excel", "analytics", "tableau", "power bi",
            "communication", "aptitude", "problem solving", "logical reasoning", "verbal reasoning",
            "testing", "selenium", "junit", "cloud", "devops", "apex", "abap", "kotlin",
            "data analysis", "data science", "nlp", "computer vision"
    );

    private static final Map<String, String> CANONICAL_NAMES = new HashMap<>();

    static {
        CANONICAL_NAMES.put("java", "Java");
        CANONICAL_NAMES.put("python", "Python");
        CANONICAL_NAMES.put("c++", "C++");
        CANONICAL_NAMES.put("c#", "C#");
        CANONICAL_NAMES.put("javascript", "JavaScript");
        CANONICAL_NAMES.put("typescript", "TypeScript");
        CANONICAL_NAMES.put("kotlin", "Kotlin");
        CANONICAL_NAMES.put("go", "Go");
        CANONICAL_NAMES.put("rust", "Rust");
        CANONICAL_NAMES.put("scala", "Scala");
        CANONICAL_NAMES.put("react", "React");
        CANONICAL_NAMES.put("angular", "Angular");
        CANONICAL_NAMES.put("vue", "Vue");
        CANONICAL_NAMES.put("node.js", "Node.js");
        CANONICAL_NAMES.put("nodejs", "Node.js");
        CANONICAL_NAMES.put("spring", "Spring");
        CANONICAL_NAMES.put("spring boot", "Spring Boot");
        CANONICAL_NAMES.put("django", "Django");
        CANONICAL_NAMES.put("flask", "Flask");
        CANONICAL_NAMES.put("fastapi", "FastAPI");
        CANONICAL_NAMES.put("sql", "SQL");
        CANONICAL_NAMES.put("mysql", "MySQL");
        CANONICAL_NAMES.put("postgresql", "PostgreSQL");
        CANONICAL_NAMES.put("mongodb", "MongoDB");
        CANONICAL_NAMES.put("redis", "Redis");
        CANONICAL_NAMES.put("cassandra", "Cassandra");
        CANONICAL_NAMES.put("oracle", "Oracle");
        CANONICAL_NAMES.put("pl/sql", "PL/SQL");
        CANONICAL_NAMES.put("aws", "AWS");
        CANONICAL_NAMES.put("azure", "Azure");
        CANONICAL_NAMES.put("gcp", "GCP");
        CANONICAL_NAMES.put("docker", "Docker");
        CANONICAL_NAMES.put("kubernetes", "Kubernetes");
        CANONICAL_NAMES.put("terraform", "Terraform");
        CANONICAL_NAMES.put("jenkins", "Jenkins");
        CANONICAL_NAMES.put("ci/cd", "CI/CD");
        CANONICAL_NAMES.put("dsa", "DSA");
        CANONICAL_NAMES.put("data structures", "Data Structures");
        CANONICAL_NAMES.put("algorithms", "Algorithms");
        CANONICAL_NAMES.put("system design", "System Design");
        CANONICAL_NAMES.put("microservices", "Microservices");
        CANONICAL_NAMES.put("rest api", "REST API");
        CANONICAL_NAMES.put("graphql", "GraphQL");
        CANONICAL_NAMES.put("machine learning", "Machine Learning");
        CANONICAL_NAMES.put("deep learning", "Deep Learning");
        CANONICAL_NAMES.put("artificial intelligence", "AI");
        CANONICAL_NAMES.put("tensorflow", "TensorFlow");
        CANONICAL_NAMES.put("pytorch", "PyTorch");
        CANONICAL_NAMES.put("pandas", "Pandas");
        CANONICAL_NAMES.put("numpy", "NumPy");
        CANONICAL_NAMES.put("oops", "OOPs");
        CANONICAL_NAMES.put("object oriented", "OOPs");
        CANONICAL_NAMES.put("design patterns", "Design Patterns");
        CANONICAL_NAMES.put("agile", "Agile");
        CANONICAL_NAMES.put("scrum", "Scrum");
        CANONICAL_NAMES.put("git", "Git");
        CANONICAL_NAMES.put("linux", "Linux");
        CANONICAL_NAMES.put("networking", "Networking");
        CANONICAL_NAMES.put("dbms", "DBMS");
        CANONICAL_NAMES.put("operating systems", "OS");
        CANONICAL_NAMES.put("computer networks", "Networking");
        CANONICAL_NAMES.put("html", "HTML");
        CANONICAL_NAMES.put("css", "CSS");
        CANONICAL_NAMES.put("bootstrap", "Bootstrap");
        CANONICAL_NAMES.put("full stack", "Full Stack");
        CANONICAL_NAMES.put("android", "Android");
        CANONICAL_NAMES.put("ios", "iOS");
        CANONICAL_NAMES.put("flutter", "Flutter");
        CANONICAL_NAMES.put("kafka", "Kafka");
        CANONICAL_NAMES.put("spark", "Spark");
        CANONICAL_NAMES.put("hadoop", "Hadoop");
        CANONICAL_NAMES.put("excel", "Excel");
        CANONICAL_NAMES.put("analytics", "Analytics");
        CANONICAL_NAMES.put("tableau", "Tableau");
        CANONICAL_NAMES.put("power bi", "Power BI");
        CANONICAL_NAMES.put("communication", "Communication");
        CANONICAL_NAMES.put("aptitude", "Aptitude");
        CANONICAL_NAMES.put("problem solving", "Problem Solving");
        CANONICAL_NAMES.put("logical reasoning", "Logical Reasoning");
        CANONICAL_NAMES.put("verbal reasoning", "Verbal Reasoning");
        CANONICAL_NAMES.put("testing", "Testing");
        CANONICAL_NAMES.put("selenium", "Selenium");
        CANONICAL_NAMES.put("junit", "JUnit");
        CANONICAL_NAMES.put("cloud", "Cloud");
        CANONICAL_NAMES.put("devops", "DevOps");
        CANONICAL_NAMES.put("apex", "Apex");
        CANONICAL_NAMES.put("abap", "ABAP");
        CANONICAL_NAMES.put("data analysis", "Data Analysis");
        CANONICAL_NAMES.put("data science", "Data Science");
    }

    /**
     * Extracts skills from raw resume/text input by keyword matching.
     */
    public List<String> extractSkillsFromText(String resumeText) {
        if (resumeText == null || resumeText.trim().isEmpty()) {
            return Collections.emptyList();
        }
        Set<String> extracted = new LinkedHashSet<>();
        String lowerText = resumeText.toLowerCase();

        // Prioritize multi-word skills first (longer matches first)
        List<String> sortedSkills = new ArrayList<>(KNOWN_SKILLS);
        sortedSkills.sort((a, b) -> b.length() - a.length());

        for (String skill : sortedSkills) {
            if (lowerText.contains(skill)) {
                String canonical = CANONICAL_NAMES.getOrDefault(skill, capitalize(skill));
                extracted.add(canonical);
            }
        }
        return new ArrayList<>(extracted);
    }

    /**
     * Parses comma-separated skill strings into a clean list.
     */
    public List<String> parseSkillsFromCommaList(String skillsInput) {
        if (skillsInput == null || skillsInput.trim().isEmpty()) {
            return Collections.emptyList();
        }
        List<String> skills = new ArrayList<>();
        for (String s : skillsInput.split(",")) {
            String trimmed = s.trim();
            if (!trimmed.isEmpty()) {
                skills.add(trimmed);
            }
        }
        return skills;
    }

    private String capitalize(String skill) {
        if (skill == null || skill.isEmpty()) return skill;
        String[] words = skill.split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String word : words) {
            if (!word.isEmpty()) {
                sb.append(Character.toUpperCase(word.charAt(0)));
                sb.append(word.substring(1));
                sb.append(" ");
            }
        }
        return sb.toString().trim();
    }
}
