package com.example.demo.repository;

import com.example.demo.entity.Document;
import com.example.demo.entity.DocumentVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface DocumentVersionRepository extends JpaRepository<DocumentVersion, Long> {
    List<DocumentVersion> findByDocumentOrderByVersionNumberDesc(Document document);
    Optional<DocumentVersion> findTopByDocumentOrderByVersionNumberDesc(Document document);

    @Query("SELECT v FROM DocumentVersion v WHERE v.document.id = :docId AND (v.versionNumber = :v1 OR v.versionNumber = :v2)")
    List<DocumentVersion> findTwoVersions(@Param("docId") Long docId, @Param("v1") int v1, @Param("v2") int v2);
}