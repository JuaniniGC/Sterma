package com.sterma.back.controller;

import com.sterma.back.dtos.maintenanceReport.CreateMaintenanceReportRequest;
import com.sterma.back.dtos.maintenanceReport.nextMaintenance.NearMaintenanceTuple;
import com.sterma.back.dtos.maintenanceReport.nextMaintenance.NextMaintenanceResponse;
import com.sterma.back.models.MaintenanceRule;
import com.sterma.back.models.reports.MaintenanceReport;
import com.sterma.back.services.maintenance.MaintenanceService;
import jakarta.validation.Valid;
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
    public ResponseEntity<?> createMaintenanceReport(@Valid @RequestBody CreateMaintenanceReportRequest request) {
        try {
            MaintenanceReport createdReport = maintenanceService.createMaintenanceReport(request);
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

    @GetMapping("next/{elevatorId}")
    public ResponseEntity<?> getNextImportantMaintenance(@PathVariable Long elevatorId){
        try {
            NextMaintenanceResponse nextMaintenanceResponse = maintenanceService.getNextImportantMaintenance(elevatorId);
            return ResponseEntity.ok(nextMaintenanceResponse);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("next")
    public ResponseEntity<?> getAllSoonMaintenance(){
        try {
            List<NearMaintenanceTuple> nextMaintenances = maintenanceService.listSoonMaintenance();
            return ResponseEntity.ok(nextMaintenances);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("{elevatorId}")
    public ResponseEntity<?> listAllMaintenanceReportsForElevatorId(@PathVariable Long elevatorId){
        try {
            List<MaintenanceReport> response = maintenanceService.getMaintenanceReportsList(elevatorId);
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


}
