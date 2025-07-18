package com.sterma.back.repositories;

import com.sterma.back.models.Elevator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ElevatorRepository  extends JpaRepository<Elevator, Long> {

    List<Elevator> findByCommunityId(Long communityId);
}
