package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.example.demo.entity.MemberRole;
import lombok.Data;

@Data
public class MemberInviteDto {
    @NotBlank(message = "Username is required")
    private String username;

    @NotNull(message = "Role is required")
    private MemberRole memberRole;
}