package com.sterma.back.dtos.auth.signup;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignUpRequest {
    private String username;
    private String password;
    private String name;
    private String surname;
}
