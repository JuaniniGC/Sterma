package com.sterma.back.models.reports;

import com.sterma.back.models.MaintenanceType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "maintenance_report")
public class MaintenanceReport extends Report {
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "maintenance_type")
    private MaintenanceType maintenanceType;
}
