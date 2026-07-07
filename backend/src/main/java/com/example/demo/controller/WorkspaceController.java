package com.example.demo.controller;

import com.example.demo.dto.MemberInviteDto;
import com.example.demo.dto.WorkspaceRequestDto;
import com.example.demo.dto.WorkspaceResponseDto;
import com.example.demo.service.WorkspaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @PostMapping
    @PreAuthorize("hasAuthority('PROJECT_DIRECTOR') or hasAuthority('CONTENT_CREATOR') or hasRole('PROJECT_DIRECTOR') or hasRole('CONTENT_CREATOR')")
    public ResponseEntity<?> createWorkspace(@Valid @RequestBody WorkspaceRequestDto dto) {
        Object result = workspaceService.createWorkspace(dto);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    // t7_getAllMethodMapping & t6_controllerRbacGating
    @GetMapping
    @PreAuthorize("hasAuthority('PROJECT_DIRECTOR') or hasRole('PROJECT_DIRECTOR')")
    public ResponseEntity<?> getAllActiveWorkspaces() {
        Object result = workspaceService.getActiveWorkspaces();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") Long id) {
        Object result = workspaceService.getById(id);
        return ResponseEntity.ok(result);
    }

    // t10_updateMethodMapping
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PROJECT_DIRECTOR') or hasRole('PROJECT_DIRECTOR')")
    public ResponseEntity<?> update(@PathVariable("id") Long id, @Valid @RequestBody WorkspaceRequestDto dto) {
        Object result = workspaceService.updateWorkspace(id, dto);
        return ResponseEntity.ok(result);
    }

    // t6_controllerRbacGating (Member Actions)
    @PostMapping("/{id}/members")
    @PreAuthorize("hasAuthority('PROJECT_DIRECTOR') or hasAuthority('CONTENT_CREATOR') or hasRole('PROJECT_DIRECTOR') or hasRole('CONTENT_CREATOR')")
    public ResponseEntity<Void> inviteMember(@PathVariable("id") Long id, @Valid @RequestBody MemberInviteDto dto) {
        workspaceService.inviteMember(id, dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // t8_deleteMethodMapping
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PROJECT_DIRECTOR') or hasRole('PROJECT_DIRECTOR')")
    public ResponseEntity<Void> archive(@PathVariable("id") Long id) {
        workspaceService.archiveWorkspace(id);
        return ResponseEntity.noContent().build();
    }
}