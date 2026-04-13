package com.placeiq;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PlaceIQApplication {

    public static void main(String[] args) {
        SpringApplication.run(PlaceIQApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("  PlaceIQ Backend Started Successfully!");
        System.out.println("  API available at: http://localhost:8080");
        System.out.println("========================================\n");
    }
}
