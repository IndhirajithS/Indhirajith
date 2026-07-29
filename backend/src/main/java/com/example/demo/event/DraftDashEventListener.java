package com.example.demo.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@Slf4j
@RequiredArgsConstructor
public class DraftDashEventListener {

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onVersionSubmitted(VersionSubmittedEvent event) {
        log.info("Version {} of document {} submitted for review (reviewCycle {})",
                event.getVersionId(), event.getDocumentId(), event.getReviewCycleId());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onReviewDecided(ReviewDecisionEvent event) {
        log.info("Review cycle {} for document {} version {} decided: {}",
                event.getReviewCycleId(), event.getDocumentId(), event.getVersionId(), event.getDecision());
    }
}
