package com.sterma.back.services;

import com.sterma.back.dtos.community.CreateCommunityRequest;
import com.sterma.back.models.*;
import com.sterma.back.repositories.CommunityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Service
public class CommunityService {

    private final CommunityRepository communityRepository;

    public CommunityService(CommunityRepository communityRepository) {
        this.communityRepository = communityRepository;
    }

    public Page<Community> listAll(Pageable pageable){
        return communityRepository.findAll(pageable);
    }

    public Optional<Community> getById(Long id){
        return communityRepository.findById(id);
    }


    public Community createCommunity(CreateCommunityRequest request) {
        Localization localization = new Localization(
                request.getCity(),
                request.getStreet(),
                request.getPostalCode()
        );

        CommunityLeaderInfo leaderInfo = new CommunityLeaderInfo(
                request.getCommunityLeaderName(),
                request.getCommunityLeaderTelephone(),
                request.getCommunityLeaderNote()
        );

        Community community = Community.builder()
                .name(request.getName())
                .description(request.getDescription())
                .CIF(request.getCIF())
                .localization(localization)
                .communityLeaderInfo(leaderInfo)
                .build();

        return communityRepository.save(community);
    }


}
