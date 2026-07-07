package com.example.demo.controller;

import com.example.demo.dto.WorkspaceRequestDto;
import com.example.demo.dto.WorkspaceResponseDto;
import com.example.demo.dto.WorkspaceSummaryDto;
import com.example.demo.dto.MemberInviteDto;
import com.example.demo.service.WorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @PostMapping
    @PreAuthorize("hasAnyRole('PROJECT_DIRECTOR', 'CONTENT_CREATOR')")
    public ResponseEntity<WorkspaceResponseDto> createWorkspace(@Valid @RequestBody WorkspaceRequestDto dto) {
        WorkspaceResponseDto createdWorkspace = workspaceService.createWorkspace(dto);
        return new ResponseEntity<>(createdWorkspace, HttpStatus.CREATED);
    }

    // t7_getAllMethodMapping
    @GetMapping
    public ResponseEntity<List<WorkspaceSummaryDto>> getAllWorkspaces() {
        List<WorkspaceSummaryDto> workspaces = workspaceService.getAllWorkspaces();
        return ResponseEntity.ok(workspaces);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkspaceResponseDto> getWorkspaceById(@PathVariable Long id) {
        WorkspaceResponseDto workspace = workspaceService.getWorkspaceById(id);
        return ResponseEntity.ok(workspace);
    }

    // t10_updateMethodMapping
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROJECT_DIRECTOR')")
    public ResponseEntity<WorkspaceResponseDto> updateWorkspace(
            @PathVariable Long id, 
            @Valid @RequestBody WorkspaceRequestDto dto) {
        WorkspaceResponseDto updatedWorkspace = workspaceService.updateWorkspace(id, dto);
        return ResponseEntity.ok(updatedWorkspace);
    }

    // t8_deleteMethodMapping
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROJECT_DIRECTOR')")
    public ResponseEntity<Void> deleteWorkspace(@PathVariable Long id) {
        workspaceService.deleteWorkspace(id);
        return ResponseEntity.noContent().build();
    }

    // t6_controllerRbacGating
    @PostMapping("/{id}/members")
    @PreAuthorize("hasAnyRole('PROJECT_DIRECTOR', 'CONTENT_CREATOR')")
    public ResponseEntity<Void> inviteMember(
            @PathVariable Long id, 
            @Valid @RequestBody MemberInviteDto dto) {
        workspaceService.inviteMember(id, dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{id}/members/{userId}")
    @PreAuthorize("hasRole('PROJECT_DIRECTOR')")
    public ResponseEntity<Void> removeMember(@PathVariable Long id, @PathVariable Long userId) {
        workspaceService.removeMember(id, userId);
        return ResponseEntity.noContent().build();
    }
}