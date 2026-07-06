package com.example.demo.service;

import com.example.demo.dto.AuditLogResponseDto;
import com.example.demo.entity.AuditActionType;
import com.example.demo.entity.AuditLog;
import com.example.demo.entity.SystemUser;
import com.example.demo.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditLogService {
    private final AuditLogRepository auditLogRepository;

    @Transactional
    public void log(SystemUser actor, AuditActionType actionType, String targetEntity, Long targetId, String description) {
        AuditLog log = AuditLog.builder()
                .actor(actor)
                .actionType(actionType)
                .targetEntity(targetEntity)
                .targetId(targetId)
                .description(description)
                .build();
        auditLogRepository.save(log);
    }

    public List<AuditLogResponseDto> findAll() {
        return auditLogRepository.findAll().stream()
                .map(log -> {
                    AuditLogResponseDto dto = new AuditLogResponseDto();
                    dto.setId(log.getId());
                    dto.setAction(log.getActionType() != null ? log.getActionType().name() : null);
                    dto.setTargetEntity(log.getTargetEntity());
                    dto.setTargetEntityId(log.getTargetId());
                    dto.setTimestamp(log.getPerformedAt());
                    if (log.getActor() != null) {
                        dto.setPerformedByUsername(log.getActor().getUsername());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }
}

