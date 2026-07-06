package com.example.demo.service;

import com.example.demo.dto.MemberInviteDto;
import com.example.demo.dto.WorkspaceRequestDto;
import com.example.demo.entity.*;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkspaceService {
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final SystemUserRepository systemUserRepository;
    private final ReviewCycleRepository reviewCycleRepository;
    private final DocumentRepository documentRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public Workspace createWorkspace(WorkspaceRequestDto dto, String ownerUsername) {
        SystemUser owner = systemUserRepository.findByUsername(ownerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Owner user not found"));

        Workspace workspace = Workspace.builder()
                .name(dto.getName())
                .capacityLimit(dto.getCapacityLimit() != null ? dto.getCapacityLimit() : 10)
                .owner(owner)
                .status(WorkspaceStatus.ACTIVE)
                .build();

        workspace = workspaceRepository.save(workspace);

        WorkspaceMember ownerMember = WorkspaceMember.builder()
                .workspace(workspace)
                .user(owner)
                .memberRole(MemberRole.CREATOR)
                .build();
        workspaceMemberRepository.save(ownerMember);

        auditLogService.log(owner, AuditActionType.WORKSPACE_CREATED, "Workspace", workspace.getId(), "Workspace created successfully.");
        return workspace;
    }

    @Transactional
    public void inviteMember(Long workspaceId, MemberInviteDto dto, String actorUsername) {
        SystemUser actor = systemUserRepository.findByUsername(actorUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Actor not found"));
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        if (workspace.getStatus() != WorkspaceStatus.ACTIVE) {
            throw new BusinessValidationException("Cannot invite members to an archived workspace");
        }

        SystemUser targetUser = systemUserRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Target user not found"));

        if (workspaceMemberRepository.existsByWorkspaceAndUser(workspace, targetUser)) {
            throw new BusinessValidationException("User is already enrolled in this workspace");
        }

        long currentMembers = workspaceMemberRepository.countByWorkspace(workspace);
        if (currentMembers >= workspace.getCapacityLimit()) {
            throw new BusinessValidationException("Workspace capacity limit has been exceeded");
        }

        WorkspaceMember workspaceMember = WorkspaceMember.builder()
                .workspace(workspace)
                .user(targetUser)
                .memberRole(dto.getMemberRole())
                .build();
        workspaceMemberRepository.save(workspaceMember);

        auditLogService.log(actor, AuditActionType.MEMBER_ADDED, "Workspace", workspaceId, "Added member " + targetUser.getUsername());
    }

    @Transactional
    public void archiveWorkspace(Long workspaceId, String actorUsername) {
        SystemUser actor = systemUserRepository.findByUsername(actorUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Actor not found"));
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        List<ReviewCycle> openCycles = reviewCycleRepository.findPendingCyclesByWorkspace(workspaceId);
        if (!openCycles.isEmpty()) {
            throw new BusinessValidationException("Cannot archive workspace while active review cycles exist");
        }

        workspace.setStatus(WorkspaceStatus.ARCHIVED);
        workspaceRepository.save(workspace);

        List<Document> documents = documentRepository.findByWorkspace(workspace);
        for (Document doc : documents) {
            if (doc.getCurrentStatus() == DocumentStatus.DRAFT) {
                doc.setCurrentStatus(DocumentStatus.ARCHIVED);
                documentRepository.save(doc);
            }
        }

        auditLogService.log(actor, AuditActionType.WORKSPACE_ARCHIVED, "Workspace", workspaceId, "Archived workspace.");
    }

    public List<Workspace> getActiveWorkspaces() {
        return workspaceRepository.findAllActive();
    }

    public Workspace getById(Long id) {
        return workspaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found with ID: " + id));
    }
}