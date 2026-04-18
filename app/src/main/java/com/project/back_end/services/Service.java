package com.project.back_end.services;

import com.project.back_end.models.Admin;
import com.project.back_end.models.Doctor;
import com.project.back_end.models.Patient;
import com.project.back_end.repo.AdminRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@org.springframework.stereotype.Service
public class Service {

    private final TokenService tokenService;
    private final AdminRepository adminRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DoctorService doctorService;
    private final PatientService patientService;

    public Service(TokenService tokenService,
                   AdminRepository adminRepository,
                   DoctorRepository doctorRepository,
                   PatientRepository patientRepository,
                   DoctorService doctorService,
                   PatientService patientService) {
        this.tokenService = tokenService;
        this.adminRepository = adminRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.doctorService = doctorService;
        this.patientService = patientService;
    }

    public ResponseEntity<Map<String, String>> validateToken(String token, String role) {
        Map<String, String> response = new HashMap<>();
        boolean valid = tokenService.validateToken(token, role);
        if (!valid) {
            response.put("message", "Invalid or expired token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        return null;
    }

    public ResponseEntity<Map<String, Object>> validateAdmin(Admin admin) {
        Map<String, Object> response = new HashMap<>();
        try {
            Admin found = adminRepository.findByUsername(admin.getUsername());
            if (found == null || found.getPasswordHash() == null || admin.getPasswordHash() == null) {
                response.put("message", "Invalid credentials");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            if (!found.getPasswordHash().equals(admin.getPasswordHash())) {
                response.put("message", "Invalid credentials");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            String token = tokenService.generateToken(found.getUsername());
            response.put("token", token);
            response.put("message", "Login successful");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    public ResponseEntity<Map<String, Object>> filterDoctor(String name, String time, String specialty) {
        Map<String, Object> response = new HashMap<>();
        List<Doctor> doctors;

        boolean hasName = name != null && !name.equals("null") && !name.isBlank();
        boolean hasTime = time != null && !time.equals("null") && !time.isBlank();
        boolean hasSpecialty = specialty != null && !specialty.equals("null") && !specialty.isBlank();

        if (hasName && hasTime && hasSpecialty) {
            doctors = doctorService.filterDoctorsByNameSpecialtyAndTime(name, specialty, time);
        } else if (hasName && hasTime) {
            doctors = doctorService.filterDoctorByNameAndTime(name, time);
        } else if (hasName && hasSpecialty) {
            doctors = doctorService.filterDoctorByNameAndSpecialty(name, specialty);
        } else if (hasTime && hasSpecialty) {
            doctors = doctorService.filterDoctorByTimeAndSpecialty(specialty, time);
        } else if (hasName) {
            doctors = doctorService.findDoctorByName(name);
        } else if (hasTime) {
            doctors = doctorService.filterDoctorsByTime(time);
        } else if (hasSpecialty) {
            doctors = doctorService.filterDoctorBySpecialty(specialty);
        } else {
            doctors = doctorService.getDoctors();
        }

        response.put("doctors", doctors);
        return ResponseEntity.ok(response);
    }

    public int validateAppointment(Long doctorId, String appointmentTime) {
        try {
            Doctor doctor = doctorRepository.findById(doctorId).orElse(null);
            if (doctor == null) return -1;

            List<String> slots = doctor.getAvailableTimes();
            if (slots == null || slots.isEmpty()) return 0;

            String requestedTime = LocalDateTime.parse(appointmentTime)
                    .toLocalTime()
                    .withSecond(0)
                    .withNano(0)
                    .toString();
            if (requestedTime.length() > 5) {
                requestedTime = requestedTime.substring(0, 5);
            }

            for (String slot : slots) {
                String[] parts = slot.split("-");
                if (parts.length > 0 && parts[0].equals(requestedTime)) {
                    return 1;
                }
            }
            return 0;
        } catch (DateTimeParseException e) {
            return 0;
        } catch (Exception e) {
            return 0;
        }
    }

    public boolean validatePatient(Patient patient) {
        Patient found = patientRepository.findByEmailOrPhone(patient.getEmail(), patient.getPhone());
        return found == null;
    }

    public ResponseEntity<Map<String, Object>> validatePatientLogin(String email, String password) {
        Map<String, Object> response = new HashMap<>();
        try {
            Patient patient = patientRepository.findByEmail(email);
            if (patient == null || patient.getPassword() == null || password == null) {
                response.put("message", "Invalid credentials");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            if (!patient.getPassword().equals(password)) {
                response.put("message", "Invalid credentials");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            String token = tokenService.generateToken(email);
            response.put("token", token);
            response.put("message", "Login successful");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    public ResponseEntity<Map<String, Object>> filterPatient(String condition, String name, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            String email = tokenService.extractEmail(token);
            Patient patient = patientRepository.findByEmail(email);
            if (patient == null) {
                response.put("message", "Patient not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            Long patientId = patient.getPatientId();

            boolean hasCondition = condition != null && !condition.equals("null") && !condition.isBlank();
            boolean hasName = name != null && !name.equals("null") && !name.isBlank();

            if (hasCondition && hasName) {
                return patientService.filterByDoctorAndCondition(patientId, name, condition);
            } else if (hasCondition) {
                return patientService.filterByCondition(patientId, condition);
            } else if (hasName) {
                return patientService.filterByDoctor(patientId, name);
            } else {
                return patientService.getPatientAppointment(patientId, token);
            }
        } catch (Exception e) {
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
