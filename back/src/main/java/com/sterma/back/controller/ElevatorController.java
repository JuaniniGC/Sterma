package com.sterma.back.controller;

import com.sterma.back.models.Elevator;
import com.sterma.back.services.ElevatorService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/elevator")
public class ElevatorController {

    private final ElevatorService elevatorService;

    public ElevatorController(ElevatorService elevatorService) {
        this.elevatorService = elevatorService;
    }

    @GetMapping
    public List<Elevator> getAll(){
        return elevatorService.listAll();
    }


}
