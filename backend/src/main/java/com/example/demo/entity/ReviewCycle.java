package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "review_cycles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewCycle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "version_id", nullable = false, unique = true)
    private DocumentVersion version;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private SystemUser assignedReviewer;

    @Builder.Default
    @Column(length = 50, nullable = false)
    private String decision = "PENDING";

    @Column(name = "feedback_notes", columnDefinition = "TEXT")
    private String feedbackNotes;
}