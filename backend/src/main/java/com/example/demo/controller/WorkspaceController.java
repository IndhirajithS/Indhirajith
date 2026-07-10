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
        return new ResponseEntity<>(workspaceService.createWorkspace(dto), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('PROJECT_DIRECTOR')")
    public ResponseEntity<?> getAllActiveWorkspaces() {
        return ResponseEntity.ok(workspaceService.getAllWorkspaces());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(workspaceService.getWorkspaceById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROJECT_DIRECTOR')")
    public ResponseEntity<?> update(@PathVariable("id") Long id, @Valid @RequestBody WorkspaceRequestDto dto) {
        return ResponseEntity.ok(workspaceService.updateWorkspace(id, dto));
    }

    @PostMapping("/{id}/members")
    @PreAuthorize("hasAnyRole('PROJECT_DIRECTOR', 'CONTENT_CREATOR')")
    public ResponseEntity<Void> inviteMember(@PathVariable("id") Long id, @Valid @RequestBody MemberInviteDto dto) {
        workspaceService.inviteMember(id, dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROJECT_DIRECTOR')")
    public ResponseEntity<Void> archive(@PathVariable("id") Long id) {
        workspaceService.deleteWorkspace(id);
        return ResponseEntity.noContent().build();
    }
}