package com.sterma.back.dtos.maintenanceReport;

import com.sterma.back.models.MaintenanceRule;
import com.sterma.back.models.reports.MaintenanceReport;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class MaintenanceReportDetail extends BasicMaintenanceReport {
    private List<MaintenanceRule> maintenanceRules;

    public MaintenanceReportDetail(MaintenanceReport maintenanceReport, List<MaintenanceRule> maintenanceRules) {
        super(maintenanceReport);
        this.maintenanceRules = maintenanceRules;
    }
}
