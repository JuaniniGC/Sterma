package com.sterma.back.models.reports;

import com.sterma.back.models.MaintenanceType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@SuperBuilder
@Table(name = "maintenance_report")
public class MaintenanceReport extends Report {
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "maintenance_type")
    private MaintenanceType maintenanceType;
    public LocalDateTime getNextMaintenanceDate() {
        LocalDateTime baseDate = getStartDate();
        return switch (maintenanceType) {
            case ANNUAL -> baseDate.plusYears(1);
            case BIANNUAL -> baseDate.plusMonths(6);
            case MONTHLY -> baseDate.plusMonths(1);
        };
    }
}
