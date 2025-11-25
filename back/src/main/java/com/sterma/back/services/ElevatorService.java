package com.sterma.back.services;

import com.sterma.back.dtos.elevator.CreateElevatorRequest;
import com.sterma.back.dtos.elevator.UpdateElevatorRequest;
import com.sterma.back.models.Elevator;
import com.sterma.back.repositories.CommunityRepository;
import com.sterma.back.repositories.ElevatorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class ElevatorService {

    private final ElevatorRepository elevatorRepository;
    private final CommunityRepository communityRepository;

    public ElevatorService(ElevatorRepository elevatorRepository, CommunityRepository communityRepository) {
        this.elevatorRepository = elevatorRepository;
        this.communityRepository = communityRepository;
    }

    @Transactional(readOnly = true)
    public Page<Elevator> listAll(String rae, String communityName, Pageable pageable) {
        String nameFilter = (rae != null && !rae.isBlank()) ? rae : null;
        String communityFilter = (communityName != null && !communityName.isBlank()) ? communityName : null;

        return elevatorRepository.findByFilters(nameFilter, communityFilter, pageable);
    }

    @Transactional(readOnly = true)
    public List<Elevator> listByCommunityId(Long communityId) {
        return elevatorRepository.findByCommunityId(communityId);
    }

    @Transactional(readOnly = true)
    public Optional<Elevator> getById(Long id) {
        return elevatorRepository.findById(id);
    }

    @Transactional
    public Elevator create(CreateElevatorRequest createElevatorRequest) {
        checkCommunityExists(createElevatorRequest.getCommunityId());
        checkRaeNotUsed(createElevatorRequest.getRae());

        Elevator elevator = Elevator.builder()
                .rae(createElevatorRequest.getRae())
                .instalationYear(createElevatorRequest.getInstalationYear())
                .community(communityRepository.getById(createElevatorRequest.getCommunityId()))
                .build();
        return elevatorRepository.save(elevator);
    }

    @Transactional
    public Elevator update(Long id, UpdateElevatorRequest updateRequest) {
        Elevator existing = getExistingElevator(id);
        checkCommunityExists(updateRequest.getCommunityId());

        if (!existing.getRae().equals(updateRequest.getRae())) {
            checkRaeNotUsed(updateRequest.getRae());
        }

        existing.setRae(updateRequest.getRae());
        existing.setInstalationYear(updateRequest.getInstalationYear());
        existing.setCommunity(communityRepository.getById(updateRequest.getCommunityId()));
        return elevatorRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        checkElevatorExists(id);
        elevatorRepository.deleteById(id);
    }

    private void checkCommunityExists(Long communityId) {
        if (communityId == null) {
            throw new IllegalArgumentException("El ID de comunidad no puede ser nulo");
        }
        if (!communityRepository.existsById(communityId)) {
            throw new NoSuchElementException("Comunidad no encontrada con ID: " + communityId);
        }
    }

    private void checkRaeNotUsed(String rae) {
        if (elevatorRepository.existsByRae(rae)) {
            throw new IllegalStateException("El RAE ya está en uso: " + rae);
        }
    }

    private void checkElevatorExists(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID de ascensor no puede ser nulo");
        }
        if (!elevatorRepository.existsById(id)) {
            throw new NoSuchElementException("Ascensor no encontrado con ID: " + id);
        }
    }

    private Elevator getExistingElevator(Long id) {
        return elevatorRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Ascensor no encontrado con ID: " + id));
    }


}