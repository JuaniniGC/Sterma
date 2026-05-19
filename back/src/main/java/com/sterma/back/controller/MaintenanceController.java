package com.sterma.back.controller;

import com.sterma.back.dtos.maintenanceReport.BasicMaintenanceReport;
import com.sterma.back.dtos.maintenanceReport.CreateMaintenanceReportRequest;
import com.sterma.back.dtos.maintenanceReport.nextMaintenance.NearMaintenanceTuple;
import com.sterma.back.dtos.maintenanceReport.nextMaintenance.NextMaintenanceResponse;
import com.sterma.back.dtos.maintenanceRule.CreateMaintenanceRuleRequest;
import com.sterma.back.models.MaintenanceRule;
import com.sterma.back.models.reports.MaintenanceReport;
import com.sterma.back.services.maintenance.MaintenanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/report/maintenance")
@Tag(name = "Maintenance", description = "Gestión de mantenimientos")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService){
        this.maintenanceService = maintenanceService;
    }

    @Operation(
            summary = "Obtener reglas de mantenimiento",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Reglas obtenidas correctamente"),
            @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
            @ApiResponse(responseCode = "404", description = "Tipo no encontrado", content = @Content)
    })
    @GetMapping("/rules/{maintenanceType}")
    public ResponseEntity<?> getRules(
            @Parameter(description = "Tipo de mantenimiento", example = "MONTHLY")
            @PathVariable String maintenanceType) {
        try {
            return ResponseEntity.ok(maintenanceService.getMaintenanceReportRules(maintenanceType));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @Operation(
            summary = "Crear reporte de mantenimiento",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Reporte creado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content),
            @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
            @ApiResponse(responseCode = "404", description = "Recurso no encontrado", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno", content = @Content)
    })
    @PostMapping
    public ResponseEntity<?> createMaintenanceReport(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos del reporte de mantenimiento",
                    required = true,
                    content = @Content(schema = @Schema(implementation = CreateMaintenanceReportRequest.class))
            )
            @Valid @RequestBody CreateMaintenanceReportRequest request) {
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

    @Operation(
            summary = "Obtener próximo mantenimiento de un ascensor",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Información obtenida correctamente"),
            @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
            @ApiResponse(responseCode = "404", description = "Ascensor no encontrado", content = @Content)
    })
    @GetMapping("next/{elevatorId}")
    public ResponseEntity<?> getNextImportantMaintenance(
            @Parameter(description = "ID del ascensor", example = "1")
            @PathVariable Long elevatorId){
        try {
            return ResponseEntity.ok(maintenanceService.getNextImportantMaintenance(elevatorId));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @Operation(
            summary = "Listar próximos mantenimientos",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Listado obtenido correctamente"),
            @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content)
    })
    @GetMapping("next")
    public ResponseEntity<?> getAllSoonMaintenance(){
        return ResponseEntity.ok(maintenanceService.listSoonMaintenance());
    }

    @Operation(
            summary = "Listar mantenimientos por ascensor",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Listado obtenido correctamente"),
            @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
            @ApiResponse(responseCode = "404", description = "Ascensor no encontrado", content = @Content)
    })
    @GetMapping("{elevatorId}")
    public ResponseEntity<?> listAllMaintenanceReportsForElevatorId(
            @Parameter(description = "ID del ascensor", example = "1")
            @PathVariable Long elevatorId){
        try {
            return ResponseEntity.ok(maintenanceService.getBasicMaintenanceReportsList(elevatorId));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @Operation(
            summary = "Crear regla de mantenimiento",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Regla creada correctamente"),
            @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno", content = @Content)
    })
    @PostMapping("rules")
    public ResponseEntity<?> createMaintenanceRule(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos de la regla",
                    required = true,
                    content = @Content(schema = @Schema(implementation = CreateMaintenanceRuleRequest.class))
            )
            @Valid @RequestBody CreateMaintenanceRuleRequest request){
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(maintenanceService.createMaintenanceRule(request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno al crear la regla: " + e.getMessage());
        }
    }

    @Operation(
            summary = "Eliminar reporte de mantenimiento",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Reporte eliminado correctamente"),
            @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
            @ApiResponse(responseCode = "404", description = "Reporte no encontrado", content = @Content)
    })
    @DeleteMapping("{reportId}")
    public ResponseEntity<?> deleteMaintenanceReport(
            @Parameter(description = "ID del reporte", example = "1")
            @PathVariable Long reportId){
        try {
            maintenanceService.deleteMaintenanceReport(reportId);
            return ResponseEntity.ok("Se ha borrado correctamente el informe");
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @Operation(
            summary = "Eliminar regla de mantenimiento",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Regla eliminada correctamente"),
            @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
            @ApiResponse(responseCode = "404", description = "Regla no encontrada", content = @Content)
    })
    @DeleteMapping("rules/{reportId}")
    public ResponseEntity<?> deleteMaintenanceRule(
            @Parameter(description = "ID de la regla", example = "1")
            @PathVariable Long reportId){
        try {
            maintenanceService.deleteMaintenanceRule(reportId);
            return ResponseEntity.ok("Se ha borrado correctamente la regla");
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}