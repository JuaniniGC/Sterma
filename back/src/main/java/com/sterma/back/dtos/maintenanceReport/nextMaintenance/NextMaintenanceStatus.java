package com.sterma.back.dtos.maintenanceReport.nextMaintenance;

public enum NextMaintenanceStatus {
    NEVER_PASS(1),
    DANGER(2),
    WARNING(3),
    GOOD(4);

    public final int weight;

    NextMaintenanceStatus(int weight) {
        this.weight = weight;
    }
}