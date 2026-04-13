package com.placeiq.controller;

import com.placeiq.model.Company;
import com.placeiq.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyRepository companyRepository;

    /**
     * GET /api/companies — List all companies.
     */
    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {
        return ResponseEntity.ok(companyRepository.findAll());
    }

    /**
     * GET /api/companies/{name} — Get company by name.
     */
    @GetMapping("/{name}")
    public ResponseEntity<Company> getCompanyByName(@PathVariable String name) {
        return companyRepository.findByNameIgnoreCase(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/companies/category/{category} — Get companies by category.
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Company>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(companyRepository.findByCategoryIgnoreCase(category));
    }
}
