package com.sterma.back.services;

import com.sterma.back.dtos.community.CreateCommunityRequest;
import com.sterma.back.dtos.community.UpdateCommunityRequest;
import com.sterma.back.models.*;
import com.sterma.back.repositories.CommunityRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Service
public class CommunityService {

    private final CommunityRepository communityRepository;

    public CommunityService(CommunityRepository communityRepository) {
        this.communityRepository = communityRepository;
    }

    @Transactional(readOnly = true)
    public Page<Community> listAll(String name, Pageable pageable) {
        if(name != null && !name.isBlank()){
            return communityRepository.findByNameContainingIgnoreCase(name, pageable);
        }
        return communityRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Optional<Community> getById(Long id){
        return communityRepository.findById(id);
    }

    @Transactional
    public Community createCommunity(CreateCommunityRequest request) {
        Localization localization = Localization.builder()
                .city(request.getCity())
                .postalCode(request.getPostalCode())
                .street(request.getStreet())
                .build();

        CommunityLeaderInfo leaderInfo = CommunityLeaderInfo.builder()
                .communityLeaderName(request.getCommunityLeaderName())
                .communityLeaderTelephone(request.getCommunityLeaderTelephone())
                .communityLeaderNote(request.getCommunityLeaderNote())
                .build();

        Community community = Community.builder()
                .name(request.getName())
                .description(request.getDescription())
                .CIF(request.getCIF())
                .localization(localization)
                .communityLeaderInfo(leaderInfo)
                .build();

        return communityRepository.save(community);
    }

    @Transactional
    public Community updateCommunity(Long id, UpdateCommunityRequest request) {
        Community community = getExistingCommunity(id);

        community.getLocalization().setCity(request.getCity());
        community.getLocalization().setPostalCode(request.getPostalCode());
        community.getLocalization().setStreet(request.getStreet());

        community.getCommunityLeaderInfo().setCommunityLeaderName(request.getCommunityLeaderName());
        community.getCommunityLeaderInfo().setCommunityLeaderTelephone(request.getCommunityLeaderTelephone());
        community.getCommunityLeaderInfo().setCommunityLeaderNote(request.getCommunityLeaderNote());

        community.setName(request.getName());
        community.setDescription(request.getDescription());
        community.setCIF(request.getCIF());

        return communityRepository.save(community);
    }

    private Community getExistingCommunity(Long id) {
        return communityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Comunidad no encontrada con ID: " + id));
    }




}
