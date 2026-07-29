package com.example.demo.service;

import com.example.demo.dto.VersionCompareDto;
import com.example.demo.dto.VersionRequestDto;
import com.example.demo.dto.VersionResponseDto;
import com.example.demo.entity.DocumentVersion;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.DocumentVersionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VersionService {

    private final DocumentService documentService;
    private final DocumentVersionRepository versionRepository;

    public VersionResponseDto saveDraftVersion(VersionRequestDto dto, String username) {
        DocumentVersion version = documentService.createVersion(dto.getDocumentId(), dto, username);
        return convertToDto(version);
    }

    public List<VersionResponseDto> getVersionHistory(Long docId) {
        return documentService.getVersions(docId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public VersionResponseDto getVersionById(Long id) {
        DocumentVersion version = versionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Version not found with ID: " + id));
        return convertToDto(version);
    }

    public VersionCompareDto compareVersions(Long docId, int v1, int v2) {
        List<DocumentVersion> versions = documentService.compareVersions(docId, v1, v2);
        DocumentVersion vA = versions.stream().filter(v -> v.getVersionNumber() == v1).findFirst().orElse(null);
        DocumentVersion vB = versions.stream().filter(v -> v.getVersionNumber() == v2).findFirst().orElse(null);

        VersionResponseDto dtoA = vA != null ? convertToDto(vA) : null;
        VersionResponseDto dtoB = vB != null ? convertToDto(vB) : null;

        int wordsA = (vA != null && vA.getContentDelta() != null) ? vA.getContentDelta().split("\\s+").length : 0;
        int wordsB = (vB != null && vB.getContentDelta() != null) ? vB.getContentDelta().split("\\s+").length : 0;
        int delta = Math.abs(wordsA - wordsB);
        double changePercentage = wordsA > 0 ? ((double) delta / wordsA) * 100 : 0.0;

        return VersionCompareDto.builder()
                .versionA(dtoA)
                .versionB(dtoB)
                .wordCountA(wordsA)
                .wordCountB(wordsB)
                .wordCountDelta(delta)
                .changePercentage(changePercentage)
                .build();
    }

    private VersionResponseDto convertToDto(DocumentVersion v) {
        VersionResponseDto res = new VersionResponseDto();
        res.setId(v.getId());
        res.setDocumentId(v.getDocument() != null ? v.getDocument().getId() : null);
        res.setVersionNumber(v.getVersionNumber());
        res.setContentDelta(v.getContentDelta());
        res.setCommitMessage(v.getCommitMessage());
        res.setVersionStatus(v.getVersionStatus() != null ? v.getVersionStatus().name() : null);
        res.setAuthorUsername(v.getAuthor() != null ? v.getAuthor().getUsername() : null);
        return res;
    }
}
