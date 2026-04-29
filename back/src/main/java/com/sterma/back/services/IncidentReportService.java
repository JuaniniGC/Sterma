package com.sterma.back.services;


import com.sterma.back.dtos.incidentReport.BasicIncidentReport;
import com.sterma.back.dtos.incidentReport.CreateIncidentReportRequest;
import com.sterma.back.models.Elevator;
import com.sterma.back.models.Technician;
import com.sterma.back.models.reports.IncidentReport;
import com.sterma.back.repositories.ElevatorRepository;
import com.sterma.back.repositories.IncidentReportRepository;
import com.sterma.back.repositories.TechnicianRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class IncidentReportService {

    private final IncidentReportRepository incidentReportRepository;
    private final ElevatorRepository elevatorRepository;
    private final TechnicianRepository technicianRepository;
    private final ImageService imageService;

    public IncidentReportService(IncidentReportRepository incidentReportRepository,
                                 ElevatorRepository elevatorRepository,
                                 TechnicianRepository technicianRepository,
                                 ImageService imageService) {
        this.incidentReportRepository = incidentReportRepository;
        this.elevatorRepository = elevatorRepository;
        this.technicianRepository = technicianRepository;
        this.imageService = imageService;
    }

    @Transactional
    public IncidentReport createIncidentReport(CreateIncidentReportRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        checkEndDateIsAfterStartDate(request.getStartDate(), request.getEndDate());
        Elevator elevator = elevatorRepository.findByRae(request.getElevatorRAE())
                .orElseThrow(() -> new NoSuchElementException(
                        "Ascensor no encontrado con RAE: " + request.getElevatorRAE()
                ));
        Technician technician = technicianRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new NoSuchElementException("Técnico incorrecto"));
        IncidentReport report = IncidentReport.builder()
                .commentary(request.getCommentary())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .elevator(elevator)
                .technician(technician)
                .build();
        return incidentReportRepository.save(report);
    }

    @Transactional(readOnly = true)
    public List<BasicIncidentReport> listAllIncidentReportForElevator(Long elevatorId){
        checkElevatorExists(elevatorId);
        List<IncidentReport> list =  incidentReportRepository.findByElevator_Id(elevatorId);
        return list.stream().map(BasicIncidentReport::new).toList();
    }

    @Transactional
    public void deleteIncidentReport(Long id){
        checkIncidentReportExists(id);
        IncidentReport incidentReport = incidentReportRepository.getReferenceById(id);
        imageService.deleteAllImageForIncidentRepository(id);
        incidentReportRepository.deleteById(id);
    }

    @Transactional
    public void deleteAllIncidentReportByElevator(Long elevatorId){
        checkElevatorExists(elevatorId);
        List<IncidentReport> reportList = incidentReportRepository.findByElevator_Id(elevatorId);
        for(IncidentReport report: reportList){
            deleteIncidentReport(report.getId());
        }
    }

    @Transactional
    public void updateEndDate(Long incidentReportId, LocalDateTime endDate ){
        checkIncidentReportExists(incidentReportId);
        IncidentReport report = incidentReportRepository.getReferenceById(incidentReportId);
        if (report.getEndDate() != null) {
            throw new IllegalStateException("El informe ya tiene una fecha de finalización y no puede ser modificado");
        }
        checkEndDateIsAfterStartDate(report.getStartDate(), endDate);
        report.setEndDate(endDate);
    }

    private void checkElevatorExists(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID de ascensor no puede ser nulo");
        }
        if (!elevatorRepository.existsById(id)) {
            throw new NoSuchElementException("Ascensor no encontrado con ID: " + id);
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

    private void checkIncidentReportExists(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        if (!incidentReportRepository.existsById(id)) {
            throw new NoSuchElementException("Informe no encontrado con ID: " + id);
        }
    }

}

