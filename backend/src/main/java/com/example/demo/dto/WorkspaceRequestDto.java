package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class WorkspaceRequestDto {
    @NotBlank(message = "Workspace name is required")
    private String name;

    @NotNull(message = "Capacity limit is required")
    @Positive(message = "Capacity must be greater than zero")
    private Integer capacityLimit;
}