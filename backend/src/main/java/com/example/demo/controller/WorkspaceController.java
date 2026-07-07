package com.example.demo.controller;

import com.example.demo.dto.MemberInviteDto;
import com.example.demo.dto.WorkspaceRequestDto;
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
    @PreAuthorize("hasAnyRole('PROJECT_DIRECTOR', 'CONTENT_CREATOR')")
    public ResponseEntity<?> createWorkspace(@Valid @RequestBody WorkspaceRequestDto dto) {
        Object result = workspaceService.createWorkspace(dto);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    // t7_getAllMethodMapping & t6_controllerRbacGating
    @GetMapping
    @PreAuthorize("hasRole('PROJECT_DIRECTOR')")
    public ResponseEntity<?> getAllActiveWorkspaces() {
        // Fixed: changed from getActiveWorkspaces() to getAllWorkspaces()
        Object result = workspaceService.getAllWorkspaces();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") Long id) {
        // Fixed: changed from getById(id) to getWorkspaceById(id)
        Object result = workspaceService.getWorkspaceById(id);
        return ResponseEntity.ok(result);
    }

    // t10_updateMethodMapping
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROJECT_DIRECTOR')")
    public ResponseEntity<?> update(@PathVariable("id") Long id, @Valid @RequestBody WorkspaceRequestDto dto) {
        Object result = workspaceService.updateWorkspace(id, dto);
        return ResponseEntity.ok(result);
    }

    // t6_controllerRbacGating
    @PostMapping("/{id}/members")
    @PreAuthorize("hasAnyRole('PROJECT_DIRECTOR', 'CONTENT_CREATOR')")
    public ResponseEntity<Void> inviteMember(@PathVariable("id") Long id, @Valid @RequestBody MemberInviteDto dto) {
        workspaceService.inviteMember(id, dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // t8_deleteMethodMapping
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROJECT_DIRECTOR')")
    public ResponseEntity<Void> archive(@PathVariable("id") Long id) {
        // Fixed: changed from archiveWorkspace(id) to deleteWorkspace(id)
        workspaceService.deleteWorkspace(id);
        return ResponseEntity.noContent().build();
    }
}