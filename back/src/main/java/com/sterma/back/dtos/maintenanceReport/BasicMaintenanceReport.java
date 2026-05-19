package com.sterma.back.dtos.maintenanceReport;

import com.sterma.back.models.MaintenanceType;
import com.sterma.back.models.reports.MaintenanceReport;
import lombok.Data;

import java.time.LocalDateTime;

@Data

public class BasicMaintenanceReport {
    private Long id;
    private MaintenanceType maintenanceType;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String commentary;

    public BasicMaintenanceReport(MaintenanceReport maintenanceReport){
        this.maintenanceType = maintenanceReport.getMaintenanceType();
        this.startDate = maintenanceReport.getStartDate();
        this.endDate = maintenanceReport.getEndDate();
        this.commentary = maintenanceReport.getCommentary();
    }
}
