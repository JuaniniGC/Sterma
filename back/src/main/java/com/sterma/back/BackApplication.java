package com.sterma.back;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@OpenAPIDefinition(
		info = @Info(
				title = "Microservicio nameMS",
				version = "1.0.3",
				description = "APIs Swagger Microservicio nameMS",
				contact = @Contact(
						name = "MS-nameMS",
						url = "https://tudominio.com",
						email = "email@tudominio.com"
				),
				license = @License(name = "Apache 2.0")
		),
		servers = {
				@Server(description = "Ambiente local", url = "http://localhost:8080")
		},
		security = {
				@SecurityRequirement(name = "bearerAuth")
		}
)
@SecurityScheme(
		name = "bearerAuth",
		type = SecuritySchemeType.HTTP,
		scheme = "bearer",
		bearerFormat = "JWT",
		in = SecuritySchemeIn.HEADER
)

@SpringBootApplication
public class BackApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackApplication.class, args);
	}
}