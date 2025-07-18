package com.sterma.back.services;

import com.sterma.back.models.Elevator;
import com.sterma.back.repositories.ElevatorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ElevatorService {

    private final ElevatorRepository elevatorRepository;

    public ElevatorService(ElevatorRepository elevatorRepository) {
        this.elevatorRepository = elevatorRepository;
    }

    @Transactional(readOnly = true)
    public List<Elevator> listAll (){
        return elevatorRepository.findAll();
    }

    public List<Elevator> listByElevatorId(Long communityId){
        return elevatorRepository.findByCommunityId(communityId);
    }
}
