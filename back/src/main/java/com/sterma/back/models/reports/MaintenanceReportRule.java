package com.sterma.back.models.reports;

import com.sterma.back.models.MaintenanceRule;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
        name = "maintenance_report_rule",
        uniqueConstraints = @UniqueConstraint(columnNames = {"maintenance_report_id", "maintenance_rule_id"})
)
public class MaintenanceReportRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "maintenance_report_id", nullable = false)
    private MaintenanceReport maintenanceReport;

    @ManyToOne(optional = false)
    @JoinColumn(name = "maintenance_rule_id", nullable = false)
    private MaintenanceRule maintenanceRule;
}
