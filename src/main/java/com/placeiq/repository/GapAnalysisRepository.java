package com.placeiq.repository;

import com.placeiq.model.GapAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GapAnalysisRepository extends JpaRepository<GapAnalysis, Integer> {
    List<GapAnalysis> findByUserProfileId(Integer userProfileId);
    List<GapAnalysis> findByCompanyName(String companyName);
}
