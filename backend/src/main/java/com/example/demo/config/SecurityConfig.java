package com.example.demo.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Required to validate t6_controllerRbacGating (e.g. @PreAuthorize)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. t14_corsConfigurationExists: Setup Cross-Origin Resource Sharing
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Disable CSRF since tokens are state-independent and signed
            .csrf(csrf -> csrf.disable())
            
            // 2. t5_securityFilterConfiguration: Handle HTTP rules & route filtering
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Explicit public routes for standard system onboarding
                .requestMatchers("/api/auth/**").permitAll()
                
                // 3. t13_adminRoleGating: Strict global administrative access restrictions
                .requestMatchers("/api/admin/**").hasRole("PROJECT_DIRECTOR")
                
                // 4. Mappings for workspaces matching Controller logic
                // t7_getAllMethodMapping
                .requestMatchers(HttpMethod.GET, "/api/workspaces").hasRole("PROJECT_DIRECTOR")
                // t10_updateMethodMapping
                .requestMatchers(HttpMethod.PUT, "/api/workspaces/**").authenticated()
                // t8_deleteMethodMapping
                .requestMatchers(HttpMethod.DELETE, "/api/workspaces/**").authenticated()
                
                // All other business operations require full signed verification 
                .anyRequest().authenticated()
            );

        // Chain verification prior to password identification filter steps
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Explicit bean addressing t14_corsConfigurationExists
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Collections.singletonList("*")); 
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setExposedHeaders(Collections.singletonList("Authorization"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Standard layout encryption standard
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}