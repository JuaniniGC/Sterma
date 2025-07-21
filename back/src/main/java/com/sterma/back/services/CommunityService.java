package com.sterma.back.services;

import com.sterma.back.models.Community;
import com.sterma.back.models.Technician;
import com.sterma.back.repositories.CommunityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommunityService {

    private final CommunityRepository communityRepository;

    public CommunityService(CommunityRepository communityRepository) {
        this.communityRepository = communityRepository;
    }

    public Page<Community> listAll(Pageable pageable){
        return communityRepository.findAll(pageable);
    }


}
