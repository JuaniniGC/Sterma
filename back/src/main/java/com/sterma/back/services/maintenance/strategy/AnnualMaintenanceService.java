package com.sterma.back.services.maintenance.strategy;

import com.sterma.back.dtos.maintenanceReport.CreateMaintenanceReportRequest;
import com.sterma.back.models.Elevator;
import com.sterma.back.models.MaintenanceRule;
import com.sterma.back.models.MaintenanceType;
import com.sterma.back.models.Technician;
import com.sterma.back.models.reports.MaintenanceReport;
import com.sterma.back.repositories.MaintenanceReportRepository;
import com.sterma.back.repositories.MaintenanceRuleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnnualMaintenanceService implements MaintenanceServiceStrategy {

    private final MaintenanceReportRepository maintenanceReportRepository;
    private final MaintenanceRuleRepository maintenanceRuleRepository;

    public AnnualMaintenanceService(MaintenanceReportRepository maintenanceReportRepository, MaintenanceRuleRepository maintenanceRuleRepository){
        this.maintenanceReportRepository = maintenanceReportRepository;
        this.maintenanceRuleRepository = maintenanceRuleRepository;
    }


    @Override
    public MaintenanceReport createReport(CreateMaintenanceReportRequest request, Technician technician, Elevator elevator) {
        return null;
    }

    @Override
    public List<MaintenanceRule> getRules() {
        return maintenanceRuleRepository.findAllByOrderByOrderNum();
    }

    @Override
    public MaintenanceType getType() {
        return MaintenanceType.ANNUAL;
    }
}
