package com.sterma.back.dtos.commonMistakes;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class CommonMistakeCreateRequest {

    private String identificator;
    private String description;
}
