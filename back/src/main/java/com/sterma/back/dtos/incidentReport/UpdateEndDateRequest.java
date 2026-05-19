package com.sterma.back.dtos.incidentReport;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UpdateEndDateRequest {
    private LocalDateTime endDate;

}