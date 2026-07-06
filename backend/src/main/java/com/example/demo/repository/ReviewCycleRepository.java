package com.example.demo.repository;

import com.example.demo.entity.ReviewCycle;
import com.example.demo.entity.DocumentVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ReviewCycleRepository extends JpaRepository<ReviewCycle, Long> {
    Optional<ReviewCycle> findByVersion(DocumentVersion version);

    @Query("SELECT r FROM ReviewCycle r WHERE r.version.document.workspace.id = :workspaceId AND r.decision = 'PENDING'")
    List<ReviewCycle> findPendingCyclesByWorkspace(@Param("workspaceId") Long workspaceId);
}
