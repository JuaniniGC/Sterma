package com.sterma.back.repositories;

import com.sterma.back.models.reports.IncidentReport;
import com.sterma.back.models.reports.MaintenanceReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentReportRepository extends JpaRepository<IncidentReport, Long> {

    List<IncidentReport> findByElevator_Id(Long elevatorId);
}
