package com.example.demo.service;

import com.example.demo.dto.ReviewDecisionDto;
import com.example.demo.entity.*;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.DocumentRepository;
import com.example.demo.repository.DocumentVersionRepository;
import com.example.demo.repository.ReviewCycleRepository;
import com.example.demo.repository.SystemUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewCycleRepository reviewCycleRepository;
    private final DocumentVersionRepository versionRepository;
    private final DocumentRepository documentRepository;
    private final SystemUserRepository userRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public void submitDecision(Long cycleId, ReviewDecisionDto dto, String reviewerUsername) {
        SystemUser reviewer = userRepository.findByUsername(reviewerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer not found"));
        ReviewCycle cycle = reviewCycleRepository.findById(cycleId)
                .orElseThrow(() -> new ResourceNotFoundException("Review cycle not found"));

        if (!"PENDING".equals(cycle.getDecision())) {
            throw new BusinessValidationException("Review cycle has already been completed");
        }

        String decision = dto.getDecision().toUpperCase();
        if (!"APPROVED".equals(decision) && !"REJECTED".equals(decision)) {
            throw new BusinessValidationException("Invalid review decision. Must be APPROVED or REJECTED");
        }

        cycle.setDecision(decision);
        cycle.setFeedbackNotes(dto.getFeedbackNotes());
        reviewCycleRepository.save(cycle);

        DocumentVersion version = cycle.getVersion();
        Document document = version.getDocument();

        if ("APPROVED".equals(decision)) {
            version.setVersionStatus(VersionStatus.APPROVED);
            document.setCurrentStatus(DocumentStatus.APPROVED);
        } else {
            version.setVersionStatus(VersionStatus.REJECTED);
            document.setCurrentStatus(DocumentStatus.REJECTED);
        }

        versionRepository.save(version);
        documentRepository.save(document);

        auditLogService.log(reviewer, AuditActionType.REVIEW_DECIDED, "ReviewCycle", cycleId, "Decision logged: " + decision);
    }
}