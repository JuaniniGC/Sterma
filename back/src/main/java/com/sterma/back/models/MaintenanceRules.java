package com.sterma.back.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "maintenance_rules")
public class MaintenanceRules {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @NotBlank
    private String description;

    private Integer order;

    @NotNull
    private MaintenanceType maintenanceType;



}
