package com.sterma.back.dtos.maintenanceReport;

import com.sterma.back.models.Elevator;
import com.sterma.back.models.MaintenanceType;
import com.sterma.back.models.Technician;
import jakarta.persistence.*;
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
    private Long technicianId;

    @NotNull
    private Long elevatorId;
}
