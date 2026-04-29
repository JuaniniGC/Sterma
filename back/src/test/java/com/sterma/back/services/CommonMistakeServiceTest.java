package com.sterma.back.services;

import com.sterma.back.dtos.commonMistakes.CommonMistakeCreateRequest;
import com.sterma.back.models.CommonMistake;
import com.sterma.back.repositories.CommonMistakeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommonMistakeServiceTest {

    @Mock
    private CommonMistakeRepository commonMistakeRepository;

    @InjectMocks
    private CommonMistakeService commonMistakeService;

    private CommonMistakeCreateRequest validRequest;
    private CommonMistake savedEntity;

    @BeforeEach
    void setUp() {
        validRequest = new CommonMistakeCreateRequest();
        validRequest.setIdentificator("ERR001");
        validRequest.setDescription("Descripción de prueba");

        savedEntity = CommonMistake.builder()
                .identificator("ERR001")
                .description("Descripción de prueba")
                .build();
    }

    /* ------------------------ Tests para createCommonMistake ------------------------ */

    @Test
    void createCommonMistake_WithExistingIdentificator_ShouldThrowIllegalStateException() {
        when(commonMistakeRepository.existsByIdentificator("ERR001")).thenReturn(true);

        assertThrows(IllegalStateException.class,
                () -> commonMistakeService.createCommonMistake(validRequest));

        verify(commonMistakeRepository, never()).save(any());
    }

    @Test
    void createCommonMistake_WithValidData_ShouldSaveAndReturnEntity() {
        when(commonMistakeRepository.existsByIdentificator("ERR001")).thenReturn(false);
        when(commonMistakeRepository.save(any(CommonMistake.class))).thenReturn(savedEntity);

        CommonMistake result = commonMistakeService.createCommonMistake(validRequest);

        assertNotNull(result);
        assertEquals("ERR001", result.getIdentificator());
        assertEquals("Descripción de prueba", result.getDescription());

        verify(commonMistakeRepository).save(any(CommonMistake.class));
    }


    @ParameterizedTest
    @ValueSource(strings = {"ERR001", "ABC123", "TEST_ID"})
    void createCommonMistake_WithDifferentValidIdentificators_ShouldWork(String identificator) {
        validRequest.setIdentificator(identificator);

        when(commonMistakeRepository.existsByIdentificator(identificator)).thenReturn(false);
        when(commonMistakeRepository.save(any(CommonMistake.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CommonMistake result = commonMistakeService.createCommonMistake(validRequest);

        assertNotNull(result);
        assertEquals(identificator, result.getIdentificator());
    }

    /* ------------------------ Tests para delete ------------------------ */

    @Test
    void delete_WithNullId() {
        assertThrows(IllegalArgumentException.class,
                () -> commonMistakeService.delete(null));

        verify(commonMistakeRepository, never()).deleteById(any());
    }

    @Test
    void delete_WithNonExistingId() {
        Long id = 1L;

        when(commonMistakeRepository.existsById(id)).thenReturn(false);

        assertThrows(NoSuchElementException.class,
                () -> commonMistakeService.delete(id));

        verify(commonMistakeRepository, never()).deleteById(any());
    }

    @Test
    void delete_WithExistingId() {
        Long id = 1L;

        when(commonMistakeRepository.existsById(id)).thenReturn(true);
        doNothing().when(commonMistakeRepository).deleteById(id);

        assertDoesNotThrow(() -> commonMistakeService.delete(id));

        verify(commonMistakeRepository).existsById(id);
        verify(commonMistakeRepository).deleteById(id);
    }

}