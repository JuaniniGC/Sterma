package com.sterma.back.dtos.maintenanceReport.nextMaintenance;

import com.sterma.back.models.MaintenanceType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class NextMaintenanceResponse {

    private MaintenanceType maintenanceType;
    private LocalDate nextDate;
    private NextMaintenanceStatus status;

}
