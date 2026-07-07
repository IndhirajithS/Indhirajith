package com.example.demo.service;

import com.example.demo.dto.MemberInviteDto;
import com.example.demo.dto.WorkspaceRequestDto;
import com.example.demo.dto.WorkspaceResponseDto;
import java.util.List;

public interface WorkspaceService {
    WorkspaceResponseDto createWorkspace(WorkspaceRequestDto dto);
    
    // FIX: Add this exact method matching your controller line
    List<WorkspaceResponseDto> getAllWorkspaces();
    
    WorkspaceResponseDto getWorkspaceById(Long id);
    WorkspaceResponseDto updateWorkspace(Long id, WorkspaceRequestDto dto);
    void inviteMember(Long id, MemberInviteDto dto);
    void deleteWorkspace(Long id);
}