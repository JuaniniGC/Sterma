package com.sterma.back.repositories;

import com.sterma.back.models.Elevator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ElevatorRepository  extends JpaRepository<Elevator, Long> {

    List<Elevator> findByCommunityId(Long communityId);

    boolean existsByRae(String rae);

    @Query("""
        SELECT e FROM Elevator e
        WHERE (:elevatorName IS NULL OR LOWER(e.rae) LIKE LOWER(CONCAT('%', :elevatorName, '%')))
        AND (:communityName IS NULL OR LOWER(e.community.name) LIKE LOWER(CONCAT('%', :communityName, '%')))
    """)
    Page<Elevator> findByFilters(@Param("elevatorName") String elevatorName,
                                 @Param("communityName") String communityName,
                                 Pageable pageable);


}
