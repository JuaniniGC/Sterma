package com.sterma.back.dtos.incidentReport;

import com.sterma.back.models.reports.IncidentReport;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BasicIncidentReport{
    private Long id;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String commentary;

    public BasicIncidentReport(IncidentReport incidentReport){
        this.id = incidentReport.getId();
        this.startDate = incidentReport.getStartDate();
        this.endDate = incidentReport.getEndDate();
        this.commentary = incidentReport.getCommentary();
    }
}
