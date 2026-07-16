package com.example.demo.dto;

import lombok.Data;


@Data
public class WorkspaceResponseDto {
    private Long id;
    private String name;
    private Integer capacityLimit;
    private String ownerUsername;
    private String status;
}