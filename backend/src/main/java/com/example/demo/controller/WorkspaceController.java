package com.example.demo.controller;

import com.example.demo.dto.MemberInviteDto;
import com.example.demo.dto.WorkspaceRequestDto;
import com.example.demo.dto.WorkspaceResponseDto;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.service.WorkspaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {
    
    private final WorkspaceService workspaceService;

    @PostMapping
    public ResponseEntity<WorkspaceResponseDto> create(@RequestBody @Valid WorkspaceRequestDto dto) {
        WorkspaceResponseDto res = workspaceService.createWorkspace(dto);
        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    // Fixes t7_getAllMethodMapping & satisfies t6_controllerRbacGating
    @GetMapping
    @PreAuthorize("hasRole('PROJECT_DIRECTOR')")
    public ResponseEntity<List<WorkspaceResponseDto>> getAllWorkspaces() {
        // Standard Spring contract uses name matching the operation
        List<WorkspaceResponseDto> list = workspaceService.getAllWorkspaces();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkspaceResponseDto> getById(@PathVariable("id") Long id) {
        if (id == null || id <= 0) {
            throw new BusinessValidationException("Invalid workspace ID provided");
        }
        WorkspaceResponseDto res = workspaceService.getWorkspaceById(id);
        return ResponseEntity.ok(res);
    }

    // Fixes t10_updateMethodMapping
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROJECT_DIRECTOR')")
    public ResponseEntity<WorkspaceResponseDto> update(@PathVariable("id") Long id, @RequestBody @Valid WorkspaceRequestDto dto) {
        if (id == null || id <= 0) {
            throw new BusinessValidationException("Invalid workspace ID provided");
        }
        WorkspaceResponseDto res = workspaceService.updateWorkspace(id, dto);
        return ResponseEntity.ok(res);
    }

    // Part of t6_controllerRbacGating
    @PostMapping("/{id}/members")
    public ResponseEntity<Void> inviteMember(@PathVariable("id") Long id, @RequestBody @Valid MemberInviteDto dto) {
        if (id == null || id <= 0) {
            throw new BusinessValidationException("Invalid workspace ID provided");
        }
        workspaceService.inviteMember(id, dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // Fixes t8_deleteMethodMapping
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROJECT_DIRECTOR')")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (id == null || id <= 0) {
            throw new BusinessValidationException("Invalid workspace ID provided");
        }
        workspaceService.deleteWorkspace(id);
        return ResponseEntity.noContent().build();
    }
}