package com.example.demo.event;

import com.example.demo.entity.ReviewDecision;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class ReviewDecisionEvent extends ApplicationEvent {
    private final Long documentId;
    private final Long versionId;
    private final Long reviewCycleId;
    private final ReviewDecision decision;

    public ReviewDecisionEvent(Object source, Long documentId, Long versionId, Long reviewCycleId, ReviewDecision decision) {
        super(source);
        this.documentId = documentId;
        this.versionId = versionId;
        this.reviewCycleId = reviewCycleId;
        this.decision = decision;
    }
}
