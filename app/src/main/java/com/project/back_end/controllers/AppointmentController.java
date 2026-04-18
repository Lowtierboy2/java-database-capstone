package com.project.back_end.controllers;

import com.project.back_end.models.Appointment;
import com.project.back_end.services.AppointmentService;
import com.project.back_end.services.Service;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("${api.path}appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final Service service;

    public AppointmentController(AppointmentService appointmentService, Service service) {
        this.appointmentService = appointmentService;
        this.service = service;
    }

    @GetMapping("/{date}/{patientName}/{token}")
    public ResponseEntity<?> getAppointments(@PathVariable String date,
                                             @PathVariable String patientName,
                                             @PathVariable String token) {
        ResponseEntity<Map<String, String>> tokenCheck = service.validateToken(token, "doctor");
        if (tokenCheck != null) return tokenCheck;
        return appointmentService.getAppointments(date, patientName, token);
    }

    @PostMapping("/{token}")
    public ResponseEntity<Map<String, String>> bookAppointment(@Valid @RequestBody Appointment appointment,
                                                               @PathVariable String token) {
        ResponseEntity<Map<String, String>> tokenCheck = service.validateToken(token, "patient");
        if (tokenCheck != null) return tokenCheck;

        Map<String, String> response = new HashMap<>();
        if (appointment.getDoctor() == null || appointment.getDoctor().getDoctorId() == null
                || appointment.getPatient() == null || appointment.getPatient().getPatientId() == null
                || appointment.getAppointmentTime() == null) {
            response.put("message", "Invalid appointment payload");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        int valid = service.validateAppointment(
                appointment.getDoctor().getDoctorId(),
                appointment.getAppointmentTime().toString());

        if (valid == -1) {
            response.put("message", "Doctor not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        if (valid == 0) {
            response.put("message", "Time slot not available");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        int result = appointmentService.bookAppointment(appointment);
        if (result == 1) {
            response.put("message", "Appointment booked successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
        response.put("message", "Failed to book appointment");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @PutMapping("/{token}")
    public ResponseEntity<Map<String, String>> updateAppointment(@Valid @RequestBody Appointment appointment,
                                                                 @PathVariable String token) {
        ResponseEntity<Map<String, String>> tokenCheck = service.validateToken(token, "patient");
        if (tokenCheck != null) return tokenCheck;

        if (appointment.getAppointmentId() == null || appointment.getDoctor() == null
                || appointment.getDoctor().getDoctorId() == null || appointment.getAppointmentTime() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Invalid appointment payload"));
        }

        return appointmentService.updateAppointment(appointment, token);
    }

    @DeleteMapping("/{id}/{token}")
    public ResponseEntity<Map<String, String>> cancelAppointment(@PathVariable Long id,
                                                                 @PathVariable String token) {
        ResponseEntity<Map<String, String>> tokenCheck = service.validateToken(token, "patient");
        if (tokenCheck != null) return tokenCheck;
        return appointmentService.cancelAppointment(id, token);
    }
}
