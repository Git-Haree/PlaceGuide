package com.placeiq.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "gap_analyses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GapAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_profile_id")
    private Integer userProfileId;

    @Column(name = "company_name", length = 100)
    private String companyName;

    @Column(name = "gap_score")
    private Integer gapScore;

    @Column(name = "matched_skills", columnDefinition = "TEXT")
    private String matchedSkills;

    @Column(name = "missing_skills", columnDefinition = "TEXT")
    private String missingSkills;

    @Column(name = "gemini_advice", columnDefinition = "TEXT")
    private String geminiAdvice;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
