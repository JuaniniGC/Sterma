package com.sterma.back.config;

import com.sterma.back.security.JwtAuthenticationFilter;
import com.sterma.back.security.JwtAuthenticationEntryPoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final JwtAuthenticationEntryPoint jwtEntryPoint;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, JwtAuthenticationEntryPoint jwtEntryPoint) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.jwtEntryPoint = jwtEntryPoint;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtEntryPoint))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/login**", "/h2-console/**", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/auth/signup**").hasRole("MANAGEMENT")
                        .requestMatchers("/mistake/**").hasAnyRole("MANAGEMENT", "TECHNICIAN")
                        .requestMatchers(HttpMethod.DELETE, "/community/**").hasRole("MANAGEMENT")
                        .requestMatchers(HttpMethod.POST, "/community/**").hasRole("MANAGEMENT")
                        .requestMatchers("/community/**").hasAnyRole("MANAGEMENT", "TECHNICIAN")
                        .requestMatchers(HttpMethod.DELETE, "/elevator/**").hasRole("MANAGEMENT")
                        .requestMatchers(HttpMethod.POST, "/elevator/**").hasRole("MANAGEMENT")
                        .requestMatchers("/elevator/**").hasAnyRole("MANAGEMENT", "TECHNICIAN")
                        .requestMatchers("/report/**").hasAnyRole("MANAGEMENT", "TECHNICIAN")
                        .anyRequest().authenticated()
                );

        http.headers(headers -> headers.frameOptions(frame -> frame.sameOrigin())); 

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
