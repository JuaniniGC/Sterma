package com.sterma.back.dtos.elevator;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateElevatorRequest {

    @NotNull
    private String rae;

    @NotNull
    private Integer instalationYear;

    @NotNull
    private Long communityId;

}
