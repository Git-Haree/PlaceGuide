package com.placeiq.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 100)
    private String name;

    @Column(length = 150)
    private String email;

    @Column(length = 100)
    private String domain;

    @Column(name = "experience_level", length = 50)
    private String experienceLevel;

    @Column(precision = 3, scale = 1)
    private BigDecimal cgpa;

    @Column(length = 100)
    private String location;

    @Column(name = "salary_min", precision = 5, scale = 2)
    private BigDecimal salaryMin;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(name = "target_companies", columnDefinition = "TEXT")
    private String targetCompanies;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
