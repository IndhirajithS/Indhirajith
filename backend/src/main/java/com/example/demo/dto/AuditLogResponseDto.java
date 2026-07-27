package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponseDto {
    private Long id;
    private String action;
    private String actionType;
    private String performedByUsername;
    private String targetEntity;
    private Long targetEntityId;
    private Long targetId;
    private String description;
    private LocalDateTime timestamp;
    private LocalDateTime performedAt;
}
