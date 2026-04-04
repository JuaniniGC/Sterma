package com.sterma.back.services;

import com.sterma.back.controller.CommonMistakeController;
import com.sterma.back.dtos.commonMistakes.CommonMistakeCreateRequest;
import com.sterma.back.models.CommonMistake;
import com.sterma.back.repositories.CommonMistakeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CommonMistakeService {

    private CommonMistakeRepository commonMistakeRepository;

    public CommonMistakeService(CommonMistakeRepository commonMistakeRepository) {
        this.commonMistakeRepository = commonMistakeRepository;
    }

    @Transactional
    public CommonMistake createCommonMistake(CommonMistakeCreateRequest request){
        checkIdentificatorNotUsed(request.getIdentificator());
        CommonMistake commonMistake = CommonMistake.builder()
                .description(request.getDescription())
                .identificator(request.getIdentificator())
                .build();
        return commonMistakeRepository.save(commonMistake);
    }

    @Transactional(readOnly = true)
    public Page<CommonMistake> getAllCommonMistakes(Pageable pageable) {
        return commonMistakeRepository.findAll(pageable);
    }

    @Transactional
    public void delete(Long id){
        checkCommonMistakeExist(id);
        commonMistakeRepository.deleteById(id);
    }

    private void checkCommonMistakeExist(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        if (!commonMistakeRepository.existsById(id)) {
            throw new NoSuchElementException("Regla de mantenimiento no encontrada con ID: " + id);
        }
    }
    private void checkIdentificatorNotUsed(String identificator) {
        if (commonMistakeRepository.existsByIdentificator(identificator)) {
            throw new IllegalStateException("Ese identificador ya esta en uso: " + identificator);
        }
    }


}
