package com.example.demo.controller;

import com.example.demo.dto.ReviewDecisionDto;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import java.security.Principal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PutMapping("/{id}/decision")
    @PreAuthorize("hasRole('QUALITY_REVIEWER')")
    public ResponseEntity<Void> evaluateDecision(@PathVariable("id") Long id, @RequestBody @Valid ReviewDecisionDto dto, Principal principal) {
        if (id == null || id <= 0) {
            throw new BusinessValidationException("Invalid review cycle ID");
        }
        reviewService.submitDecision(id, dto, principal.getName());
        return ResponseEntity.ok().build();
    }
}
