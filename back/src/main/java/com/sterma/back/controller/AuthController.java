package com.sterma.back.controller;

import com.sterma.back.dtos.auth.login.JwtResponse;
import com.sterma.back.dtos.auth.login.LoginRequest;
import com.sterma.back.dtos.auth.signup.SignUpRequest;
import com.sterma.back.dtos.auth.signup.SignUpResponse;
import com.sterma.back.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest request) {
        try {
            String token = authService.login(request.getUsername(), request.getPassword());
            return ResponseEntity.ok(new JwtResponse(token));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Unauthorized: " + e.getMessage());
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody @Valid SignUpRequest request){
        try{
            SignUpResponse response = authService.register(request.getUsername(), request.getPassword(), request.getName(), request.getSurname());
            return ResponseEntity.ok(response);
        }catch (Exception e){
            return ResponseEntity.status(401).body("Unauthorized: " + e.getMessage());
        }
    }

}
