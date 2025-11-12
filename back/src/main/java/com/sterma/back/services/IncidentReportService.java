package com.sterma.back.services;

import com.sterma.back.dtos.incidentReport.CreateIncidentReportRequest;
import com.sterma.back.models.Elevator;
import com.sterma.back.models.Technician;
import com.sterma.back.models.reports.IncidentReport;
import com.sterma.back.repositories.ElevatorRepository;
import com.sterma.back.repositories.IncidentReportRepository;
import com.sterma.back.repositories.TechnicianRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@Service
public class IncidentReportService {

    private final IncidentReportRepository incidentReportRepository;
    private final ElevatorRepository elevatorRepository;
    private final TechnicianRepository technicianRepository;

    public IncidentReportService(IncidentReportRepository incidentReportRepository,
                                 ElevatorRepository elevatorRepository,
                                 TechnicianRepository technicianRepository) {
        this.incidentReportRepository = incidentReportRepository;
        this.elevatorRepository = elevatorRepository;
        this.technicianRepository = technicianRepository;
    }

    public IncidentReport createIncidentReport(CreateIncidentReportRequest request, String username) {
        checkElevatorExists(request.getElevatorId());
        Elevator elevator = elevatorRepository.findById(request.getElevatorId())
                .orElseThrow(() -> new NoSuchElementException("Ascensor no encontrado"));
        Technician technician = technicianRepository.findByUsername(username)
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

    private void checkElevatorExists(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID de ascensor no puede ser nulo");
        }
        if (!elevatorRepository.existsById(id)) {
            throw new NoSuchElementException("Ascensor no encontrado con ID: " + id);
        }
    }

    public void checkEndDateIsBeforeStartDate(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate != null && endDate != null && !startDate.isBefore(endDate)) {
            throw new IllegalArgumentException(
                    "La fecha pasada debe ser anterior a la fecha futura. Fecha pasada: "
                            + startDate + ", Fecha futura: " + endDate
            );
        }
    }

}

