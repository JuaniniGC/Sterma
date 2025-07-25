package com.sterma.back.dtos.elevator;

import com.sterma.back.models.Community;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CreateElevatorRequest {

    @NotNull
    private String rae;

    @NotNull
    private Integer instalationYear;

    @NotNull
    private Long communityId;

}
