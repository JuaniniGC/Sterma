package com.sterma.back.services;

import com.sterma.back.dtos.community.CreateCommunityRequest;
import com.sterma.back.dtos.community.UpdateCommunityRequest;
import com.sterma.back.models.*;
import com.sterma.back.repositories.CommunityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommunityServiceTest {

    @Mock
    private CommunityRepository communityRepository;

    @InjectMocks
    private CommunityService communityService;

    private CreateCommunityRequest validRequest;
    private UpdateCommunityRequest updateRequest;
    private Community sampleCommunity;

    @BeforeEach
    void setUp() {
        validRequest = new CreateCommunityRequest();
        validRequest.setName("Comunidad Las Rosas");
        validRequest.setDescription("Comunidad de prueba");
        validRequest.setCIF("CIF123");
        validRequest.setCity("Madrid");
        validRequest.setPostalCode("28001");
        validRequest.setStreet("Gran Vía 1");
        validRequest.setCommunityLeaderName("Juan Pérez");
        validRequest.setCommunityLeaderTelephone("600123456");
        validRequest.setCommunityLeaderNote("Disponible por las tardes");

        updateRequest = new UpdateCommunityRequest();
        updateRequest.setName("Comunidad Actualizada");
        updateRequest.setDescription("Descripción nueva");
        updateRequest.setCIF("CIF456");
        updateRequest.setCity("Barcelona");
        updateRequest.setPostalCode("08001");
        updateRequest.setStreet("Diagonal 123");
        updateRequest.setCommunityLeaderName("Ana López");
        updateRequest.setCommunityLeaderTelephone("611222333");
        updateRequest.setCommunityLeaderNote("Reuniones los lunes");

        Localization localization = Localization.builder()
                .city("Madrid")
                .postalCode("28001")
                .street("Gran Vía 1")
                .build();

        CommunityLeaderInfo leaderInfo = CommunityLeaderInfo.builder()
                .communityLeaderName("Juan Pérez")
                .communityLeaderTelephone("600123456")
                .communityLeaderNote("Disponible por las tardes")
                .build();

        sampleCommunity = Community.builder()
                .id(1L)
                .name("Comunidad Las Rosas")
                .description("Comunidad de prueba")
                .CIF("CIF123")
                .localization(localization)
                .communityLeaderInfo(leaderInfo)
                .build();
    }

    /* ------------------------ Tests para listAll ------------------------ */
    @Test
    void listAll_WithName_ShouldCallFindByNameContainingIgnoreCase() {
        Page<Community> expectedPage = new PageImpl<>(List.of(sampleCommunity));
        when(communityRepository.findByNameContainingIgnoreCase(eq("Rosas"), any(Pageable.class)))
                .thenReturn(expectedPage);

        Page<Community> result = communityService.listAll("Rosas", Pageable.unpaged());

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(communityRepository).findByNameContainingIgnoreCase(eq("Rosas"), any(Pageable.class));
        verify(communityRepository, never()).findAll(any(Pageable.class));
    }

    @Test
    void listAll_WithBlankName_ShouldCallFindAll() {
        Page<Community> expectedPage = new PageImpl<>(List.of(sampleCommunity));
        when(communityRepository.findAll(any(Pageable.class))).thenReturn(expectedPage);

        Page<Community> result = communityService.listAll("   ", Pageable.unpaged());

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(communityRepository).findAll(any(Pageable.class));
    }

    @Test
    void listAll_WithNullName_ShouldCallFindAll() {
        Page<Community> expectedPage = new PageImpl<>(List.of(sampleCommunity));
        when(communityRepository.findAll(any(Pageable.class))).thenReturn(expectedPage);

        Page<Community> result = communityService.listAll(null, Pageable.unpaged());

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(communityRepository).findAll(any(Pageable.class));
    }

    @Test
    void listAll_WithEmptyResult_ShouldReturnEmptyPage() {
        when(communityRepository.findAll(any(Pageable.class))).thenReturn(Page.empty());

        Page<Community> result = communityService.listAll(null, Pageable.unpaged());

        assertTrue(result.isEmpty());
    }

    /* ------------------------ Tests para getById ------------------------ */
    @Test
    void getById_WithExistingId_ShouldReturnCommunity() {
        when(communityRepository.findById(1L)).thenReturn(Optional.of(sampleCommunity));

        Optional<Community> result = communityService.getById(1L);

        assertTrue(result.isPresent());
        assertEquals("Comunidad Las Rosas", result.get().getName());
    }

    @Test
    void getById_WithNonExistingId_ShouldReturnEmpty() {
        when(communityRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<Community> result = communityService.getById(99L);

        assertTrue(result.isEmpty());
    }

    /* ------------------------ Tests para create ------------------------ */
    @Test
    void createCommunity_WithValidData_ShouldReturnSavedCommunity() {
        when(communityRepository.save(any(Community.class))).thenReturn(sampleCommunity);

        Community result = communityService.createCommunity(validRequest);

        assertNotNull(result);
        assertEquals("Comunidad Las Rosas", result.getName());
        verify(communityRepository).save(any(Community.class));
    }

    /* ------------------------ Tests para update ------------------------ */
    @Test
    void updateCommunity_WithValidId_ShouldUpdateAndSave() {
        when(communityRepository.existsById(1L)).thenReturn(true);
        when(communityRepository.findById(1L)).thenReturn(Optional.of(sampleCommunity));
        when(communityRepository.save(any(Community.class))).thenReturn(sampleCommunity);

        Community result = communityService.updateCommunity(1L, updateRequest);

        assertNotNull(result);
        assertEquals("Comunidad Actualizada", result.getName());
        assertEquals("Barcelona", result.getLocalization().getCity());
        verify(communityRepository).save(any(Community.class));
    }

    @Test
    void updateCommunity_WithNonExistingId_ShouldThrowNoSuchElementException() {
        when(communityRepository.existsById(99L)).thenReturn(false);

        assertThrows(NoSuchElementException.class, () ->
                communityService.updateCommunity(99L, updateRequest));
    }

    @Test
    void updateCommunity_WithNullId_ShouldThrowIllegalArgumentException() {
        assertThrows(IllegalArgumentException.class, () ->
                communityService.updateCommunity(null, updateRequest));
    }

    /* ------------------------ Tests para checkCommunityExists ------------------------ */
    @Test
    void checkCommunityExists_WithNonExistingCommunity_ShouldThrowNoSuchElementException() {
        when(communityRepository.existsById(1L)).thenReturn(false);

        assertThrows(NoSuchElementException.class, () ->
                communityService.updateCommunity(1L, updateRequest));
    }

    /* ------------------------ Tests adicionales ------------------------ */
    @Test
    void createCommunity_ShouldMapFieldsCorrectly() {
        when(communityRepository.save(any(Community.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Community result = communityService.createCommunity(validRequest);

        assertEquals("Madrid", result.getLocalization().getCity());
        assertEquals("Juan Pérez", result.getCommunityLeaderInfo().getCommunityLeaderName());
        assertEquals("CIF123", result.getCIF());
    }
}
