package com.example.demo.controller;

import com.example.demo.dto.AuditLogResponseDto;
import com.example.demo.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditLogService auditLogService;

    @GetMapping("/document/{docId}")
    @PreAuthorize("hasAnyRole('PROJECT_DIRECTOR', 'QUALITY_REVIEWER')")
    public ResponseEntity<List<AuditLogResponseDto>> getDocumentTrail(@PathVariable("docId") Long docId) {
        return ResponseEntity.ok(auditLogService.getAuditTrailForDocument(docId));
    }

    @GetMapping("/recent")
    @PreAuthorize("hasRole('PROJECT_DIRECTOR')")
    public ResponseEntity<List<AuditLogResponseDto>> getRecent() {
        return ResponseEntity.ok(auditLogService.getRecentPlatformActivity());
    }
}