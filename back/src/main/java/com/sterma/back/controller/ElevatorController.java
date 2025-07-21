package com.sterma.back.controller;

import com.sterma.back.dtos.auth.elevator.CreateElevatorRequest;
import com.sterma.back.models.Elevator;
import com.sterma.back.services.ElevatorService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/elevator")
public class ElevatorController {

    private final ElevatorService elevatorService;

    public ElevatorController(ElevatorService elevatorService) {
        this.elevatorService = elevatorService;
    }

    @GetMapping
    public Page<Elevator> getAll(Pageable pageable) {
        return elevatorService.listAll(pageable);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateElevatorRequest createElevatorRequest) {
        try {
            return ResponseEntity.ok(elevatorService.create(createElevatorRequest));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return elevatorService.getById(id)
                    .map(ResponseEntity::ok)
                    .orElseThrow(() -> new NoSuchElementException("Ascensor no encontrado con ID: " + id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody CreateElevatorRequest updateRequest) {
        try {
            Elevator updated = elevatorService.update(id, updateRequest);
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            elevatorService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado: " + e.getMessage());
        }
    }
}