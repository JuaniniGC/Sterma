package com.sterma.back.services.maintenance;


import com.sterma.back.dtos.maintenanceReport.BasicMaintenanceReport;
import com.sterma.back.dtos.maintenanceReport.CreateMaintenanceReportRequest;
import com.sterma.back.dtos.maintenanceReport.nextMaintenance.NearMaintenanceTuple;
import com.sterma.back.dtos.maintenanceReport.nextMaintenance.NextMaintenanceResponse;
import com.sterma.back.dtos.maintenanceReport.nextMaintenance.NextMaintenanceStatus;
import com.sterma.back.dtos.maintenanceRule.CreateMaintenanceRuleRequest;
import com.sterma.back.models.*;
import com.sterma.back.models.reports.MaintenanceReport;
import com.sterma.back.repositories.*;
import com.sterma.back.services.maintenance.strategy.MaintenanceServiceStrategy;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MaintenanceServiceTest {

    @Mock
    private MaintenanceReportRepository maintenanceReportRepository;

    @Mock
    private MaintenanceRuleRepository maintenanceRuleRepository;

    @Mock
    private ElevatorRepository elevatorRepository;

    @Mock
    private TechnicianRepository technicianRepository;

    @Mock
    private MaintenanceServiceStrategy annualStrategy;

    @Mock
    private MaintenanceServiceStrategy biannualStrategy;

    @Mock
    private MaintenanceServiceStrategy monthlyStrategy;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    private MaintenanceService maintenanceService;

    private Elevator elevator;
    private Technician technician;
    private MaintenanceReport report;

    @BeforeEach
    void setUp() {
        when(annualStrategy.getMaintenanceType()).thenReturn(MaintenanceType.ANNUAL);
        when(biannualStrategy.getMaintenanceType()).thenReturn(MaintenanceType.BIANNUAL);
        when(monthlyStrategy.getMaintenanceType()).thenReturn(MaintenanceType.MONTHLY);

        maintenanceService = new MaintenanceService(
                List.of(annualStrategy, biannualStrategy, monthlyStrategy),
                maintenanceReportRepository,
                maintenanceRuleRepository,
                elevatorRepository,
                technicianRepository
        );

        elevator = new Elevator();
        elevator.setId(1L);
        elevator.setRae("RAE123");

        technician = new Technician();
        technician.setUsername("tech");

        report = MaintenanceReport.builder()
                .maintenanceType(MaintenanceType.ANNUAL)
                .elevator(elevator)
                .technician(technician)
                .startDate(LocalDateTime.now().minusDays(1))
                .endDate(LocalDateTime.now())
                .build();
    }

    private void mockAuthenticatedUser() {
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("tech");
    }

    @AfterEach
    void clearContext() {
        SecurityContextHolder.clearContext();
    }

    /* ------------------------ getMaintenanceReportRules ------------------------ */

    @Test
    void getMaintenanceReportRules_WithValidType_ShouldReturnRules() {
        List<MaintenanceRule> rules = List.of(new MaintenanceRule());
        when(annualStrategy.getRules()).thenReturn(rules);

        List<MaintenanceRule> result =
                maintenanceService.getMaintenanceReportRules("ANNUAL");

        assertEquals(1, result.size());
    }

    @Test
    void getMaintenanceReportRules_WithInvalidType_ShouldThrowException() {
        assertThrows(NoSuchElementException.class, () ->
                maintenanceService.getMaintenanceReportRules("INVALID"));
    }

    @Test
    void getMaintenanceReportRules_WithNoRules_ShouldThrowException() {
        when(annualStrategy.getRules()).thenReturn(Collections.emptyList());

        assertThrows(NoSuchElementException.class, () ->
                maintenanceService.getMaintenanceReportRules("ANNUAL"));
    }

    /* ------------------------ createMaintenanceReport ------------------------ */

    @Test
    void createMaintenanceReport_WithValidData_ShouldSaveReport() {
        mockAuthenticatedUser();

        CreateMaintenanceReportRequest request = new CreateMaintenanceReportRequest();
        request.setElevatorRAE("RAE123");
        request.setMaintenanceType(MaintenanceType.ANNUAL);
        request.setStartDate(LocalDateTime.now().minusHours(1));
        request.setEndDate(LocalDateTime.now());

        when(elevatorRepository.findByRae("RAE123")).thenReturn(Optional.of(elevator));
        when(technicianRepository.findByUsername("tech")).thenReturn(Optional.of(technician));
        when(annualStrategy.createReport(any(), any(), any())).thenReturn(report);
        when(maintenanceReportRepository.save(any())).thenReturn(report);

        MaintenanceReport result =
                maintenanceService.createMaintenanceReport(request);

        assertNotNull(result);
        verify(annualStrategy).createReport(any(), any(), any());
    }

    @Test
    void createMaintenanceReport_WithInvalidDates_ShouldThrowException() {
        CreateMaintenanceReportRequest request = new CreateMaintenanceReportRequest();
        request.setStartDate(LocalDateTime.now());
        request.setEndDate(LocalDateTime.now().minusDays(1));

        assertThrows(IllegalArgumentException.class, () ->
                maintenanceService.createMaintenanceReport(request));
    }

    /* ------------------------ getMaintenanceReportsList ------------------------ */

    @Test
    void getMaintenanceReportsList_WithExistingElevator_ShouldReturnReports() {
        when(elevatorRepository.existsById(1L)).thenReturn(true);
        when(maintenanceReportRepository.findByElevator_Id(1L))
                .thenReturn(List.of(report));

        List<MaintenanceReport> result =
                maintenanceService.getMaintenanceReportsList(1L);

        assertEquals(1, result.size());
    }

    @Test
    void getMaintenanceReportsList_WithNonExistingElevator_ShouldThrowException() {
        when(elevatorRepository.existsById(1L)).thenReturn(false);

        assertThrows(NoSuchElementException.class, () ->
                maintenanceService.getMaintenanceReportsList(1L));
    }

    /* ------------------------ getNextImportantMaintenance ------------------------ */

    @Test
    void getNextImportantMaintenance_WithAnnualSoon_ShouldReturnWarning() {
        when(elevatorRepository.existsById(1L)).thenReturn(true);
        when(maintenanceReportRepository.findByElevator_Id(1L))
                .thenReturn(List.of(report));

        when(annualStrategy.getNextMaintenanceDate(any()))
                .thenReturn(LocalDate.now().plusDays(10));
        when(biannualStrategy.getNextMaintenanceDate(any()))
                .thenReturn(LocalDate.now().plusMonths(6));

        NextMaintenanceResponse response =
                maintenanceService.getNextImportantMaintenance(1L);

        assertEquals(NextMaintenanceStatus.WARNING, response.getStatus());
    }

    /* ------------------------ listSoonMaintenance ------------------------ */

    @Test
    void listSoonMaintenance_ShouldReturnOnlyNonGoodStatuses() {
        when(elevatorRepository.findAll()).thenReturn(List.of(elevator));
        when(elevatorRepository.existsById(1L)).thenReturn(true);
        when(maintenanceReportRepository.findByElevator_Id(1L))
                .thenReturn(List.of(report));

        when(annualStrategy.getNextMaintenanceDate(any()))
                .thenReturn(LocalDate.now().minusDays(1));
        when(biannualStrategy.getNextMaintenanceDate(any()))
                .thenReturn(LocalDate.now().plusMonths(3));

        List<NearMaintenanceTuple> result =
                maintenanceService.listSoonMaintenance();

        assertEquals(1, result.size());
        assertEquals(NextMaintenanceStatus.DANGER,
                result.get(0).getNextMaintenanceResponse().getStatus());
    }

    /* ------------------------ createMaintenanceRule ------------------------ */

    @Test
    void createMaintenanceRule_WithValidData_ShouldSaveRule() {
        CreateMaintenanceRuleRequest request = new CreateMaintenanceRuleRequest();
        request.setName("Rule");
        request.setDescription("Desc");
        request.setMaintenanceType(MaintenanceType.ANNUAL);
        request.setOrderNum(1);

        when(maintenanceRuleRepository.save(any()))
                .thenAnswer(invocation -> invocation.getArgument(0));

        MaintenanceRule result =
                maintenanceService.createMaintenanceRule(request);

        assertNotNull(result);
        verify(maintenanceRuleRepository).save(any());
    }
}
