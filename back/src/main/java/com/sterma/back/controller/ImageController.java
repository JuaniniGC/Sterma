package com.sterma.back.controller;

import com.sterma.back.services.ImageService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/report/incident/{incidentId}/image")
@Tag(name = "Image", description = "Gestión de imágenes de incidencias")
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @Operation(summary = "Subir imagen a incidencia", description = "Sube una imagen asociada a una incidencia")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Imagen subida correctamente"),
            @ApiResponse(responseCode = "400", description = "Archivo inválido", content = @Content),
            @ApiResponse(responseCode = "404", description = "Incidencia no encontrada", content = @Content),
            @ApiResponse(responseCode = "409", description = "Conflicto al subir la imagen", content = @Content),
            @ApiResponse(responseCode = "401", description = "No autorizado (token JWT inválido o no proporcionado)", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error al procesar la imagen", content = @Content)
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(
            @Parameter(description = "ID de la incidencia", example = "1")
            @PathVariable Long incidentId,

            @Parameter(
                    description = "Archivo de imagen a subir",
                    required = true,
                    content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                            schema = @Schema(type = "string", format = "binary"))
            )
            @RequestParam("file") MultipartFile file) {

        try {
            return ResponseEntity.ok(imageService.updateImage(incidentId, file));

        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar la imagen: " + e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado: " + e.getMessage());
        }
    }

    @Operation(summary = "Obtener imágenes de una incidencia", description = "Devuelve las imágenes asociadas a una incidencia")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Imágenes obtenidas correctamente"),
            @ApiResponse(responseCode = "400", description = "Solicitud inválida", content = @Content),
            @ApiResponse(responseCode = "404", description = "Incidencia no encontrada", content = @Content),
            @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
            @ApiResponse(responseCode = "500", description = "Error al obtener las imágenes", content = @Content)
    })
    @GetMapping
    public ResponseEntity<?> getImagesFromIncidentReport(
            @Parameter(description = "ID de la incidencia", example = "1")
            @PathVariable Long incidentId) {

        try {
            return ResponseEntity.ok(imageService.getImagesByIncidentReport(incidentId));

        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener las imágenes: " + e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado: " + e.getMessage());
        }
    }
}