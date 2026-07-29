package com.example.demo.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VersionCompareDto {
    private VersionResponseDto versionA;
    private VersionResponseDto versionB;
    private int wordCountA;
    private int wordCountB;
    private int wordCountDelta;
    private double changePercentage;
}
