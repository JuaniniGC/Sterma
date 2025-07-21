package com.sterma.back.services;

import com.sterma.back.models.Elevator;
import com.sterma.back.repositories.ElevatorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ElevatorService {

    private final ElevatorRepository elevatorRepository;

    public ElevatorService(ElevatorRepository elevatorRepository) {
        this.elevatorRepository = elevatorRepository;
    }

    @Transactional(readOnly = true)
    public Page<Elevator> listAll (Pageable pageable){
        return elevatorRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public List<Elevator> listByElevatorId(Long communityId){
        return elevatorRepository.findByCommunityId(communityId);
    }

    @Transactional
    public Elevator create(Elevator elevator) {
        return elevatorRepository.save(elevator);
    }

    @Transactional
    public Optional<Elevator> getById(Long id) {
        return elevatorRepository.findById(id);
    }

    @Transactional
    public Elevator update(Long id, Elevator updatedElevator) {
        Elevator existing = elevatorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Elevator not found"));

        existing.setRae(updatedElevator.getRae());
        existing.setInstalationYear(updatedElevator.getInstalationYear());
        existing.setCommunity(updatedElevator.getCommunity());

        return elevatorRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        checkIfElevatorExistById(id);
        elevatorRepository.deleteById(id);
    }

    private void checkIfElevatorExistById(Long id){
        if (!elevatorRepository.existsById(id)) {
            throw new RuntimeException("Elevator not found");
        }
    }
}
