package com.sterma.back.controller;

import com.sterma.back.dtos.elevator.CreateElevatorRequest;
import com.sterma.back.dtos.elevator.UpdateElevatorRequest;
import com.sterma.back.models.Elevator;
import com.sterma.back.services.ElevatorService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/elevator")
@Tag(name = "Elevator", description = "Gestión de ascensores")
public class ElevatorController {

    private final ElevatorService elevatorService;

    public ElevatorController(ElevatorService elevatorService) {
        this.elevatorService = elevatorService;
    }

    @Operation(summary = "Listar ascensores", description = "Obtiene ascensores filtrando por RAE o nombre de comunidad")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Listado obtenido correctamente",
                    content = @Content(schema = @Schema(implementation = Elevator.class))),
            @ApiResponse(responseCode = "401", description = "No autorizado (token JWT inválido o no proporcionado)", content = @Content)
    })
    @GetMapping
    public Page<Elevator> getAll(
            @Parameter(description = "Filtro por RAE")
            @RequestParam(required = false) String rae,
            @Parameter(description = "Filtro por nombre de comunidad")
            @RequestParam(required = false) String communityName,
            Pageable pageable) {
        return elevatorService.listAll(rae, communityName, pageable);
    }

    @Operation(summary = "Crear ascensor")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ascensor creado correctamente",
                    content = @Content(schema = @Schema(implementation = Elevator.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content),
            @ApiResponse(responseCode = "404", description = "Comunidad no encontrada", content = @Content),
            @ApiResponse(responseCode = "409", description = "Conflicto de estado", content = @Content),
            @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno", content = @Content)
    })
    @PostMapping
    public ResponseEntity<?> create(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos del ascensor",
                    required = true,
                    content = @Content(schema = @Schema(implementation = CreateElevatorRequest.class))
            )
            @RequestBody @Valid CreateElevatorRequest createElevatorRequest) {
        try {
            return ResponseEntity.ok(elevatorService.create(createElevatorRequest));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado: " + e.getMessage());
        }
    }

    @Operation(summary = "Obtener ascensor por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ascensor encontrado",
                    content = @Content(schema = @Schema(implementation = Elevator.class))),
            @ApiResponse(responseCode = "404", description = "Ascensor no encontrado", content = @Content),
            @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(
            @Parameter(description = "ID del ascensor", example = "1")
            @PathVariable Long id) {
        try {
            return elevatorService.getById(id)
                    .map(ResponseEntity::ok)
                    .orElseThrow(() -> new NoSuchElementException("Ascensor no encontrado con ID: " + id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @Operation(summary = "Actualizar ascensor")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ascensor actualizado",
                    content = @Content(schema = @Schema(implementation = Elevator.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content),
            @ApiResponse(responseCode = "404", description = "Ascensor no encontrado", content = @Content),
            @ApiResponse(responseCode = "409", description = "Conflicto", content = @Content),
            @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno", content = @Content)
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @Parameter(description = "ID del ascensor", example = "1")
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos a actualizar",
                    required = true,
                    content = @Content(schema = @Schema(implementation = UpdateElevatorRequest.class))
            )
            @RequestBody @Valid UpdateElevatorRequest updateRequest) {
        try {
            Elevator updated = elevatorService.update(id, updateRequest);
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado: " + e.getMessage());
        }
    }

    @Operation(summary = "Eliminar ascensor")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Ascensor eliminado"),
            @ApiResponse(responseCode = "404", description = "Ascensor no encontrado", content = @Content),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida", content = @Content),
            @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @Parameter(description = "ID del ascensor", example = "1")
            @PathVariable Long id) {
        try {
            elevatorService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado: " + e.getMessage());
        }
    }

    @Operation(summary = "Obtener lista de RAE", description = "Devuelve todos los códigos RAE, opcionalmente filtrados por comunidad")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Listado de RAE obtenido correctamente"),
            @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content)
    })
    @GetMapping("/rae")
    public ResponseEntity<List<String>> getRae(
            @Parameter(description = "ID de la comunidad")
            @RequestParam(required = false) Long communityId) {
        List<String> rae = elevatorService.getAllRae(communityId);
        return ResponseEntity.ok(rae);
    }
}