package com.sterma.back.controller;

import com.sterma.back.models.Elevator;
import com.sterma.back.services.ElevatorService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/elevator")
public class ElevatorController {

    private final ElevatorService elevatorService;

    public ElevatorController(ElevatorService elevatorService) {
        this.elevatorService = elevatorService;
    }

    @GetMapping
    public Page<Elevator> getAll(Pageable pageable){
        return elevatorService.listAll(pageable);
    }

    @PostMapping
    public ResponseEntity<Elevator> create(@RequestBody Elevator elevator) {
        return ResponseEntity.ok(elevatorService.create(elevator));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Elevator> getById(@PathVariable Long id) {
        return elevatorService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Elevator> update(@PathVariable Long id, @RequestBody Elevator elevator) {
        try {
            Elevator updated = elevatorService.update(id, elevator);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            elevatorService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }




}
