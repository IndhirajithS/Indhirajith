package com.example.demo.service;

import com.example.demo.dto.DocumentRequestDto;
import com.example.demo.dto.VersionRequestDto;
import com.example.demo.entity.*;
import com.example.demo.event.VersionSubmittedEvent;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final DocumentVersionRepository versionRepository;
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository memberRepository;
    private final SystemUserRepository userRepository;
    private final ReviewCycleRepository reviewCycleRepository;
    private final AuditLogService auditLogService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public Document createDocument(DocumentRequestDto dto, String creatorUsername) {
        SystemUser creator = userRepository.findByUsername(creatorUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Workspace workspace = workspaceRepository.findById(dto.getWorkspaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        if (workspace.getStatus() != WorkspaceStatus.ACTIVE) {
            throw new BusinessValidationException("Workspace is not active");
        }

        if (!memberRepository.existsByWorkspaceAndUser(workspace, creator)) {
            throw new BusinessValidationException("User is not an active member of this workspace");
        }

        Document document = Document.builder()
                .title(dto.getTitle())
                .workspace(workspace)
                .createdBy(creator)
                .lastModifiedBy(creator)
                .currentStatus(DocumentStatus.DRAFT)
                .build();
        document = documentRepository.save(document);

        DocumentVersion initialVersion = DocumentVersion.builder()
                .document(document)
                .versionNumber(1)
                .contentDelta(dto.getContentDelta())
                .commitMessage("Initial initialization commit")
                .versionStatus(VersionStatus.DRAFT)
                .author(creator)
                .build();
        versionRepository.save(initialVersion);

        auditLogService.log(creator, AuditActionType.DOCUMENT_CREATED, "Document", document.getId(), "Document initialized.");
        return document;
    }

    @Transactional
    public DocumentVersion createVersion(Long docId, VersionRequestDto dto, String authorUsername) {
        SystemUser author = userRepository.findByUsername(authorUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found"));
        Document document = documentRepository.findById(docId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        if (document.getCurrentStatus() != DocumentStatus.DRAFT) {
            throw new BusinessValidationException("Can only add versions to a document in DRAFT state");
        }

        DocumentVersion latest = versionRepository.findTopByDocumentOrderByVersionNumberDesc(document)
                .orElseThrow(() -> new ResourceNotFoundException("No previous versions found"));

        DocumentVersion nextVersion = DocumentVersion.builder()
                .document(document)
                .versionNumber(latest.getVersionNumber() + 1)
                .contentDelta(dto.getContentDelta())
                .commitMessage(dto.getCommitMessage())
                .versionStatus(VersionStatus.DRAFT)
                .author(author)
                .build();

        document.setLastModifiedBy(author);
        documentRepository.save(document);

        nextVersion = versionRepository.save(nextVersion);
        auditLogService.log(author, AuditActionType.VERSION_SAVED, "DocumentVersion", nextVersion.getId(), "Saved version " + nextVersion.getVersionNumber());
        return nextVersion;
    }

    @Transactional
    public void submitForReview(Long docId, String actorUsername) {
        SystemUser actor = userRepository.findByUsername(actorUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Actor not found"));
        Document document = documentRepository.findById(docId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        if (document.getCurrentStatus() != DocumentStatus.DRAFT) {
            throw new BusinessValidationException("Document status must be DRAFT to submit for review");
        }

        DocumentVersion latestVersion = versionRepository.findTopByDocumentOrderByVersionNumberDesc(document)
                .orElseThrow(() -> new BusinessValidationException("Document must have at least 1 version to submit"));

        List<SystemUser> reviewers = userRepository.findByRole(UserRole.QUALITY_REVIEWER);
        if (reviewers.isEmpty()) {
            throw new BusinessValidationException("No system users with UserRole.QUALITY_REVIEWER exist");
        }
        SystemUser selectedReviewer = reviewers.get(0);

        document.setCurrentStatus(DocumentStatus.IN_REVIEW);
        documentRepository.save(document);

        latestVersion.setVersionStatus(VersionStatus.SUBMITTED);
        versionRepository.save(latestVersion);

        ReviewCycle reviewCycle = ReviewCycle.builder()
                .version(latestVersion)
                .assignedReviewer(selectedReviewer)
                .decision("PENDING")
                .build();
        reviewCycleRepository.save(reviewCycle);

        auditLogService.log(actor, AuditActionType.VERSION_SUBMITTED, "Document", docId, "Submitted for quality evaluation loop.");
        eventPublisher.publishEvent(new VersionSubmittedEvent(this, latestVersion));
    }

    @Transactional
    public void retractSubmission(Long docId, String actorUsername) {
        SystemUser actor = userRepository.findByUsername(actorUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Actor not found"));
        Document document = documentRepository.findById(docId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        if (document.getCurrentStatus() != DocumentStatus.IN_REVIEW) {
            throw new BusinessValidationException("Document is not currently IN_REVIEW");
        }

        DocumentVersion latestVersion = versionRepository.findTopByDocumentOrderByVersionNumberDesc(document)
                .orElseThrow(() -> new ResourceNotFoundException("No version found"));

        ReviewCycle cycle = reviewCycleRepository.findByVersion(latestVersion)
                .orElseThrow(() -> new ResourceNotFoundException("No matching evaluation step context payload found"));

        if (!"PENDING".equals(cycle.getDecision())) {
            throw new BusinessValidationException("Cannot retract submission once a decision is logged");
        }

        reviewCycleRepository.delete(cycle);

        document.setCurrentStatus(DocumentStatus.DRAFT);
        documentRepository.save(document);

        latestVersion.setVersionStatus(VersionStatus.DRAFT);
        versionRepository.save(latestVersion);

        auditLogService.log(actor, AuditActionType.VERSION_RETRACTED, "Document", docId, "Submission retracted.");
    }

    public Document getById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));
    }

    public List<DocumentVersion> getVersions(Long docId) {
        Document document = getById(docId);
        return versionRepository.findByDocumentOrderByVersionNumberDesc(document);
    }

    public List<DocumentVersion> compareVersions(Long docId, int v1, int v2) {
        return versionRepository.findTwoVersions(docId, v1, v2);
    }

    @Transactional
    public List<Document> getAll() {
        return documentRepository.findAll();
    }

    @Transactional
    public void delete(Long id) {
        Document doc = getById(id);
        documentRepository.delete(doc);
    }

    @Transactional
    public Document update(Long id, DocumentRequestDto dto) {
        Document doc = getById(id);
        doc.setTitle(dto.getTitle());
        Workspace workspace = workspaceRepository.findById(dto.getWorkspaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));
        doc.setWorkspace(workspace);
        return documentRepository.save(doc);
    }
}