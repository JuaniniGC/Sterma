package com.sterma.back.controller;

import com.sterma.back.models.Image;
import com.sterma.back.services.ImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/report/incident/{incidentId}/image")
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("")
    public ResponseEntity<Image> uploadImage(
            @PathVariable Long incidentId,
            @RequestParam("file") MultipartFile file) {
        try {
            Image image = imageService.updateImage(incidentId, file);
            return ResponseEntity.ok(image);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("")
    public ResponseEntity<?> getImagesFromIncidentReport(
            @PathVariable Long incidentId) {
        try {
            List<String> image = imageService.getImagesByIncidentReport(incidentId);
            return ResponseEntity.ok(image);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}