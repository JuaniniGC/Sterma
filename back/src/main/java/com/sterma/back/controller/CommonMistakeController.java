package com.sterma.back.controller;

import com.sterma.back.dtos.commonMistakes.CommonMistakeCreateRequest;
import com.sterma.back.dtos.community.CreateCommunityRequest;
import com.sterma.back.models.CommonMistake;
import com.sterma.back.models.Community;
import com.sterma.back.services.CommonMistakeService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/mistake")
public class CommonMistakeController {

    private CommonMistakeService commonMistakeService;

    public CommonMistakeController(CommonMistakeService commonMistakeService) {
        this.commonMistakeService = commonMistakeService;
    }

    @PostMapping
    public ResponseEntity<?> createCommonMistake(@RequestBody @Valid CommonMistakeCreateRequest request) {
        try {
            CommonMistake commonMistake = commonMistakeService.createCommonMistake(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(commonMistake);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<Page<CommonMistake>> getCommonMistakes(Pageable pageable) {
        Page<CommonMistake> commonMistakes =
                commonMistakeService.getAllCommonMistakes(pageable);
        return ResponseEntity.ok(commonMistakes);
    }

}
