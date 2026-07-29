package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.*;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VersionService {

    private final DocumentVersionRepository versionRepository;
    private final DocumentRepository documentRepository;
    private final SystemUserRepository userRepository;
    private final ReviewCycleRepository reviewCycleRepository;

    @Transactional
    public VersionResponseDto saveDraftVersion(VersionRequestDto dto, String username) {
        Document doc = documentRepository.findById(dto.getDocumentId())
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        if (doc.getCurrentStatus() != DocumentStatus.DRAFT && doc.getCurrentStatus() != DocumentStatus.REJECTED) {
            throw new BusinessValidationException("Versions can only be saved when document is DRAFT or REJECTED");
        }

        SystemUser author = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        int nextVersionNumber = versionRepository.countByDocument(doc) + 1;

        DocumentVersion version = DocumentVersion.builder()
                .document(doc)
                .versionNumber(nextVersionNumber)
                .contentDelta(dto.getContentDelta())
                .commitMessage(dto.getCommitMessage())
                .versionStatus(VersionStatus.DRAFT)
                .author(author)
                .build();

        version = versionRepository.save(version);

        doc.setLastModifiedBy(author);
        doc.setCurrentStatus(DocumentStatus.DRAFT);
        documentRepository.save(doc);

        return mapToDto(version);
    }

    public List<VersionResponseDto> getVersionHistory(Long docId) {
        Document doc = documentRepository.findById(docId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        return versionRepository.findByDocumentOrderByVersionNumberDesc(doc)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public VersionResponseDto getVersionById(Long versionId) {
        DocumentVersion version = versionRepository.findById(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("Version not found"));
        return mapToDto(version);
    }

    public VersionCompareDto compareVersions(Long docId, int v1, int v2) {
        List<DocumentVersion> versions = versionRepository.findTwoVersions(docId, v1, v2);

        DocumentVersion version1 = versions.stream().filter(v -> v.getVersionNumber() == v1).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Version " + v1 + " not found"));
        DocumentVersion version2 = versions.stream().filter(v -> v.getVersionNumber() == v2).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Version " + v2 + " not found"));

        int countA = countWords(version1.getContentDelta());
        int countB = countWords(version2.getContentDelta());
        int delta = countB - countA;
        double pct = countA == 0 ? (countB == 0 ? 0.0 : 100.0) : ((double) delta / countA) * 100.0;

        return VersionCompareDto.builder()
                .versionA(mapToDto(version1))
                .versionB(mapToDto(version2))
                .wordCountA(countA)
                .wordCountB(countB)
                .wordCountDelta(delta)
                .changePercentage(pct)
                .build();
    }

    private int countWords(String str) {
        if (str == null || str.trim().isEmpty()) return 0;
        return str.trim().split("\\s+").length;
    }

    private VersionResponseDto mapToDto(DocumentVersion v) {
        Optional<ReviewCycle> rc = reviewCycleRepository.findByVersion(v);
        return VersionResponseDto.builder()
                .id(v.getId())
                .documentId(v.getDocument().getId())
                .documentTitle(v.getDocument().getTitle())
                .versionNumber(v.getVersionNumber())
                .contentDelta(v.getContentDelta())
                .commitMessage(v.getCommitMessage())
                .versionStatus(v.getVersionStatus())
                .authorUsername(v.getAuthor().getUsername())
                .createdAt(v.getCreatedAt())
                .reviewDecision(rc.map(ReviewCycle::getDecision).orElse(null))
                .reviewerUsername(rc.map(r -> r.getAssignedReviewer().getUsername()).orElse(null))
                .build();
    }
}