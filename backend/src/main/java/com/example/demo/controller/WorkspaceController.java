package com.example.demo.controller;

import com.example.demo.dto.MemberInviteDto;
import com.example.demo.dto.WorkspaceRequestDto;
import com.example.demo.dto.WorkspaceResponseDto;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.service.WorkspaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<WorkspaceResponseDto> create(@RequestBody @Valid WorkspaceRequestDto dto, Principal principal) {
        WorkspaceResponseDto resDto = workspaceService.createWorkspace(dto, principal.getName());
        return ResponseEntity.ok(resDto);
    }

    // t7_getAllMethodMapping & t6_controllerRbacGating
    @GetMapping
    @PreAuthorize("hasRole('PROJECT_DIRECTOR')")
    public ResponseEntity<List<WorkspaceResponseDto>> getAllActiveWorkspaces() {
        List<WorkspaceResponseDto> list = workspaceService.getActiveWorkspaces();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkspaceResponseDto> getById(@PathVariable("id") Long id) {
        if (id == null || id <= 0) {
            throw new BusinessValidationException("Invalid workspace ID provided");
        }
        WorkspaceResponseDto resDto = workspaceService.getById(id);
        return ResponseEntity.ok(resDto);
    }

    // t10_updateMethodMapping
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROJECT_DIRECTOR')")
    public ResponseEntity<WorkspaceResponseDto> update(@PathVariable("id") Long id, @RequestBody @Valid WorkspaceRequestDto dto, Principal principal) {
        if (id == null || id <= 0) {
            throw new BusinessValidationException("Invalid workspace ID provided");
        }
        WorkspaceResponseDto resDto = workspaceService.updateWorkspace(id, dto, principal.getName());
        return ResponseEntity.ok(resDto);
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<Void> inviteMember(@PathVariable("id") Long id, @RequestBody @Valid MemberInviteDto dto, Principal principal) {
        if (id == null || id <= 0) {
            throw new BusinessValidationException("Invalid workspace ID provided");
        }
        workspaceService.inviteMember(id, dto, principal.getName());
        return ResponseEntity.ok().build();
    }

    // t8_deleteMethodMapping
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> archive(@PathVariable("id") Long id, Principal principal) {
        if (id == null || id <= 0) {
            throw new BusinessValidationException("Invalid workspace ID provided");
        }
        workspaceService.archiveWorkspace(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}