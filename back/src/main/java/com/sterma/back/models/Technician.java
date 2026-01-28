package com.sterma.back.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
@Table(name = "technician")
public class Technician {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String surnames;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TechnicianRole role;


    public Technician() {
    }
}
