package com.sterma.back.services;

import com.sterma.back.dtos.commonMistakes.CommonMistakeCreateRequest;
import com.sterma.back.models.CommonMistake;
import com.sterma.back.repositories.CommonMistakeRepository;
import org.springframework.stereotype.Service;

@Service
public class CommonMistakeService {

    private CommonMistakeRepository commonMistakeRepository;

    public CommonMistakeService(CommonMistakeRepository commonMistakeRepository) {
        this.commonMistakeRepository = commonMistakeRepository;
    }

    public CommonMistake createCommonMistake(CommonMistakeCreateRequest request){
        checkIdentificatorNotUsed(request.getIdentificator());
        CommonMistake commonMistake = CommonMistake.builder()
                .description(request.getDescription())
                .identificator(request.getIdentificator())
                .build();
        return commonMistakeRepository.save(commonMistake);
    }

    private void checkIdentificatorNotUsed(String identificator) {
        if (commonMistakeRepository.existsByIdentificator(identificator)) {
            throw new IllegalStateException("Ese identificador ya esta en uso: " + identificator);
        }
    }
}
