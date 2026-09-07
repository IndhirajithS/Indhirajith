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
        seedUserIfNotExists("director", "director@draftdash.com", "password123", UserRole.PROJECT_DIRECTOR);
        seedUserIfNotExists("director_user", "director_user@draftdash.com", "password123", UserRole.PROJECT_DIRECTOR);
        seedUserIfNotExists("creator_user", "creator_user@draftdash.com", "password123", UserRole.CONTENT_CREATOR);
        seedUserIfNotExists("reviewer_user", "reviewer_user@draftdash.com", "password123", UserRole.QUALITY_REVIEWER);
    }

    private void seedUserIfNotExists(String username, String email, String password, UserRole role) {
        if (!userRepository.existsByUsername(username)) {
            SystemUser user = SystemUser.builder()
                    .username(username)
                    .email(email)
                    .passwordHash(passwordEncoder.encode(password))
                    .role(role)
                    .isActive(true)
                    .build();
            userRepository.save(user);
        }
    }
}