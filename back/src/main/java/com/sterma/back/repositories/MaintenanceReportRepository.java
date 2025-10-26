package com.sterma.back.repositories;

import com.sterma.back.models.reports.MaintenanceReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaintenanceReportRepository extends JpaRepository<MaintenanceReport, Long> {
}