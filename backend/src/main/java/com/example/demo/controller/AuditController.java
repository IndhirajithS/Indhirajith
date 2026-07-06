package com.example.demo.controller;

import com.example.demo.dto.AuditLogResponseDto;
import com.example.demo.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditController {
    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<AuditLogResponseDto>> getAll() {
        return ResponseEntity.ok(auditLogService.findAll());
    }
}
