package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReviewDecisionDto {
    @NotBlank(message = "Decision status is required")
    private String decision; // APPROVED or REJECTED

    private String feedbackNotes;
}