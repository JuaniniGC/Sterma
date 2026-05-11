package com.sterma.back.controller;

import com.sterma.back.dtos.auth.login.JwtResponse;
import com.sterma.back.dtos.auth.login.LoginRequest;
import com.sterma.back.dtos.auth.signup.SignUpRequest;
import com.sterma.back.dtos.auth.signup.SignUpResponse;
import com.sterma.back.services.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Auth", description = "Autenticación y registro de usuarios")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "Login de usuario", description = "Autentica un usuario y devuelve un token JWT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login correcto",
                    content = @Content(schema = @Schema(implementation = JwtResponse.class))),
            @ApiResponse(responseCode = "401", description = "Credenciales incorrectas", content = @Content)
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Credenciales de usuario",
                    required = true,
                    content = @Content(schema = @Schema(implementation = LoginRequest.class))
            )
            @RequestBody @Valid LoginRequest request) {
        try {
            String token = authService.login(request.getUsername(), request.getPassword());
            return ResponseEntity.ok(new JwtResponse(token));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Unauthorized: " + e.getMessage());
        }
    }

    @Operation(summary = "Registro de usuario", description = "Registra un nuevo usuario en el sistema")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario registrado correctamente",
                    content = @Content(schema = @Schema(implementation = SignUpResponse.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content),
            @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
            @ApiResponse(responseCode = "409", description = "Usuario ya existente", content = @Content)
    })
    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos de registro",
                    required = true,
                    content = @Content(schema = @Schema(implementation = SignUpRequest.class))
            )
            @RequestBody @Valid SignUpRequest request){
        try{
            SignUpResponse response = authService.register(
                    request.getUsername(),
                    request.getPassword(),
                    request.getName(),
                    request.getSurname()
            );
            return ResponseEntity.ok(response);
        }catch (Exception e){
            return ResponseEntity.status(401).body("Unauthorized: " + e.getMessage());
        }
    }
}