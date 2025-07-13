package com.sterma.back.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.Year;

@Entity
@Table(name = "elevator")
public class Elevator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String rae;

    @NotNull
    private Year instalationYear;

    @ManyToOne
    private Community community;

    public Elevator(){}

}
