package com.sterma.back.repositories;

import com.sterma.back.models.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findByIncidentReportId(Long incidentReportId);
}
