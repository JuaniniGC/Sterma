package com.sterma.back.services.maintenance.strategy;

import com.sterma.back.dtos.maintenanceReport.CreateMaintenanceReportRequest;
import com.sterma.back.models.Elevator;
import com.sterma.back.models.MaintenanceRule;
import com.sterma.back.models.MaintenanceType;
import com.sterma.back.models.Technician;
import com.sterma.back.models.reports.MaintenanceReport;
import com.sterma.back.models.reports.Report;
import com.sterma.back.repositories.MaintenanceReportRepository;
import com.sterma.back.repositories.MaintenanceRuleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class BiannualMaintenanceService implements MaintenanceServiceStrategy {

    private final MaintenanceReportRepository maintenanceReportRepository;
    private final MaintenanceRuleRepository maintenanceRuleRepository;

    public BiannualMaintenanceService(MaintenanceReportRepository maintenanceReportRepository, MaintenanceRuleRepository maintenanceRuleRepository){
        this.maintenanceReportRepository = maintenanceReportRepository;
        this.maintenanceRuleRepository = maintenanceRuleRepository;
    }


    @Override
    @Transactional
    public MaintenanceReport createReport(CreateMaintenanceReportRequest request, Technician technician, Elevator elevator) {
        MaintenanceReport maintenanceReport = MaintenanceReport.builder()
                .maintenanceType(this.getMaintenanceType())
                .commentary(request.getCommentary())
                .technician(technician)
                .elevator(elevator)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();
        return maintenanceReportRepository.save(maintenanceReport);
    }

    @Override
    public List<MaintenanceRule> getRules() {
        return maintenanceRuleRepository.findMonthlyAndBiannualRules();
    }

    @Override
    public MaintenanceType getMaintenanceType() {
        return MaintenanceType.BIANNUAL;
    }

    @Override
    public LocalDate getNextMaintenanceDate(List<MaintenanceReport> reports, LocalDate installationDate){
        return reports.stream()
                .filter(r -> r.getMaintenanceType() == MaintenanceType.ANNUAL ||  r.getMaintenanceType() == MaintenanceType.BIANNUAL)
                .max(Comparator.comparing(Report::getStartDate))
                .map(MaintenanceReport::getNextMaintenanceDate)
                .map(LocalDateTime::toLocalDate)
                .orElse(installationDate.plusMonths(6));
    }
}
