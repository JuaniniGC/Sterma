package com.sterma.back.models.reports;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.sterma.back.models.Elevator;
import com.sterma.back.models.Technician;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private LocalDateTime startDate = LocalDateTime.now();

    private LocalDateTime endDate;

    private String commentary;

    @NotNull
    @ManyToOne
    private Technician technician;

    @ManyToOne
    @JoinColumn(name = "elevator_id", nullable = false)
    @JsonIgnoreProperties({"incidentReports", "maintenanceReports"})
    private Elevator elevator;

}
