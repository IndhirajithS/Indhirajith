package com.example.demo.service;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.entity.SystemUser;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.repository.SystemUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.create.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final SystemUserRepository systemUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService; 
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponseDto register(RegisterDto dto) {
        if (systemUserRepository.existsByUsername(dto.getUsername())) {
            throw new BusinessValidationException("Username is already taken");
        }
        SystemUser user = SystemUser.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .passwordHash(passwordEncoder.encode(dto.getPassword()))
                .role(dto.getRole())
                .isActive(true)
                .build();

        systemUserRepository.save(user);
        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponseDto(token, user.getUsername(), user.getRole().name());
    }

    public AuthResponseDto authenticate(AuthRequestDto dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword())
        );
        SystemUser user = systemUserRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new BusinessValidationException("Invalid credentials"));
        
        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponseDto(token, user.getUsername(), user.getRole().name());
    }
}