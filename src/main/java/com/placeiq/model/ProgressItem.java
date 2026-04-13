package com.placeiq.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "progress_tracker")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProgressItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_profile_id")
    private Integer userProfileId;

    @Column(name = "skill_name", length = 100)
    private String skillName;

    @Column
    private Boolean completed = false;

    @Column(name = "completion_date")
    private LocalDate completionDate;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
