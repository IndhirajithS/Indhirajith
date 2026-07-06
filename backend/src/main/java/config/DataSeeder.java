package com.example.demo.component;

import com.example.demo.entity.SystemUser;
import com.example.demo.entity.UserRole;
import com.example.demo.repository.SystemUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    private final SystemUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(SystemUserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            SystemUser admin = SystemUser.builder()
                    .username("director")
                    .email("director@draftdash.internal")
                    .passwordHash(passwordEncoder.encode("SecureDirectorPass123!"))
                    .role(UserRole.PROJECT_DIRECTOR)
                    .isActive(true)
                    .build();
            userRepository.save(admin);

            SystemUser creator = SystemUser.builder()
                    .username("creator")
                    .email("creator@draftdash.internal")
                    .passwordHash(passwordEncoder.encode("SecureCreatorPass123!"))
                    .role(UserRole.CONTENT_CREATOR)
                    .isActive(true)
                    .build();
            userRepository.save(creator);

            SystemUser reviewer = SystemUser.builder()
                    .username("reviewer")
                    .email("reviewer@draftdash.internal")
                    .passwordHash(passwordEncoder.encode("SecureReviewerPass123!"))
                    .role(UserRole.QUALITY_REVIEWER)
                    .isActive(true)
                    .build();
            userRepository.save(reviewer);
        }
    }
}