package com.example.demo.controller;

import com.example.demo.dto.VersionCompareDto;
import com.example.demo.dto.VersionRequestDto;
import com.example.demo.dto.VersionResponseDto;
import com.example.demo.service.VersionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/versions")
@RequiredArgsConstructor
public class VersionController {

    private final VersionService versionService;

    @PostMapping
    @PreAuthorize("hasRole('CONTENT_CREATOR')")
    public ResponseEntity<VersionResponseDto> create(@Valid @RequestBody VersionRequestDto dto,
                                                      Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(versionService.saveDraftVersion(dto, authentication.getName()));
    }

    @GetMapping("/document/{docId}")
    public ResponseEntity<List<VersionResponseDto>> getHistory(@PathVariable Long docId) {
        return ResponseEntity.ok(versionService.getVersionHistory(docId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VersionResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(versionService.getVersionById(id));
    }

    @GetMapping("/compare")
    public ResponseEntity<VersionCompareDto> compare(@RequestParam Long docId,
                                                      @RequestParam int v1,
                                                      @RequestParam int v2) {
        return ResponseEntity.ok(versionService.compareVersions(docId, v1, v2));
    }
}
