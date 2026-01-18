package com.sterma.back.controller;

import com.sterma.back.dtos.incidentReport.CreateIncidentReportRequest;
import com.sterma.back.models.reports.IncidentReport;
import com.sterma.back.models.reports.MaintenanceReport;
import com.sterma.back.services.IncidentReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/report/incident")
public class IncidentReportController {

    private final IncidentReportService incidentReportService;

    public IncidentReportController(IncidentReportService incidentReportService) {
        this.incidentReportService = incidentReportService;
    }

    @PostMapping
    public ResponseEntity<?> createIncidentReport(@Valid @RequestBody CreateIncidentReportRequest request) {
        try {;
            IncidentReport createdReport = incidentReportService.createIncidentReport(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdReport);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno al crear el reporte de incidencia: " + e.getMessage());
        }
    }

    @GetMapping("{elevatorId}")
    public ResponseEntity<?> listAllIncidentReportsForElevatorId(@PathVariable Long elevatorId){
        try {
            List<IncidentReport> response = incidentReportService.listAllIncidentReportForElevator(elevatorId);
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("{reportId}")
    public ResponseEntity<?> deleteMaintenanceReport(@PathVariable Long reportId){
        try {
            incidentReportService.deleteMaintenanceReport(reportId);
            return ResponseEntity.ok("Se ha borrado correctamente el informe");
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}

