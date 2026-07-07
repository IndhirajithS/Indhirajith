package com.example.demo.repository;

import com.example.demo.entity.Workspace;
import com.example.demo.entity.WorkspaceMember;
import com.example.demo.entity.SystemUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, Long> {
    Optional<WorkspaceMember> findByWorkspaceAndUser(Workspace workspace, SystemUser user);
    List<WorkspaceMember> findByWorkspace(Workspace workspace);
    long countByWorkspace(Workspace workspace);
    boolean existsByWorkspaceAndUser(Workspace workspace, SystemUser user);
}