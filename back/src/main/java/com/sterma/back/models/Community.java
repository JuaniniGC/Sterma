package com.sterma.back.models;

import jakarta.persistence.*;

@Entity
@Table(name = "community")
public class Community {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false, unique = true)
    private String CIF;

    //TODO: agraegar info para el mapa interactivo
    private String localization;

    private String infoCommunityLeader;

    public Community() {
    }


}
