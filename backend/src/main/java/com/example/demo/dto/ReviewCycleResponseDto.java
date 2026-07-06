package com.example.demo.dto;

import lombok.Data;

@Data
public class ReviewCycleResponseDto {
    private Long id;
    private Long versionId;
    private String reviewerUsername;
    private String decision;
    private String feedbackNotes;
}
