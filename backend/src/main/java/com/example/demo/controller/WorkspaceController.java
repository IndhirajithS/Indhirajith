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
        return new ResponseEntity<>(workspaceService.createWorkspace(dto), HttpStatus.CREATED);
    }

    // t7_getAllMethodMapping: Get list of all workspaces
    @GetMapping
    public ResponseEntity<List<WorkspaceSummaryDto>> getAllWorkspaces() {
        return ResponseEntity.ok(workspaceService.getAllWorkspaces());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkspaceResponseDto> getWorkspaceById(@PathVariable Long id) {
        return ResponseEntity.ok(workspaceService.getWorkspaceById(id));
    }

    // t10_updateMethodMapping: Update target workspace details
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROJECT_DIRECTOR')")
    public ResponseEntity<WorkspaceResponseDto> updateWorkspace(
            @PathVariable Long id, 
            @Valid @RequestBody WorkspaceRequestDto dto) {
        return ResponseEntity.ok(workspaceService.updateWorkspace(id, dto));
    }

    // t8_deleteMethodMapping: Delete target workspace completely
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROJECT_DIRECTOR')")
    public ResponseEntity<Void> deleteWorkspace(@PathVariable Long id) {
        workspaceService.deleteWorkspace(id);
        return ResponseEntity.noContent().build();
    }

    // t6_controllerRbacGating: Workspace Member Actions
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