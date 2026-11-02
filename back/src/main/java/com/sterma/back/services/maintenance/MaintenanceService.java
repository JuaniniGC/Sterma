package com.sterma.back.services.maintenance;


import com.sterma.back.dtos.maintenanceReport.BasicMaintenanceReport;
import com.sterma.back.dtos.maintenanceReport.CreateMaintenanceReportRequest;
import com.sterma.back.dtos.maintenanceReport.MaintenanceReportDetail;
import com.sterma.back.dtos.maintenanceReport.nextMaintenance.NearMaintenanceTuple;
import com.sterma.back.dtos.maintenanceReport.nextMaintenance.NextMaintenanceResponse;
import com.sterma.back.dtos.maintenanceReport.nextMaintenance.NextMaintenanceStatus;
import com.sterma.back.dtos.maintenanceRule.CreateMaintenanceRuleRequest;
import com.sterma.back.models.Elevator;
import com.sterma.back.models.MaintenanceRule;
import com.sterma.back.models.MaintenanceType;
import com.sterma.back.models.Technician;
import com.sterma.back.models.reports.IncidentReport;
import com.sterma.back.models.reports.MaintenanceReport;
import com.sterma.back.models.reports.MaintenanceReportRule;
import com.sterma.back.repositories.*;
import com.sterma.back.services.maintenance.strategy.MaintenanceServiceStrategy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class MaintenanceService {

    private final Map<MaintenanceType, MaintenanceServiceStrategy> strategyMap = new EnumMap<>(MaintenanceType.class);

    private final MaintenanceReportRepository maintenanceReportRepository;
    private final MaintenanceRuleRepository maintenanceRuleRepository;
    private final MaintenanceReportRuleRepository maintenanceReportRuleRepository;
    private final ElevatorRepository elevatorRepository;

    private final TechnicianRepository technicianRepository;




    public MaintenanceService(List<MaintenanceServiceStrategy> strategies,
                              MaintenanceReportRepository maintenanceReportRepository,
                              MaintenanceRuleRepository maintenanceRuleRepository,
                              MaintenanceReportRuleRepository maintenanceReportRuleRepository,
                              ElevatorRepository elevatorRepository,
                              TechnicianRepository technicianRepository
    ){
        this.maintenanceReportRepository = maintenanceReportRepository;
        this.maintenanceRuleRepository = maintenanceRuleRepository;
        this.maintenanceReportRuleRepository = maintenanceReportRuleRepository;
        this.elevatorRepository = elevatorRepository;
        this.technicianRepository = technicianRepository;
        for (MaintenanceServiceStrategy strategy : strategies) {
            strategyMap.put(strategy.getMaintenanceType(), strategy);
        }
    }

    @Transactional(readOnly = true)
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
    @Transactional
    public MaintenanceReport createMaintenanceReport(CreateMaintenanceReportRequest request){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        checkEndDateIsAfterStartDate(request.getStartDate(), request.getEndDate());
        Elevator elevator = elevatorRepository.findByRae(request.getElevatorRAE())
                .orElseThrow(() -> new NoSuchElementException(
                        "Ascensor no encontrado con RAE: " + request.getElevatorRAE()
                ));
        Technician technician = technicianRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new NoSuchElementException("Técnico incorrecto"));
        MaintenanceServiceStrategy strategy = strategyMap.get(request.getMaintenanceType());
        List<MaintenanceRule> rules = strategy.getRules();
        MaintenanceReport createdReport = strategy.createReport(request, technician, elevator);
        MaintenanceReport savedReport = maintenanceReportRepository.save(createdReport);
        maintenanceReportRuleRepository.saveAll(rules.stream()
                .map(rule -> MaintenanceReportRule.builder().maintenanceReport(savedReport).maintenanceRule(rule).build())
                .toList());
        return savedReport;
    }

    @Transactional(readOnly = true)
    public MaintenanceReportDetail getMaintenanceReportDetail(Long id) {
        checkMaintenanceReportExists(id);
        MaintenanceReport report = maintenanceReportRepository.getReferenceById(id);
        List<MaintenanceRule> rules = maintenanceReportRuleRepository
                .findByMaintenanceReport_IdOrderByMaintenanceRule_OrderNumAsc(id).stream()
                .map(MaintenanceReportRule::getMaintenanceRule)
                .toList();
        return new MaintenanceReportDetail(report, rules);
    }

    @Transactional(readOnly = true)
    public List<MaintenanceReport> getMaintenanceReportsList(Long elevatorId){
        checkElevatorExists(elevatorId);
        return maintenanceReportRepository.findByElevator_Id(elevatorId);
    }

    @Transactional(readOnly = true)
    public List<BasicMaintenanceReport> getBasicMaintenanceReportsList(Long elevatorId){
        List<MaintenanceReport> list = getMaintenanceReportsList(elevatorId);
        return list.stream().map(BasicMaintenanceReport::new).toList();
    }

    @Transactional(readOnly = true)
    public NextMaintenanceResponse getNextImportantMaintenance(Long elevatorId) {
        checkElevatorExists(elevatorId);

        MaintenanceType nextType;
        LocalDate nextDate;
        List<MaintenanceReport> reports = getMaintenanceReportsList(elevatorId);

        LocalDate nextAnnual = strategyMap.get(MaintenanceType.ANNUAL).getNextMaintenanceDate(reports);
        LocalDate nextBiannual = strategyMap.get(MaintenanceType.BIANNUAL).getNextMaintenanceDate(reports);

        if (nextAnnual == null && nextBiannual == null) {
            nextType = MaintenanceType.ANNUAL;
            nextDate = null;
        } else if (nextAnnual == null) {
            nextType = MaintenanceType.ANNUAL;
            nextDate = null;
        } else if (nextBiannual == null) {
            nextType = MaintenanceType.BIANNUAL;
            nextDate = nextAnnual.minusMonths(6);
        } else {
            if (nextBiannual.isBefore(nextAnnual)) {
                nextType = MaintenanceType.BIANNUAL;
                nextDate = nextBiannual;
            } else {
                nextType = MaintenanceType.ANNUAL;
                nextDate = nextAnnual;
            }
        }
        return new NextMaintenanceResponse(nextType, nextDate, generateMaintenanceStatus(nextDate));
    }

    @Transactional(readOnly = true)
    public List<NearMaintenanceTuple> listSoonMaintenance() {
        return elevatorRepository.findAll().stream()
                .map(elevator -> new NearMaintenanceTuple(elevator, getNextImportantMaintenance(elevator.getId())))
                .filter(nearMaintenanceTuple -> !nearMaintenanceTuple.getNextMaintenanceResponse().getStatus().equals(NextMaintenanceStatus.GOOD))
                .sorted(Comparator.comparingInt(r -> r.getNextMaintenanceResponse().getStatus().weight))
                .toList();
    }

    @Transactional
    public MaintenanceRule createMaintenanceRule(CreateMaintenanceRuleRequest request){
        MaintenanceRule maintenanceRule = MaintenanceRule.builder()
                .name(request.getName())
                .description(request.getDescription())
                .maintenanceType(request.getMaintenanceType())
                .orderNum(request.getOrderNum())
                .build();
        return maintenanceRuleRepository.save(maintenanceRule);
    }

    @Transactional
    public void deleteMaintenanceReport(Long id){
        checkMaintenanceReportExists(id);
        maintenanceReportRuleRepository.deleteByMaintenanceReport_Id(id);
        maintenanceReportRepository.deleteById(id);
    }

    @Transactional
    public void deleteAllMaintenanceReportByElevator(Long elevatorId){
        checkElevatorExists(elevatorId);
        List<MaintenanceReport> reportList = maintenanceReportRepository.findByElevator_Id(elevatorId);
        for(MaintenanceReport report: reportList){
            deleteMaintenanceReport(report.getId());
        }
    }

    @Transactional
    public void deleteMaintenanceRule(Long id){
        checkMaintenanceRuleExists(id);
        long reportCount = maintenanceReportRuleRepository.countByMaintenanceRule_Id(id);
        if (reportCount > 0) {
            throw new IllegalStateException(
                    "No se puede eliminar el paso: está registrado en " + reportCount + " informe(s) de mantenimiento");
        }
        maintenanceRuleRepository.deleteById(id);
    }
    private NextMaintenanceStatus generateMaintenanceStatus(LocalDate nextDate){
        NextMaintenanceStatus status;
        if(nextDate == null){
            status = NextMaintenanceStatus.NEVER_PASS;
        } else if (nextDate.isBefore(LocalDate.now())) {
            status = NextMaintenanceStatus.DANGER;
        } else if (!nextDate.isAfter(LocalDate.now().plusMonths(1))) {
            status = NextMaintenanceStatus.WARNING;
        } else {
            status = NextMaintenanceStatus.GOOD;
        }
        return status;
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
    private void checkEndDateIsAfterStartDate(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate != null && endDate != null && !startDate.isBefore(endDate)) {
            throw new IllegalArgumentException(
                    "La fecha pasada debe ser anterior a la fecha futura. Fecha pasada: "
                            + startDate + ", Fecha futura: " + endDate
            );
        }
    }

    private void checkMaintenanceReportExists(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        if (!maintenanceReportRepository.existsById(id)) {
            throw new NoSuchElementException("Informe no encontrado con ID: " + id);
        }
    }

    private void checkMaintenanceRuleExists(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        if (!maintenanceRuleRepository.existsById(id)) {
            throw new NoSuchElementException("Regla no encontrado con ID: " + id);
        }
    }

}
