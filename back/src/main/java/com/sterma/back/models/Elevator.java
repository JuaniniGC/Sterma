package com.sterma.back.models;

import com.sterma.back.models.reports.IncidentReport;
import com.sterma.back.models.reports.MaintenanceReport;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Year;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@Builder
@Table(name = "elevator")
public class Elevator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String rae;

    @NotNull
    private Integer instalationYear;

    @ManyToOne
    private Community community;

    public Elevator(){}

}
