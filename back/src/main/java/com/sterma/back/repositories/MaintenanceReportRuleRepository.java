package com.sterma.back.repositories;

import com.sterma.back.models.reports.MaintenanceReportRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceReportRuleRepository extends JpaRepository<MaintenanceReportRule, Long> {

    List<MaintenanceReportRule> findByMaintenanceReport_IdOrderByMaintenanceRule_OrderNumAsc(Long maintenanceReportId);

    long countByMaintenanceRule_Id(Long maintenanceRuleId);

    void deleteByMaintenanceReport_Id(Long maintenanceReportId);
}
