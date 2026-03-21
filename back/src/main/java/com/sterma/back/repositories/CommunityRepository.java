package com.sterma.back.repositories;

import com.sterma.back.models.Community;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {
    Page<Community> findByNameContainingIgnoreCase(String name, Pageable pageable);

    boolean existsByCIF(String cif);
    boolean existsByCIFAndIdNot(String cif, Long id);

}
