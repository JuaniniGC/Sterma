package com.sterma.back.models;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@AllArgsConstructor
public class Localization {

    private String city;
    private String street;
    private String postalCode;

    public Localization() {
    }
}
