package com.project.back_end.controllers;

import com.project.back_end.DTO.Login;
import com.project.back_end.models.Patient;
import com.project.back_end.services.PatientService;
import com.project.back_end.services.Service;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("${api.path}patient")
public class PatientController {

    private final PatientService patientService;
    private final Service service;

    public PatientController(PatientService patientService, Service service) {
        this.patientService = patientService;
        this.service = service;
    }

    @GetMapping("/{token}")
    public ResponseEntity<Map<String, Object>> getPatient(@PathVariable String token) {
        ResponseEntity<Map<String, String>> tokenCheck = service.validateToken(token, "patient");
        if (tokenCheck != null) {
            return ResponseEntity.status(tokenCheck.getStatusCode())
                    .body(Map.of("message", "Unauthorized"));
        }
        return patientService.getPatientDetails(token);
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> createPatient(@Valid @RequestBody Patient patient) {
        Map<String, String> response = new HashMap<>();
        if (!service.validatePatient(patient)) {
            response.put("message", "Patient already exists");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
        int result = patientService.createPatient(patient);
        if (result == 1) {
            response.put("message", "Patient created successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
        response.put("message", "Failed to create patient");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Login login) {
        return service.validatePatientLogin(login.getEmail(), login.getPassword());
    }

    @GetMapping("/{id}/{userType}/{token}")
    public ResponseEntity<Map<String, Object>> getPatientAppointment(@PathVariable Long id,
                                                                     @PathVariable String userType,
                                                                     @PathVariable String token) {
        ResponseEntity<Map<String, String>> tokenCheck = service.validateToken(token, userType);
        if (tokenCheck != null) {
            return ResponseEntity.status(tokenCheck.getStatusCode())
                    .body(Map.of("message", "Unauthorized"));
        }
        return patientService.getPatientAppointment(id, token);
    }

    @GetMapping("/filter/{condition}/{name}/{token}")
    public ResponseEntity<Map<String, Object>> filterPatientAppointment(@PathVariable String condition,
                                                                        @PathVariable String name,
                                                                        @PathVariable String token) {
        ResponseEntity<Map<String, String>> tokenCheck = service.validateToken(token, "patient");
        if (tokenCheck != null) {
            return ResponseEntity.status(tokenCheck.getStatusCode())
                    .body(Map.of("message", "Unauthorized"));
        }
        return service.filterPatient(condition, name, token);
    }
}
