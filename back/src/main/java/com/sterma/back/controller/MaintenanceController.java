package com.sterma.back.controller;

import com.sterma.back.dtos.maintenanceReport.CreateMaintenanceReportRequest;
import com.sterma.back.models.MaintenanceRule;
import com.sterma.back.models.reports.MaintenanceReport;
import com.sterma.back.services.maintenance.MaintenanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/report/maintenance")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService){
        this.maintenanceService = maintenanceService;
    }

    @GetMapping("/rules/{maintenanceType}")
    public ResponseEntity<?> getRules(@PathVariable String maintenanceType) {
        try {
            List<MaintenanceRule> rules = maintenanceService.getMaintenanceReportRules(maintenanceType);
            return ResponseEntity.ok(rules);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping()
    public ResponseEntity<?> createMaintenanceReport(@RequestBody CreateMaintenanceReportRequest request) {
        try {
            MaintenanceReport createdReport = maintenanceService.createMaintenanceRule(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdReport);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno al crear el reporte de mantenimiento: " + e.getMessage());
        }
    }



}
