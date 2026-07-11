package com.example.demo.service;

import com.example.demo.dto.WorkspaceRequestDto;
import com.example.demo.dto.WorkspaceResponseDto;
import com.example.demo.dto.WorkspaceSummaryDto;
import com.example.demo.dto.MemberInviteDto;
import com.example.demo.entity.Workspace;
import com.example.demo.entity.WorkspaceStatus;
import com.example.demo.entity.WorkspaceMember;
import com.example.demo.entity.MemberRole;
import com.example.demo.entity.SystemUser;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.WorkspaceRepository;
import com.example.demo.repository.WorkspaceMemberRepository;
import com.example.demo.repository.SystemUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkspaceServiceImpl implements WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final SystemUserRepository systemUserRepository;

    private SystemUser getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return systemUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }

    @Override
    @Transactional
    public WorkspaceResponseDto createWorkspace(WorkspaceRequestDto dto) {
        SystemUser currentUser = getCurrentUser();

        Workspace workspace = Workspace.builder()
                .name(dto.getName())
                .capacityLimit(dto.getCapacityLimit() != null ? dto.getCapacityLimit() : 10)
                .owner(currentUser)
                .status(WorkspaceStatus.ACTIVE)
                .build();

        workspace = workspaceRepository.save(workspace);

        // Add the creator as a member
        WorkspaceMember creatorMember = WorkspaceMember.builder()
                .workspace(workspace)
                .user(currentUser)
                .memberRole(MemberRole.CREATOR)
                .build();
        workspaceMemberRepository.save(creatorMember);

        return convertToResponseDto(workspace);
    }

    @Override
    public List<WorkspaceSummaryDto> getAllWorkspaces() {
        List<Workspace> workspaces = workspaceRepository.findAll();
        return workspaces.stream()
                .map(this::convertToSummaryDto)
                .collect(Collectors.toList());
    }

    @Override
    public WorkspaceResponseDto getWorkspaceById(Long id) {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));
        return convertToResponseDto(workspace);
    }

    @Override
    @Transactional
    public WorkspaceResponseDto updateWorkspace(Long id, WorkspaceRequestDto dto) {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        if (workspace.getStatus() != WorkspaceStatus.ACTIVE) {
            throw new BusinessValidationException("Workspace is not active");
        }

        workspace.setName(dto.getName());
        if (dto.getCapacityLimit() != null) {
            long currentMembers = workspaceMemberRepository.countByWorkspace(workspace);
            if (currentMembers > dto.getCapacityLimit()) {
                throw new BusinessValidationException("New capacity limit is less than current member count");
            }
            workspace.setCapacityLimit(dto.getCapacityLimit());
        }

        workspace = workspaceRepository.save(workspace);
        return convertToResponseDto(workspace);
    }

    @Override
    @Transactional
    public void deleteWorkspace(Long id) {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        workspace.setStatus(WorkspaceStatus.ARCHIVED);
        workspaceRepository.save(workspace);
    }

    @Override
    @Transactional
    public void inviteMember(Long id, MemberInviteDto dto) {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        if (workspace.getStatus() != WorkspaceStatus.ACTIVE) {
            throw new BusinessValidationException("Workspace is not active");
        }

        SystemUser userToInvite = systemUserRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User to invite not found"));

        if (workspaceMemberRepository.existsByWorkspaceAndUser(workspace, userToInvite)) {
            throw new BusinessValidationException("User is already a member of this workspace");
        }

        long currentMembers = workspaceMemberRepository.countByWorkspace(workspace);
        if (currentMembers >= workspace.getCapacityLimit()) {
            throw new BusinessValidationException("Workspace capacity limit reached");
        }

        WorkspaceMember member = WorkspaceMember.builder()
                .workspace(workspace)
                .user(userToInvite)
                .memberRole(dto.getMemberRole())
                .build();
        workspaceMemberRepository.save(member);
    }

    @Override
    @Transactional
    public void removeMember(Long id, Long userId) {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        if (workspace.getStatus() != WorkspaceStatus.ACTIVE) {
            throw new BusinessValidationException("Workspace is not active");
        }

        SystemUser user = systemUserRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        WorkspaceMember member = workspaceMemberRepository.findByWorkspaceAndUser(workspace, user)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found in workspace"));

        if (member.getMemberRole() == MemberRole.CREATOR) {
            throw new BusinessValidationException("Cannot remove the creator of the workspace");
        }

        workspaceMemberRepository.delete(member);
    }

    private WorkspaceResponseDto convertToResponseDto(Workspace workspace) {
        WorkspaceResponseDto dto = new WorkspaceResponseDto();
        dto.setId(workspace.getId());
        dto.setName(workspace.getName());
        dto.setCapacityLimit(workspace.getCapacityLimit());
        dto.setOwnerUsername(workspace.getOwner() != null ? workspace.getOwner().getUsername() : null);
        dto.setStatus(workspace.getStatus() != null ? workspace.getStatus().name() : null);
        return dto;
    }

    private WorkspaceSummaryDto convertToSummaryDto(Workspace workspace) {
        WorkspaceSummaryDto dto = new WorkspaceSummaryDto();
        dto.setId(workspace.getId());
        dto.setName(workspace.getName());
        dto.setStatus(workspace.getStatus() != null ? workspace.getStatus().name() : null);
        dto.setMemberCount(workspaceMemberRepository.countByWorkspace(workspace));
        return dto;
    }
}
