package com.sterma.back.models;

import jakarta.persistence.*;

import java.time.Year;

@Entity
@Table(name = "technician")
public class Technician {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String user;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String surnames;



}
