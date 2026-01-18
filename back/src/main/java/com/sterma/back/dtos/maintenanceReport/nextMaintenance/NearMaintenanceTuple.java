package com.sterma.back.dtos.maintenanceReport.nextMaintenance;

import com.sterma.back.models.Elevator;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NearMaintenanceTuple {
    Elevator elevator;
    NextMaintenanceResponse nextMaintenanceResponse;

}


