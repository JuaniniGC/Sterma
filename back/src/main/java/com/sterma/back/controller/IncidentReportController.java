package com.sterma.back.controller;

import com.sterma.back.dtos.incidentReport.BasicIncidentReport;
import com.sterma.back.dtos.incidentReport.CreateIncidentReportRequest;
import com.sterma.back.dtos.incidentReport.UpdateEndDateRequest;
import com.sterma.back.models.reports.IncidentReport;
import com.sterma.back.services.IncidentReportService;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/report/incident")
@Tag(name = "Incident Report", description = "Gestión de informes de incidencias")
public class IncidentReportController {

    private final IncidentReportService incidentReportService;

    public IncidentReportController(IncidentReportService incidentReportService) {
        this.incidentReportService = incidentReportService;
    }

    @Operation(
            summary = "Crear informe de incidencia",
            description = "Crea un nuevo informe de incidencia para un ascensor",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Informe creado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content),
            @ApiResponse(responseCode = "401", description = "No autorizado (token JWT requerido o inválido)", content = @Content),
            @ApiResponse(responseCode = "404", description = "Ascensor o técnico no encontrado", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno", content = @Content)
    })
    @PostMapping
    public ResponseEntity<?> createIncidentReport(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos para crear el informe de incidencia",
                    required = true,
                    content = @Content(schema = @Schema(implementation = CreateIncidentReportRequest.class))
            )
            @Valid @RequestBody CreateIncidentReportRequest request) {
        try {
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

    @Operation(
            summary = "Listar incidencias por ascensor",
            description = "Obtiene todos los informes de incidencia de un ascensor",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Listado obtenido correctamente"),
            @ApiResponse(responseCode = "401", description = "No autorizado (token JWT requerido o inválido)", content = @Content),
            @ApiResponse(responseCode = "404", description = "Ascensor no encontrado", content = @Content)
    })
    @GetMapping("{elevatorId}")
    public ResponseEntity<?> listAllIncidentReportsForElevatorId(
            @Parameter(description = "ID del ascensor", example = "1")
            @PathVariable Long elevatorId){
        try {
            List<BasicIncidentReport> response =
                    incidentReportService.listAllIncidentReportForElevator(elevatorId);
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @Operation(
            summary = "Eliminar informe de incidencia",
            description = "Elimina un informe de incidencia por su ID",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Informe eliminado correctamente"),
            @ApiResponse(responseCode = "401", description = "No autorizado (token JWT requerido o inválido)", content = @Content),
            @ApiResponse(responseCode = "404", description = "Informe no encontrado", content = @Content)
    })
    @DeleteMapping("{reportId}")
    public ResponseEntity<?> deleteIncidentReport(
            @Parameter(description = "ID del informe", example = "1")
            @PathVariable Long reportId){
        try {
            incidentReportService.deleteIncidentReport(reportId);
            return ResponseEntity.ok("Se ha borrado correctamente el informe");
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @Operation(
            summary = "Cerrar informe de incidencia",
            description = "Actualiza la fecha de finalización de un informe de incidencia (solo si no está cerrado)",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Fecha de finalización actualizada correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o el informe ya está cerrado", content = @Content),
            @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
            @ApiResponse(responseCode = "404", description = "Informe no encontrado", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno", content = @Content)
    })
    @PatchMapping("/{reportId}/enddate")
    public ResponseEntity<?> updateEndDate(
            @PathVariable Long reportId,
            @RequestBody UpdateEndDateRequest request
    ) {
        try {
            incidentReportService.updateEndDate(reportId, request.getEndDate());
            return ResponseEntity.ok("");
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}