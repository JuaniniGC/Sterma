package com.sterma.back.services;

import com.sterma.back.dtos.incidentReport.CreateIncidentReportRequest;
import com.sterma.back.models.Elevator;
import com.sterma.back.models.Technician;
import com.sterma.back.models.reports.IncidentReport;
import com.sterma.back.repositories.ElevatorRepository;
import com.sterma.back.repositories.IncidentReportRepository;
import com.sterma.back.repositories.TechnicianRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IncidentReportServiceTest {

    @Mock
    private IncidentReportRepository incidentReportRepository;

    @Mock
    private ElevatorRepository elevatorRepository;

    @Mock
    private TechnicianRepository technicianRepository;

    @Mock
    private Authentication authentication;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private IncidentReportService incidentReportService;

    private CreateIncidentReportRequest validRequest;
    private Elevator sampleElevator;
    private Technician sampleTechnician;
    private IncidentReport sampleReport;

    @BeforeEach
    void setUp() {
        validRequest = new CreateIncidentReportRequest();
        validRequest.setElevatorRAE("RAE123");
        validRequest.setCommentary("Avería en la puerta");
        validRequest.setStartDate(LocalDateTime.now().minusHours(2));
        validRequest.setEndDate(LocalDateTime.now());

        sampleElevator = new Elevator();
        sampleElevator.setId(1L);
        sampleElevator.setRae("RAE123");

        sampleTechnician = new Technician();
        sampleTechnician.setId(1L);
        sampleTechnician.setUsername("techUser");

        sampleReport = IncidentReport.builder()
                .commentary(validRequest.getCommentary())
                .startDate(validRequest.getStartDate())
                .endDate(validRequest.getEndDate())
                .elevator(sampleElevator)
                .technician(sampleTechnician)
                .build();
    }

    /* ------------------------ Métodos auxiliares ------------------------ */

    private void mockAuthenticatedUser() {
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("techUser");
    }

    /* ------------------------ Tests para createIncidentReport ------------------------ */

    @Test
    void createIncidentReport_WithValidData_ShouldReturnSavedReport() {
        mockAuthenticatedUser();

        when(elevatorRepository.findByRae("RAE123")).thenReturn(Optional.of(sampleElevator));
        when(technicianRepository.findByUsername("techUser")).thenReturn(Optional.of(sampleTechnician));
        when(incidentReportRepository.save(any(IncidentReport.class))).thenReturn(sampleReport);

        IncidentReport result = incidentReportService.createIncidentReport(validRequest);

        assertNotNull(result);
        assertEquals("Avería en la puerta", result.getCommentary());
        verify(incidentReportRepository).save(any(IncidentReport.class));
    }


    @Test
    void createIncidentReport_WithInvalidTechnician_ShouldThrowNoSuchElementException() {
        mockAuthenticatedUser();

        when(elevatorRepository.findByRae("RAE123")).thenReturn(Optional.of(sampleElevator));
        when(technicianRepository.findByUsername("techUser")).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () ->
                incidentReportService.createIncidentReport(validRequest));
    }

    /* ------------------------ Tests para listAllIncidentReportForElevator ------------------------ */

    @Test
    void listAllIncidentReportForElevator_WithExistingElevator_ShouldReturnReports() {
        when(elevatorRepository.existsById(1L)).thenReturn(true);
        when(incidentReportRepository.findByElevator_Id(1L)).thenReturn(List.of(sampleReport));

        List<IncidentReport> result =
                incidentReportService.listAllIncidentReportForElevator(1L);

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        verify(incidentReportRepository).findByElevator_Id(1L);
    }

    @Test
    void listAllIncidentReportForElevator_WithNoReports_ShouldReturnEmptyList() {
        when(elevatorRepository.existsById(1L)).thenReturn(true);
        when(incidentReportRepository.findByElevator_Id(1L)).thenReturn(List.of());

        List<IncidentReport> result =
                incidentReportService.listAllIncidentReportForElevator(1L);

        assertTrue(result.isEmpty());
    }

    @Test
    void listAllIncidentReportForElevator_WithNonExistingElevator_ShouldThrowNoSuchElementException() {
        when(elevatorRepository.existsById(1L)).thenReturn(false);

        assertThrows(NoSuchElementException.class, () ->
                incidentReportService.listAllIncidentReportForElevator(1L));
    }

    @Test
    void listAllIncidentReportForElevator_WithNullId_ShouldThrowIllegalArgumentException() {
        assertThrows(IllegalArgumentException.class, () ->
                incidentReportService.listAllIncidentReportForElevator(null));
    }
}
