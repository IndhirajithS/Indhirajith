package com.example.demo.repository;

import com.example.demo.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
    @Query("SELECT w FROM Workspace w WHERE w.status = 'ACTIVE'")
    List<Workspace> findAllActive();
}