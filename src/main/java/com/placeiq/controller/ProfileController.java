package com.placeiq.controller;

import com.placeiq.model.UserProfile;
import com.placeiq.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    /**
     * POST /api/profiles — Save a new user profile.
     */
    @PostMapping
    public ResponseEntity<UserProfile> createProfile(@RequestBody UserProfile profile) {
        return ResponseEntity.ok(userProfileRepository.save(profile));
    }

    /**
     * GET /api/profiles — List all profiles.
     */
    @GetMapping
    public ResponseEntity<List<UserProfile>> getAllProfiles() {
        return ResponseEntity.ok(userProfileRepository.findAll());
    }

    /**
     * GET /api/profiles/{id} — Get profile by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getById(@PathVariable Integer id) {
        return userProfileRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
