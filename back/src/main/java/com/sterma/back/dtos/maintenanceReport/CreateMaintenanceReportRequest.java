package com.sterma.back.dtos.maintenanceReport;

import com.sterma.back.models.MaintenanceType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateMaintenanceReportRequest {

    @NotNull
    private MaintenanceType maintenanceType;

    @NotNull
    private LocalDateTime startDate = LocalDateTime.now();

    private LocalDateTime endDate;

    private String commentary;

    @NotNull
    private Long elevatorId;
}
