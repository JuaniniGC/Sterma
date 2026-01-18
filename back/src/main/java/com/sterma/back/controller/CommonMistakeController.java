package com.sterma.back.controller;

import com.sterma.back.dtos.commonMistakes.CommonMistakeCreateRequest;
import com.sterma.back.dtos.community.CreateCommunityRequest;
import com.sterma.back.models.CommonMistake;
import com.sterma.back.models.Community;
import com.sterma.back.services.CommonMistakeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/mistake")
public class CommonMistakeController {

    private CommonMistakeService commonMistakeService;

    public CommonMistakeController(CommonMistakeService commonMistakeService) {
        this.commonMistakeService = commonMistakeService;
    }

    @PostMapping
    public ResponseEntity<?> createCommunity(@RequestBody @Valid CommonMistakeCreateRequest request) {
        try {
            CommonMistake commonMistake = commonMistakeService.createCommonMistake(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(commonMistake);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado: " + e.getMessage());
        }
    }
}
