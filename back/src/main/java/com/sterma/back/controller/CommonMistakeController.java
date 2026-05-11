package com.sterma.back.controller;

import com.sterma.back.dtos.commonMistakes.CommonMistakeCreateRequest;
import com.sterma.back.models.CommonMistake;
import com.sterma.back.services.CommonMistakeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
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

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/mistake")
@Tag(name = "Common Mistakes", description = "Gestión de errores comunes")
public class CommonMistakeController {

    private CommonMistakeService commonMistakeService;

    public CommonMistakeController(CommonMistakeService commonMistakeService) {
        this.commonMistakeService = commonMistakeService;
    }

    @Operation(summary = "Crear error común", description = "Crea un nuevo error común en el sistema")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Error común creado correctamente",
                    content = @Content(schema = @Schema(implementation = CommonMistake.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content),
            @ApiResponse(responseCode = "401", description = "No autorizado (token JWT inválido o no proporcionado)", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno", content = @Content)
    })
    @PostMapping
    public ResponseEntity<?> createCommonMistake(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos del error común",
                    required = true,
                    content = @Content(schema = @Schema(implementation = CommonMistakeCreateRequest.class))
            )
            @RequestBody @Valid CommonMistakeCreateRequest request) {
        try {
            CommonMistake commonMistake = commonMistakeService.createCommonMistake(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(commonMistake);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado: " + e.getMessage());
        }
    }

    @Operation(summary = "Listar errores comunes", description = "Obtiene una lista paginada de errores comunes")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Listado obtenido correctamente",
                    content = @Content(schema = @Schema(implementation = CommonMistake.class))),
            @ApiResponse(responseCode = "401", description = "No autorizado (token JWT inválido o no proporcionado)", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno", content = @Content)
    })
    @GetMapping
    public ResponseEntity<Page<CommonMistake>> getCommonMistakes(Pageable pageable) {
        Page<CommonMistake> commonMistakes =
                commonMistakeService.getAllCommonMistakes(pageable);
        return ResponseEntity.ok(commonMistakes);
    }

    @Operation(summary = "Eliminar fallo comun")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Fallo comun eliminado"),
            @ApiResponse(responseCode = "404", description = "Fallo comun no encontrado", content = @Content),
            @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error interno", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @Parameter(description = "ID del ascensor", example = "1")
            @PathVariable Long id) {
        try {
            commonMistakeService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado: " + e.getMessage());
        }
    }
}