package com.example.demo.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AuditLogResponseDto {
    private Long id;
    private String action;
    private String performedByUsername;
    private String targetEntity;
    private Long targetEntityId;
    private LocalDateTime timestamp;
}
