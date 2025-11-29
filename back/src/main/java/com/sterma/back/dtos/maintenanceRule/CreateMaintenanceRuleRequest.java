package com.sterma.back.dtos.maintenanceRule;

import com.sterma.back.models.MaintenanceRule;
import com.sterma.back.models.MaintenanceType;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateMaintenanceRuleRequest {

    MaintenanceRule maintenanceRule;

    private String name;
    private String description;
    private Integer orderNum;
    private MaintenanceType maintenanceType;
}
