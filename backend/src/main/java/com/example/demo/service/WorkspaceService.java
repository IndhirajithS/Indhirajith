package com.example.demo.service;

import com.example.demo.dto.WorkspaceRequestDto;
import com.example.demo.dto.WorkspaceResponseDto;
import com.example.demo.dto.WorkspaceSummaryDto;
import com.example.demo.dto.MemberInviteDto;
import java.util.List;

public interface WorkspaceService {
    
    // Fixes: workspaceService.createWorkspace(dto)
    WorkspaceResponseDto createWorkspace(WorkspaceRequestDto dto);

    // Fixes: workspaceService.getAllWorkspaces()
    List<WorkspaceSummaryDto> getAllWorkspaces();

    // Fixes: workspaceService.getWorkspaceById(id)
    WorkspaceResponseDto getWorkspaceById(Long id);

    // Fixes: workspaceService.updateWorkspace(id, dto)
    WorkspaceResponseDto updateWorkspace(Long id, WorkspaceRequestDto dto);

    // Fixes: workspaceService.deleteWorkspace(id)
    void deleteWorkspace(Long id);

    // Fixes: workspaceService.inviteMember(id, dto)
    void inviteMember(Long id, MemberInviteDto dto);

    // Fixes: workspaceService.removeMember(id, userId)
    void removeMember(Long id, Long userId);
}