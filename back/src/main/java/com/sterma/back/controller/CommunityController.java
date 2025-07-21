package com.sterma.back.controller;


import com.sterma.back.models.Community;
import com.sterma.back.models.Elevator;
import com.sterma.back.repositories.CommunityRepository;
import com.sterma.back.repositories.ElevatorRepository;
import com.sterma.back.services.CommunityService;
import com.sterma.back.services.ElevatorService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/community")
public class CommunityController {

    private final CommunityService communityService;

    private final ElevatorService elevatorService;

    public CommunityController(CommunityService communityService, ElevatorService elevatorService) {
        this.communityService = communityService;
        this.elevatorService = elevatorService;
    }

    @GetMapping
    public List<Community> getAll(){
        return communityService.listAll();
    }

    @GetMapping("/{id}/elevator")
    public List<Elevator> getElevator(@PathVariable Long id){
        return elevatorService.listByElevatorId(id);
    }
}
