package com.sterma.back.models;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@AllArgsConstructor
@Builder
public class Localization {

    private String city;
    private String street;
    private String postalCode;

    public Localization() {
    }
}
