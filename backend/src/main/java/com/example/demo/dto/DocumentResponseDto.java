package com.example.demo.dto;

import lombok.Data;

@Data
public class DocumentResponseDto {
    private Long id;
    private String title;
    private Long workspaceId;
    private String currentStatus;
    private String createdByUsername;
}