package com.sterma.back.dtos.community;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CreateCommunityRequest {

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
    @Pattern(regexp = "^\\d{5}$", message = "El código postal debe tener exactamente 5 dígitos")
    private String postalCode;

    private String communityLeaderName;

    @Pattern(regexp = "^\\d{9}$", message = "El teléfono debe tener exactamente 9 dígitos")
    private String communityLeaderTelephone;

    private String communityLeaderNote;
}
