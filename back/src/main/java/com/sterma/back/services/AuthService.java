package com.sterma.back.services;

import ch.qos.logback.core.CoreConstants;
import com.sterma.back.dtos.auth.signup.SignUpResponse;
import com.sterma.back.models.Technician;
import com.sterma.back.models.TechnicianRole;
import com.sterma.back.repositories.TechnicianRepository;
import com.sterma.back.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final TechnicianRepository technicianRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(TechnicianRepository technicianRepository, JwtUtil jwtUtil) {
        this.technicianRepository = technicianRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public SignUpResponse register(String username, String rawPassword, String name, String surname) {
        try {
            String encodedPassword = passwordEncoder.encode(rawPassword);
            Technician technician = new Technician();
            technician.setUsername(username);
            technician.setPassword(encodedPassword);
            technician.setName(name);
            technician.setSurnames(surname);
            technician.setRole(TechnicianRole.TECHNICIAN);

            Technician createdTechnician = technicianRepository.save(technician);
            System.out.println("ID creada: " + createdTechnician.getId());

            String jwt = jwtUtil.generateToken(username, TechnicianRole.TECHNICIAN);
            return new SignUpResponse(createdTechnician, jwt);

        } catch (Exception e) {
            System.err.println("❌ Error al registrar el técnico: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public String login(String username, String rawPassword) throws Exception {
        Technician user = technicianRepository.findByUsername(username)
                .orElseThrow(() -> new Exception("Usuario no encontrado"));
        if (passwordEncoder.matches(rawPassword, user.getPassword())) {
            return jwtUtil.generateToken(username, user.getRole());
        } else {
            throw new Exception("Contraseña incorrecta");
        }
    }
}
