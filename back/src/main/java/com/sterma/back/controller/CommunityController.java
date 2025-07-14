package com.sterma.back.controller;


import com.sterma.back.models.Community;
import com.sterma.back.repositories.CommunityRepository;
import com.sterma.back.services.CommunityService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/community")
public class CommunityController {

    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping
    public List<Community> getAll(){
        return communityService.listAll();
    }
}
