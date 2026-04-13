package com.placeiq.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "companies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 50)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "min_fresher_ctc", precision = 5, scale = 2)
    private BigDecimal minFresherCtc;

    @Column(name = "max_fresher_ctc", precision = 5, scale = 2)
    private BigDecimal maxFresherCtc;

    @Column(name = "hiring_months", length = 200)
    private String hiringMonths;

    @Column(name = "interview_rounds", columnDefinition = "TEXT")
    private String interviewRounds;

    @Column(name = "top_skills", columnDefinition = "TEXT")
    private String topSkills;

    @Column(name = "job_keywords", columnDefinition = "TEXT")
    private String jobKeywords;

    @Column(name = "pyq_links", columnDefinition = "TEXT")
    private String pyqLinks;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;
}
