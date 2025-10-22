package com.sterma.back.controller;


import com.sterma.back.dtos.community.CreateCommunityRequest;
import com.sterma.back.dtos.community.UpdateCommunityRequest;
import com.sterma.back.models.Community;
import com.sterma.back.models.Elevator;
import com.sterma.back.repositories.CommunityRepository;
import com.sterma.back.repositories.ElevatorRepository;
import com.sterma.back.services.CommunityService;
import com.sterma.back.services.ElevatorService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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
    public Page<Community> getAll(@RequestParam(required = false) String name, Pageable pageable){
        return communityService.listAll(name, pageable);
    }

    @GetMapping("/{id}/elevator")
    public List<Elevator> getElevator(@PathVariable Long id){
        return elevatorService.listByElevatorId(id);
    }

    @PostMapping
    public ResponseEntity<Community> createCommunity(@RequestBody @Valid CreateCommunityRequest request) {
        Community community = communityService.createCommunity(request);
        return ResponseEntity.ok(community);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Community> updateCommunity(@PathVariable Long id,@RequestBody @Valid UpdateCommunityRequest request ){
        Community updateCommunity = communityService.updateCommunity(id, request);
        return ResponseEntity.ok(updateCommunity);
    }

}
