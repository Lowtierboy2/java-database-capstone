package com.project.back_end.controllers;

import com.project.back_end.DTO.Login;
import com.project.back_end.models.Doctor;
import com.project.back_end.services.DoctorService;
import com.project.back_end.services.Service;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.path}doctor")
public class DoctorController {

    private final DoctorService doctorService;
    private final Service service;

    public DoctorController(DoctorService doctorService, Service service) {
        this.doctorService = doctorService;
        this.service = service;
    }

    @GetMapping("/availability/{userType}/{doctorId}/{date}/{token}")
    public ResponseEntity<?> getDoctorAvailability(@PathVariable String userType,
                                                   @PathVariable Long doctorId,
                                                   @PathVariable String date,
                                                   @PathVariable String token) {
        ResponseEntity<Map<String, String>> tokenCheck = service.validateToken(token, userType);
        if (tokenCheck != null) return tokenCheck;
        return doctorService.getDoctorAvailability(doctorId, date);
    }

    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getDoctor() {
        Map<String, Object> response = new HashMap<>();
        List<Doctor> doctors = doctorService.getDoctors();
        response.put("doctors", doctors);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/add/{token}")
    public ResponseEntity<Map<String, String>> saveDoctor(@Valid @RequestBody Doctor doctor,
                                                          @PathVariable String token) {
        Map<String, String> response = new HashMap<>();
        ResponseEntity<Map<String, String>> tokenCheck = service.validateToken(token, "admin");
        if (tokenCheck != null) return tokenCheck;

        int result = doctorService.saveDoctor(doctor);
        if (result == 1) {
            response.put("message", "Doctor added successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else if (result == -1) {
            response.put("message", "Doctor already exists");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } else {
            response.put("message", "Failed to add doctor");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> doctorLogin(@Valid @RequestBody Login login) {
        return doctorService.validateDoctor(login.getEmail(), login.getPassword());
    }

    @PutMapping("/update/{token}")
    public ResponseEntity<Map<String, String>> updateDoctor(@Valid @RequestBody Doctor doctor,
                                                            @PathVariable String token) {
        Map<String, String> response = new HashMap<>();
        ResponseEntity<Map<String, String>> tokenCheck = service.validateToken(token, "admin");
        if (tokenCheck != null) return tokenCheck;

        int result = doctorService.updateDoctor(doctor);
        if (result == 1) {
            response.put("message", "Doctor updated successfully");
            return ResponseEntity.ok(response);
        } else if (result == -1) {
            response.put("message", "Doctor not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } else {
            response.put("message", "Failed to update doctor");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/delete/{id}/{token}")
    public ResponseEntity<Map<String, String>> deleteDoctor(@PathVariable Long id,
                                                            @PathVariable String token) {
        Map<String, String> response = new HashMap<>();
        ResponseEntity<Map<String, String>> tokenCheck = service.validateToken(token, "admin");
        if (tokenCheck != null) return tokenCheck;

        int result = doctorService.deleteDoctor(id);
        if (result == 1) {
            response.put("message", "Doctor deleted successfully");
            return ResponseEntity.ok(response);
        } else if (result == -1) {
            response.put("message", "Doctor not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } else {
            response.put("message", "Failed to delete doctor");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/filter/{name}/{time}/{speciality}")
    public ResponseEntity<Map<String, Object>> filter(@PathVariable String name,
                                                      @PathVariable String time,
                                                      @PathVariable String speciality) {
        return service.filterDoctor(name, time, speciality);
    }
}