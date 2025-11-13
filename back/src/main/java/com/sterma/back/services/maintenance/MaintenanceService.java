package com.sterma.back.services.maintenance;

import com.sterma.back.dtos.maintenanceReport.CreateMaintenanceReportRequest;
import com.sterma.back.models.Elevator;
import com.sterma.back.models.MaintenanceRule;
import com.sterma.back.models.MaintenanceType;
import com.sterma.back.models.Technician;
import com.sterma.back.models.reports.MaintenanceReport;
import com.sterma.back.repositories.*;
import com.sterma.back.services.maintenance.strategy.MaintenanceServiceStrategy;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class MaintenanceService {

    private final Map<MaintenanceType, MaintenanceServiceStrategy> strategyMap = new EnumMap<>(MaintenanceType.class);

    private final MaintenanceReportRepository maintenanceReportRepository;
    private final MaintenanceRuleRepository maintenanceRuleRepository;

    private final ElevatorRepository elevatorRepository;

    private final TechnicianRepository technicianRepository;



    public MaintenanceService(List<MaintenanceServiceStrategy> strategies,
                              MaintenanceReportRepository maintenanceReportRepository,
                              MaintenanceRuleRepository maintenanceRuleRepository,
                              ElevatorRepository elevatorRepository,
                              TechnicianRepository technicianRepository
    ){
        this.maintenanceReportRepository = maintenanceReportRepository;
        this.maintenanceRuleRepository = maintenanceRuleRepository;
        this.elevatorRepository = elevatorRepository;
        this.technicianRepository = technicianRepository;
        for (MaintenanceServiceStrategy strategy : strategies) {
            strategyMap.put(strategy.getMaintenanceType(), strategy);
        }
    }

    public List<MaintenanceRule> getMaintenanceReportRules(String maintenanceType) {
        MaintenanceType type;
        try {
            type = MaintenanceType.valueOf(maintenanceType.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new NoSuchElementException("Tipo de mantenimiento no válido: " + maintenanceType);
        }
        MaintenanceServiceStrategy strategy = strategyMap.get(type);
        if (strategy == null) {
            throw new NoSuchElementException("No se ha encontrado estrategia para el tipo de mantenimiento: " + maintenanceType);
        }
        List<MaintenanceRule> rules = strategy.getRules();
        if (rules == null || rules.isEmpty()) {
            throw new NoSuchElementException("No se han encontrado reglas para el tipo de mantenimiento: " + maintenanceType);
        }
        return rules;
    }

    public MaintenanceReport createMaintenanceReport(CreateMaintenanceReportRequest request){
        checkElevatorExists(request.getElevatorId());
        checkTechnicianExists(request.getTechnicianId());
        checkEndDateIsAfterStartDate(request.getStartDate(), request.getEndDate());
        Elevator elevator = elevatorRepository.getReferenceById(request.getElevatorId());
        Technician technician = technicianRepository.getReferenceById(request.getTechnicianId());
        MaintenanceReport createdReport = strategyMap.get(request.getMaintenanceType()).createReport(request, technician, elevator);
        return createdReport;
    }

    private void checkElevatorExists(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID de ascensor no puede ser nulo");
        }
        if (!elevatorRepository.existsById(id)) {
            throw new NoSuchElementException("Ascensor no encontrado con ID: " + id);
        }
    }

    private void checkTechnicianExists(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID de ascensor no puede ser nulo");
        }
        if (!technicianRepository.existsById(id)) {
            throw new NoSuchElementException("Técnico no encontrado con ID: " + id);
        }
    }

    public void checkEndDateIsAfterStartDate(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate != null && endDate != null && !startDate.isBefore(endDate)) {
            throw new IllegalArgumentException(
                    "La fecha pasada debe ser anterior a la fecha futura. Fecha pasada: "
                            + startDate + ", Fecha futura: " + endDate
            );
        }
    }
}
