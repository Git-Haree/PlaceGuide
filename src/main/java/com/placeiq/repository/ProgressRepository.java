package com.placeiq.repository;

import com.placeiq.model.ProgressItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgressRepository extends JpaRepository<ProgressItem, Integer> {
    List<ProgressItem> findByUserProfileId(Integer userProfileId);
    List<ProgressItem> findByUserProfileIdAndCompleted(Integer userProfileId, Boolean completed);
}
