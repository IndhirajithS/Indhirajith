package com.example.demo.service;

import com.example.demo.dto.VersionCompareDto;
import com.example.demo.dto.VersionRequestDto;
import com.example.demo.dto.VersionResponseDto;
import com.example.demo.entity.*;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VersionService {

    private final DocumentVersionRepository documentVersionRepository;
    private final DocumentRepository documentRepository;
    private final SystemUserRepository systemUserRepository;
    private final ReviewCycleRepository reviewCycleRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public VersionResponseDto saveDraftVersion(VersionRequestDto dto, String username) {
        Document document = documentRepository.findById(dto.getDocumentId())
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id " + dto.getDocumentId()));
        SystemUser user = getUser(username);

        if (document.getCurrentStatus() != DocumentStatus.DRAFT && document.getCurrentStatus() != DocumentStatus.REJECTED) {
            throw new BusinessValidationException("Document must be in DRAFT or REJECTED status to save a new version");
        }

        // Safe cast in case countByDocument returns long in repository
        int nextVersionNumber = ((Number) documentVersionRepository.countByDocument(document)).intValue() + 1;

        DocumentVersion version = DocumentVersion.builder()
                .document(document)
                .versionNumber(nextVersionNumber)
                .contentDelta(dto.getContentDelta())
                .commitMessage(dto.getCommitMessage())
                .versionStatus(VersionStatus.DRAFT)
                .author(user)
                .build();
        version = documentVersionRepository.save(version);

        document.setLastModifiedBy(user);
        if (document.getCurrentStatus() == DocumentStatus.REJECTED) {
            document.setCurrentStatus(DocumentStatus.DRAFT);
        }
        documentRepository.save(document);

        auditLogService.recordAction(user.getId(), AuditActionType.VERSION_SAVED,
                "Document", document.getId(), "Version " + nextVersionNumber + " saved");

        return toDto(version);
    }

    public List<VersionResponseDto> getVersionHistory(Long docId) {
        Document document = documentRepository.findById(docId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id " + docId));

        return documentVersionRepository.findByDocumentOrderByVersionNumberDesc(document)
                .stream().map(this::toDto).toList();
    }

    public VersionResponseDto getVersionById(Long versionId) {
        DocumentVersion version = getVersion(versionId);
        return toDto(version);
    }

    public VersionCompareDto compareVersions(Long docId, int v1, int v2) {
        List<DocumentVersion> versions = documentVersionRepository.findTwoVersions(docId, v1, v2);

        DocumentVersion versionA = versions.stream().filter(v -> v.getVersionNumber() == v1).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Version " + v1 + " not found for document " + docId));
        DocumentVersion versionB = versions.stream().filter(v -> v.getVersionNumber() == v2).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Version " + v2 + " not found for document " + docId));

        int wordCountA = countWords(versionA.getContentDelta());
        int wordCountB = countWords(versionB.getContentDelta());
        int delta = wordCountB - wordCountA;
        double percentage = wordCountA == 0 ? 0.0 : (delta * 100.0) / wordCountA;

        return VersionCompareDto.builder()
                .versionA(toDto(versionA))
                .versionB(toDto(versionB))
                .wordCountA(wordCountA)
                .wordCountB(wordCountB)
                .wordCountDelta(delta)
                .changePercentage(percentage)
                .build();
    }

    private int countWords(String text) {
        if (text == null || text.isBlank()) return 0;
        return text.trim().split("\\s+").length;
    }

    private DocumentVersion getVersion(Long versionId) {
        return documentVersionRepository.findById(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("Version not found with id " + versionId));
    }

    private SystemUser getUser(String username) {
        return systemUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    private VersionResponseDto toDto(DocumentVersion v) {
        Optional<ReviewCycle> reviewCycle = reviewCycleRepository.findByVersion(v);

        VersionResponseDto.VersionResponseDtoBuilder builder = VersionResponseDto.builder()
                .id(v.getId())
                .documentId(v.getDocument().getId())
                .documentTitle(v.getDocument().getTitle())
                .versionNumber(v.getVersionNumber())
                .contentDelta(v.getContentDelta())
                .commitMessage(v.getCommitMessage())
                .versionStatus(v.getVersionStatus())
                .authorUsername(v.getAuthor().getUsername())
                .createdAt(v.getCreatedAt());

        reviewCycle.ifPresent(rc -> builder
                .reviewDecision(rc.getDecision())
                .reviewerUsername(rc.getAssignedReviewer().getUsername()));

        return builder.build();
    }
}