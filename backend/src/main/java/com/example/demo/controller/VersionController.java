package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/versions")
public class VersionController {

    @GetMapping("/{id}")
    public ResponseEntity<Void> getVersion(@PathVariable("id") Long id) {
        return ResponseEntity.ok().build();
    }
}
