package com.sterma.back.models.reports;

import com.sterma.back.models.Elevator;
import com.sterma.back.models.Technician;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@MappedSuperclass
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

    @NotNull
    @ManyToOne
    private Elevator elevator;

}
