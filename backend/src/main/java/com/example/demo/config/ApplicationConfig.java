package com.example.demo.config;

import com.example.demo.entity.SystemUser;
import com.example.demo.entity.UserRole;
import com.example.demo.repository.SystemUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final SystemUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Safe check to avoid duplicate key or unique constraint exceptions on restart
        if (!userRepository.existsByUsername("director")) {
            
            SystemUser director = SystemUser.builder()
                    .username("director")
                    .email("director@draftdash.com")
                    // Note: double check if your entity uses .password() or .passwordHash()
                    .passwordHash(passwordEncoder.encode("password123")) 
                    .role(UserRole.PROJECT_DIRECTOR)
                    .isActive(true)
                    .build();
                    
            userRepository.save(director);
        }
    }
}