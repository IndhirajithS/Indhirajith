package com.example.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class VersionCompareDto {
    private Long documentId;
    private int version1;
    private int version2;
    private List<String> differences;
}
