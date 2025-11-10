package com.sterma.back.services;

import com.sterma.back.dtos.elevator.CreateElevatorRequest;
import com.sterma.back.dtos.elevator.UpdateElevatorRequest;
import com.sterma.back.models.Elevator;
import com.sterma.back.repositories.CommunityRepository;
import com.sterma.back.repositories.ElevatorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.Year;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ElevatorServiceTest {

    @Mock
    private ElevatorRepository elevatorRepository;

    @Mock
    private CommunityRepository communityRepository;

    @InjectMocks
    private ElevatorService elevatorService;

    private CreateElevatorRequest validRequest;
    private Elevator sampleElevator;

    @BeforeEach
    void setUp() {
        validRequest = new CreateElevatorRequest();
        validRequest.setRae("RAE123");
        validRequest.setInstalationYear(2020);
        validRequest.setCommunityId(1L);

        sampleElevator = new Elevator();
        sampleElevator.setId(1L);
        sampleElevator.setRae("RAE123");
        sampleElevator.setInstalationYear(2020);
    }

    /* ------------------------ Tests para listAll ------------------------ */
    @Test
    void listAll_ShouldReturnPageOfElevators() {
        Page<Elevator> expectedPage = new PageImpl<>(List.of(sampleElevator));
        when(elevatorRepository.findByFilters(
                isNull(),
                isNull(),
                any(Pageable.class))
        ).thenReturn(expectedPage);

        Page<Elevator> result = elevatorService.listAll(null, null, Pageable.unpaged());

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(elevatorRepository).findByFilters(isNull(), isNull(), any(Pageable.class));
    }

    @Test
    void listAll_WithEmptyResult_ShouldReturnEmptyPage() {
        // Given
        when(elevatorRepository.findByFilters(
                isNull(),
                isNull(),
                any(Pageable.class))
        ).thenReturn(Page.empty());

        Page<Elevator> result = elevatorService.listAll(null, null, Pageable.unpaged());

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(elevatorRepository).findByFilters(isNull(), isNull(), any(Pageable.class));
    }

    @Test
    void listAll_WithFilters_ShouldCallRepositoryWithFilters() {
        // Given
        String elevatorName = "RAE001";
        String communityName = "Las Rosas";
        Page<Elevator> expectedPage = new PageImpl<>(List.of(sampleElevator));

        when(elevatorRepository.findByFilters(
                eq(elevatorName),
                eq(communityName),
                any(Pageable.class))
        ).thenReturn(expectedPage);

        Page<Elevator> result = elevatorService.listAll(elevatorName, communityName, Pageable.unpaged());

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(elevatorRepository).findByFilters(eq(elevatorName), eq(communityName), any(Pageable.class));
    }

    /* --------------------- Tests para listByElevatorId --------------------- */
    @Test
    void listByElevatorId_ShouldReturnListOfElevators() {
        when(elevatorRepository.findByCommunityId(1L)).thenReturn(List.of(sampleElevator));

        List<Elevator> result = elevatorService.listByElevatorId(1L);

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        verify(elevatorRepository).findByCommunityId(1L);
    }

    @Test
    void listByElevatorId_WithNoResults_ShouldReturnEmptyList() {
        when(elevatorRepository.findByCommunityId(1L)).thenReturn(Collections.emptyList());

        List<Elevator> result = elevatorService.listByElevatorId(1L);

        assertTrue(result.isEmpty());
    }

    /* ------------------------ Tests para create ------------------------ */
    @Test
    void create_WithExistingRae_ShouldThrowIllegalStateException() {
        when(communityRepository.existsById(1L)).thenReturn(true);
        when(elevatorRepository.existsByRae("RAE123")).thenReturn(true);

        assertThrows(IllegalStateException.class, () -> elevatorService.create(validRequest));
    }

    @Test
    void create_WithNonExistingCommunity_ShouldThrowNoSuchElementException() {
        when(communityRepository.existsById(1L)).thenReturn(false);

        assertThrows(NoSuchElementException.class, () -> elevatorService.create(validRequest));
    }

    @Test
    void create_WithValidData_ShouldReturnSavedElevator() {
        when(communityRepository.existsById(1L)).thenReturn(true);
        when(elevatorRepository.existsByRae("RAE123")).thenReturn(false);
        when(elevatorRepository.save(any(Elevator.class))).thenReturn(sampleElevator);

        Elevator result = elevatorService.create(validRequest);

        assertNotNull(result);
        assertEquals("RAE123", result.getRae());
        verify(elevatorRepository).save(any(Elevator.class));
    }

    /* ------------------------ Tests para getById ------------------------ */
    @ParameterizedTest
    @ValueSource(longs = {1L, 2L, 3L})
    void getById_WithExistingId_ShouldReturnElevator(Long id) {
        sampleElevator.setId(id);
        when(elevatorRepository.findById(id)).thenReturn(Optional.of(sampleElevator));

        Optional<Elevator> result = elevatorService.getById(id);

        assertTrue(result.isPresent());
        assertEquals(id, result.get().getId());
    }

    @Test
    void getById_WithNonExistingId_ShouldReturnEmpty() {
        when(elevatorRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<Elevator> result = elevatorService.getById(99L);

        assertTrue(result.isEmpty());
    }


    /* ------------------------ Tests para update ------------------------ */
    @Test
    void update_WithExistingRae_ShouldThrowIllegalStateException() {
        Elevator existing = new Elevator();
        existing.setId(1L);
        existing.setRae("OLDRAE");

        when(elevatorRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(communityRepository.existsById(1L)).thenReturn(true);
        when(elevatorRepository.existsByRae("NEWRAE")).thenReturn(true);

        UpdateElevatorRequest updateRequest = new UpdateElevatorRequest();
        updateRequest.setRae("NEWRAE");
        updateRequest.setInstalationYear(2021);
        updateRequest.setCommunityId(1L);

        assertThrows(IllegalStateException.class, () ->
                elevatorService.update(1L, updateRequest));
    }

    @Test
    void update_WithValidData_ShouldReturnUpdatedElevator() {
        Elevator existing = new Elevator();
        existing.setId(1L);
        existing.setRae("OLDRAE");

        when(elevatorRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(communityRepository.existsById(1L)).thenReturn(true);
        when(elevatorRepository.existsByRae("NEWRAE")).thenReturn(false);
        when(elevatorRepository.save(any(Elevator.class))).thenReturn(existing);

        UpdateElevatorRequest updateRequest = new UpdateElevatorRequest();
        updateRequest.setRae("NEWRAE");
        updateRequest.setInstalationYear(2021);
        updateRequest.setCommunityId(1L);

        Elevator result = elevatorService.update(1L, updateRequest);

        assertNotNull(result);
        verify(elevatorRepository).save(any(Elevator.class));
    }

    /* ------------------------ Tests para delete ------------------------ */
    @Test
    void delete_WithNonExistingId_ShouldThrowNoSuchElementException() {
        when(elevatorRepository.existsById(1L)).thenReturn(false);

        assertThrows(NoSuchElementException.class, () -> elevatorService.delete(1L));
    }

    @Test
    void delete_WithExistingId_ShouldCallRepositoryDelete() {
        when(elevatorRepository.existsById(1L)).thenReturn(true);
        doNothing().when(elevatorRepository).deleteById(1L);

        assertDoesNotThrow(() -> elevatorService.delete(1L));
        verify(elevatorRepository).deleteById(1L);
    }

    @Test
    void delete_WithNullId_ShouldThrowException() {
        assertThrows(IllegalArgumentException.class, () -> elevatorService.delete(null));
    }

    /* ------------------------ Métodos de ayuda ------------------------ */
    private static Stream<Arguments> provideInvalidCreateRequests() {
        return Stream.of(
                Arguments.of("Request nulo",
                        null,
                        IllegalArgumentException.class),

                Arguments.of("Request vacío",
                        new CreateElevatorRequest(),
                        IllegalArgumentException.class),

                Arguments.of("RAE nulo",
                        createRequestWith(null, 2020, 1L),
                        IllegalArgumentException.class),

                Arguments.of("RAE vacío",
                        createRequestWith("", 2020, 1L),
                        IllegalArgumentException.class),

                Arguments.of("Año de instalación nulo",
                        createRequestWith("RAE123", null, 1L),
                        IllegalArgumentException.class),

                Arguments.of("ID de comunidad nulo",
                        createRequestWith("RAE123", 2020, null),
                        IllegalArgumentException.class),

                Arguments.of("RAE demasiado largo",
                        createRequestWith("A".repeat(256), 2020, 1L),
                        IllegalArgumentException.class),

                Arguments.of("Año de instalación inválido (muy bajo)",
                        createRequestWith("RAE123", 1800, 1L),
                        IllegalArgumentException.class),

                Arguments.of("Año de instalación inválido (futuro)",
                        createRequestWith("RAE123", Year.now().getValue() + 1, 1L),
                        IllegalArgumentException.class)
        );
    }

    private static Stream<Arguments> provideInvalidUpdateRequests() {
        return Stream.of(
                Arguments.of("ID nulo",
                        null,
                        createRequestWith("RAE123", 2020, 1L),
                        IllegalArgumentException.class),

                Arguments.of("Request nulo",
                        1L,
                        null,
                        IllegalArgumentException.class),

                Arguments.of("RAE nulo",
                        1L,
                        createRequestWith(null, 2020, 1L),
                        IllegalArgumentException.class),

                Arguments.of("ID de comunidad nulo",
                        1L,
                        createRequestWith("RAE123", 2020, null),
                        IllegalArgumentException.class),

                Arguments.of("ID de ascensor no existente",
                        999L,
                        createRequestWith("RAE123", 2020, 1L),
                        NoSuchElementException.class)
        );
    }

    private static CreateElevatorRequest createRequestWith(String rae, Integer year, Long communityId) {
        CreateElevatorRequest request = new CreateElevatorRequest();
        request.setRae(rae);
        request.setInstalationYear(year);
        request.setCommunityId(communityId);
        return request;
    }
}