package com.example.demo.dto;

import lombok.Data;

@Data
public class VersionResponseDto {
    private Long id;
    private Long documentId;
    private int versionNumber;
    private String contentDelta;
    private String commitMessage;
    private String versionStatus;
    private String authorUsername;
}