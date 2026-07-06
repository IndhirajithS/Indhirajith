package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.example.demo.entity.UserRole;
import lombok.Data;

@Data
public class RegisterDto {
    @NotBlank(message = "Username cannot be empty")
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 6, max = 100)
    private String password;

    @NotNull(message = "Role is required")
    private UserRole role;
}