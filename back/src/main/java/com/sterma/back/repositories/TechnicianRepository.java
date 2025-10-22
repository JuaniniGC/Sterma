package com.sterma.back.repositories;

import com.sterma.back.models.Community;
import com.sterma.back.models.Technician;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TechnicianRepository extends JpaRepository<Technician, Long> {

    Optional<Technician> findByUsername(String username);
}