package com.sterma.back.dtos.auth.signup;

import com.sterma.back.dtos.auth.login.JwtResponse;
import com.sterma.back.models.Technician;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SignUpResponse {
    private JwtResponse jwtResponse;
    private String username;
    private String password;
    private String name;
    private String surname;

    public SignUpResponse (Technician technician, String jwt){
        this.jwtResponse = new JwtResponse(jwt);
        this.username = technician.getUsername();
        this.password = technician.getPassword();
        this.name = technician.getName();
        this.surname = technician.getSurnames();
    }
}
