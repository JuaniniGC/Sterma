package com.sterma.back.repositories;

import com.sterma.back.models.CommonMistake;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommonMistakeRepository extends JpaRepository<CommonMistake, Long> {

    boolean existsByIdentificator(String identificator);
}
