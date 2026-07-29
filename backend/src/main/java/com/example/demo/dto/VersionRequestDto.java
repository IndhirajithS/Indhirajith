package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VersionRequestDto {
    private Long documentId;

    @NotBlank(message = "Content delta cannot be blank")
    private String contentDelta;

    private String commitMessage;
}