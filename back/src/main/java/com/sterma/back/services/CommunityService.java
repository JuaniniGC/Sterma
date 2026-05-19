package com.sterma.back.services;

import com.sterma.back.dtos.community.CreateCommunityRequest;
import com.sterma.back.dtos.community.UpdateCommunityRequest;
import com.sterma.back.dtos.community.list.ListCommunityResponse;
import com.sterma.back.models.*;
import com.sterma.back.repositories.CommunityRepository;
import com.sterma.back.repositories.ElevatorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final ElevatorRepository elevatorRepository;
    private final ElevatorService elevatorService;

    public CommunityService(CommunityRepository communityRepository, ElevatorRepository elevatorRepository, ElevatorService elevatorService) {
        this.communityRepository = communityRepository;
        this.elevatorRepository = elevatorRepository;
        this.elevatorService = elevatorService;
    }

    @Transactional(readOnly = true)
    public Page<Community> listAll(String name, Pageable pageable) {
        if(name != null && !name.isBlank()){
            return communityRepository.findByNameContainingIgnoreCase(name, pageable);
        }
        return communityRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Page<ListCommunityResponse> listAllWithElevators(String name, Pageable pageable, ElevatorService elevatorService) {
        Page<Community> communities = listAll(name, pageable);

        return communities.map(community -> {
            List<Elevator> elevators = elevatorRepository.findByCommunityId(community.getId());
            return ListCommunityResponse.from(community, elevators);
        });
    }

    @Transactional(readOnly = true)
    public Optional<Community> getById(Long id){
        return communityRepository.findById(id);
    }

    @Transactional
    public Community createCommunity(CreateCommunityRequest request) {
        validateCIFUniqueness(request.getCIF(), null);

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
        checkCommunityExists(id);
        Community community = getExistingCommunity(id);

        validateCIFUniqueness(request.getCIF(), id);

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

    @Transactional
    public void delete(Long id) {
        checkCommunityExists(id);
        elevatorService.deleteAllElevatorByCommunityId(id);
        communityRepository.deleteById(id);
    }

    private void validateCIFUniqueness(String cif, Long currentCommunityId) {
        boolean cifExists;
        if (currentCommunityId != null) {
            cifExists = communityRepository.existsByCIFAndIdNot(cif, currentCommunityId);
        } else {
            cifExists = communityRepository.existsByCIF(cif);
        }

        if (cifExists) {
            throw new IllegalArgumentException("Ya existe una comunidad con el CIF: " + cif);
        }
    }

    private Community getExistingCommunity(Long id) {
        return communityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Comunidad no encontrada con ID: " + id));
    }

    private void checkCommunityExists(Long communityId) {
        if (communityId == null) {
            throw new IllegalArgumentException("El ID de comunidad no puede ser nulo");
        }
        if (!communityRepository.existsById(communityId)) {
            throw new NoSuchElementException("Comunidad no encontrada con ID: " + communityId);
        }
    }
}