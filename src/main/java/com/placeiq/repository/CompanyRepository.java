package com.placeiq.repository;

import com.placeiq.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Integer> {
    Optional<Company> findByNameIgnoreCase(String name);
    List<Company> findByCategory(String category);
    List<Company> findByCategoryIgnoreCase(String category);
}
