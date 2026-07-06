package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DocumentRequestDto {
    @NotBlank(message = "Document title is required")
    private String title;

    @NotNull(message = "Workspace ID is required")
    private Long workspaceId;

    @NotBlank(message = "Initial version content contentDelta is required")
    private String contentDelta;
}
