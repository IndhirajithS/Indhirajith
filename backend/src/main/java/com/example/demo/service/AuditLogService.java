package com.example.demo.service;

import com.example.demo.entity.AuditActionType;
import com.example.demo.entity.AuditLog;
import com.example.demo.entity.SystemUser;
import com.example.demo.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}
