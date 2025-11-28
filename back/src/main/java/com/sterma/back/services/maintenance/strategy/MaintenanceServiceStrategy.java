package com.sterma.back.services.maintenance.strategy;

import com.sterma.back.dtos.maintenanceReport.CreateMaintenanceReportRequest;
import com.sterma.back.models.Elevator;
import com.sterma.back.models.MaintenanceRule;
import com.sterma.back.models.MaintenanceType;
import com.sterma.back.models.Technician;
import com.sterma.back.models.reports.MaintenanceReport;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MaintenanceServiceStrategy {
    MaintenanceReport createReport(CreateMaintenanceReportRequest request, Technician technician, Elevator elevator);
    List<MaintenanceRule> getRules();
    MaintenanceType getMaintenanceType();
    LocalDate getNextMaintenanceDate(List<MaintenanceReport> reports);

}