package com.example.demo.controller;

import com.example.demo.dto.DocumentRequestDto;
import com.example.demo.dto.DocumentResponseDto;
import com.example.demo.dto.VersionRequestDto;
import com.example.demo.dto.VersionResponseDto;
import com.example.demo.entity.Document;
import com.example.demo.entity.DocumentVersion;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.service.DocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {
    private final DocumentService documentService;

    @PostMapping
    public ResponseEntity<DocumentResponseDto> create(@RequestBody @Valid DocumentRequestDto dto, Principal principal) {
        Document doc = documentService.createDocument(dto, principal.getName());
        return ResponseEntity.ok(convertToDto(doc));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentResponseDto> getById(@PathVariable("id") Long id) {
        if (id == null || id <= 0) {
            throw new BusinessValidationException("Invalid document ID");
        }
        Document doc = documentService.getById(id);
        return ResponseEntity.ok(convertToDto(doc));
    }

    @PostMapping("/{id}/versions")
    public ResponseEntity<VersionResponseDto> createVersion(@PathVariable("id") Long id, @RequestBody @Valid VersionRequestDto dto, Principal principal) {
        if (id == null || id <= 0) {
            throw new BusinessValidationException("Invalid document ID");
        }
        DocumentVersion v = documentService.createVersion(id, dto, principal.getName());
        return ResponseEntity.ok(convertToVersionDto(v));
    }

    @GetMapping("/{id}/versions")
    public ResponseEntity<List<VersionResponseDto>> getVersions(@PathVariable("id") Long id) {
        if (id == null || id <= 0) {
            throw new BusinessValidationException("Invalid document ID");
        }
        List<VersionResponseDto> list = documentService.getVersions(id).stream()
                .map(this::convertToVersionDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<Void> submitForReview(@PathVariable("id") Long id, Principal principal) {
        if (id == null || id <= 0) {
            throw new BusinessValidationException("Invalid document ID");
        }
        documentService.submitForReview(id, principal.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/retract")
    public ResponseEntity<Void> retractSubmission(@PathVariable("id") Long id, Principal principal) {
        if (id == null || id <= 0) {
            throw new BusinessValidationException("Invalid document ID");
        }
        documentService.retractSubmission(id, principal.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/compare")
    public ResponseEntity<List<VersionResponseDto>> compareVersions(@PathVariable("id") Long id, @RequestParam("v1") int v1, @RequestParam("v2") int v2) {
        if (id == null || id <= 0) {
            throw new BusinessValidationException("Invalid document ID");
        }
        List<VersionResponseDto> list = documentService.compareVersions(id, v1, v2).stream()
                .map(this::convertToVersionDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    private DocumentResponseDto convertToDto(Document doc) {
        DocumentResponseDto res = new DocumentResponseDto();
        res.setId(doc.getId());
        res.setTitle(doc.getTitle());
        res.setWorkspaceId(doc.getWorkspace().getId());
        res.setCurrentStatus(doc.getCurrentStatus().name());
        res.setCreatedByUsername(doc.getCreatedBy().getUsername());
        return res;
    }

    private VersionResponseDto convertToVersionDto(DocumentVersion v) {
        VersionResponseDto res = new VersionResponseDto();
        res.setId(v.getId());
        res.setDocumentId(v.getDocument().getId());
        res.setVersionNumber(v.getVersionNumber());
        res.setContentDelta(v.getContentDelta());
        res.setCommitMessage(v.getCommitMessage());
        res.setVersionStatus(v.getVersionStatus().name());
        res.setAuthorUsername(v.getAuthor().getUsername());
        return res;
    }
}
