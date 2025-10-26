package com.sterma.back.dtos.community;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateCommunityRequest {

    @NotNull
    private String name;

    private String description;

    @NotNull
    @Pattern(regexp = "^[A-HJ-NP-SUVW]\\d{7}[0-9A-J]$", message = "CIF inválido")
    private String CIF;

    @NotNull
    private String city;

    @NotNull
    private String street;

    @NotNull
    private String postalCode;

    private String communityLeaderName;
    private String communityLeaderTelephone;
    private String communityLeaderNote;
}
