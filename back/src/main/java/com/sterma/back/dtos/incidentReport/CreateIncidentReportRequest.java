package com.sterma.back.dtos.incidentReport;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateIncidentReportRequest {
    @NotNull
    private LocalDateTime startDate = LocalDateTime.now();

    private LocalDateTime endDate;

    private String commentary;

    @NotNull
    private Long elevatorId;
}
