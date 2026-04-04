package com.sterma.back.controller;

import com.sterma.back.dtos.community.CreateCommunityRequest;
import com.sterma.back.dtos.community.UpdateCommunityRequest;
import com.sterma.back.models.Community;
import com.sterma.back.models.Elevator;
import com.sterma.back.services.CommunityService;
import com.sterma.back.services.ElevatorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/community")
@Tag(name = "Community", description = "Gestión de comunidades")
public class CommunityController {

    private final CommunityService communityService;
    private final ElevatorService elevatorService;

    public CommunityController(CommunityService communityService, ElevatorService elevatorService) {
        this.communityService = communityService;
        this.elevatorService = elevatorService;
    }

    @Operation(summary = "Listar comunidades", description = "Obtiene todas las comunidades con opción de filtrar por nombre")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Listado obtenido correctamente"),
            @ApiResponse(responseCode = "401", description = "No autorizado (token JWT inválido o no proporcionado)", content = @Content)
    })
    @GetMapping
    public Page<Community> getAll(
            @Parameter(description = "Filtro por nombre de comunidad")
            @RequestParam(required = false) String name,
            Pageable pageable){
        return communityService.listAll(name, pageable);
    }

    @Operation(summary = "Obtener ascensores de una comunidad")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ascensores obtenidos correctamente"),
            @ApiResponse(responseCode = "401", description = "No autorizado (token JWT inválido o no proporcionado)", content = @Content),
            @ApiResponse(responseCode = "404", description = "Comunidad no encontrada", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno", content = @Content)
    })
    @GetMapping("/{id}/elevator")
    public ResponseEntity<?> getElevator(
            @Parameter(description = "ID de la comunidad", example = "1")
            @PathVariable Long id){
        try {
            List<Elevator> elevators = elevatorService.listByCommunityId(id);
            return ResponseEntity.ok(elevators);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado: " + e.getMessage());
        }
    }

    @Operation(summary = "Crear una comunidad")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Comunidad creada correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content),
            @ApiResponse(responseCode = "401", description = "No autorizado (token JWT inválido o no proporcionado)", content = @Content),
            @ApiResponse(responseCode = "404", description = "Recurso relacionado no encontrado", content = @Content),
            @ApiResponse(responseCode = "409", description = "Conflicto de estado", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno", content = @Content)
    })
    @PostMapping
    public ResponseEntity<?> createCommunity(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos para crear la comunidad",
                    required = true,
                    content = @Content(schema = @Schema(implementation = CreateCommunityRequest.class))
            )
            @RequestBody @Valid CreateCommunityRequest request) {
        try {
            Community community = communityService.createCommunity(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(community);
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

    @Operation(summary = "Actualizar una comunidad")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Comunidad actualizada"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content),
            @ApiResponse(responseCode = "401", description = "No autorizado (token JWT inválido o no proporcionado)", content = @Content),
            @ApiResponse(responseCode = "404", description = "Comunidad no encontrada", content = @Content),
            @ApiResponse(responseCode = "409", description = "Conflicto", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno", content = @Content)
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCommunity(
            @Parameter(description = "ID de la comunidad", example = "1")
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos a actualizar",
                    required = true,
                    content = @Content(schema = @Schema(implementation = UpdateCommunityRequest.class))
            )
            @RequestBody @Valid UpdateCommunityRequest request) {
        try {
            Community updateCommunity = communityService.updateCommunity(id, request);
            return ResponseEntity.ok(updateCommunity);
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

    @Operation(summary = "Obtener comunidad por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Comunidad encontrada"),
            @ApiResponse(responseCode = "401", description = "No autorizado (token JWT inválido o no proporcionado)", content = @Content),
            @ApiResponse(responseCode = "404", description = "Comunidad no encontrada", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(
            @Parameter(description = "ID de la comunidad", example = "1")
            @PathVariable Long id) {
        try {
            return communityService.getById(id)
                    .map(ResponseEntity::ok)
                    .orElseThrow(() -> new NoSuchElementException("Comunidad no encontrada con ID: " + id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado: " + e.getMessage());
        }
    }

    @Operation(summary = "Eliminar comunidad")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Comunidad eliminada"),
            @ApiResponse(responseCode = "401", description = "No autorizado (token JWT inválido o no proporcionado)", content = @Content),
            @ApiResponse(responseCode = "404", description = "Comunidad no encontrada", content = @Content),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @Parameter(description = "ID de la comunidad", example = "1")
            @PathVariable Long id) {
        try {
            communityService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado: " + e.getMessage());
        }
    }
}