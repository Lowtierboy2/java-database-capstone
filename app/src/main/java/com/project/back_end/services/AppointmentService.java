package com.project.back_end.services;

import com.project.back_end.DTO.AppointmentDTO;
import com.project.back_end.models.Appointment;
import com.project.back_end.models.Doctor;
import com.project.back_end.models.Patient;
import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final TokenService tokenService;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              TokenService tokenService,
                              PatientRepository patientRepository,
                              DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.tokenService = tokenService;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @Transactional
    public int bookAppointment(Appointment appointment) {
        try {
            Long patientId = appointment.getPatient() != null ? appointment.getPatient().getPatientId() : null;
            Long doctorId = appointment.getDoctor() != null ? appointment.getDoctor().getDoctorId() : null;

            if (patientId == null || doctorId == null) {
                return 0;
            }

            Optional<Patient> patientOpt = patientRepository.findById(patientId);
            Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);
            if (patientOpt.isEmpty() || doctorOpt.isEmpty()) {
                return 0;
            }

            appointment.setPatient(patientOpt.get());
            appointment.setDoctor(doctorOpt.get());
            if (appointment.getStatus() == null || appointment.getStatus().isBlank()) {
                appointment.setStatus("SCHEDULED");
            }
            appointmentRepository.save(appointment);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    @Transactional
    public ResponseEntity<Map<String, String>> updateAppointment(Appointment appointment, String token) {
        Map<String, String> response = new HashMap<>();
        try {
            String email = tokenService.extractEmail(token);
            Optional<Appointment> existingOpt = appointmentRepository.findById(appointment.getAppointmentId());

            if (existingOpt.isEmpty()) {
                response.put("message", "Appointment not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            Appointment existing = existingOpt.get();
            if (!existing.getPatient().getEmail().equals(email)) {
                response.put("message", "Unauthorized");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            Long doctorId = appointment.getDoctor() != null ? appointment.getDoctor().getDoctorId() : null;
            if (doctorId == null) {
                response.put("message", "Doctor is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);
            if (doctorOpt.isEmpty()) {
                response.put("message", "Doctor not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            existing.setAppointmentTime(appointment.getAppointmentTime());
            existing.setDoctor(doctorOpt.get());
            appointmentRepository.save(existing);

            response.put("message", "Appointment updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Transactional
    public ResponseEntity<Map<String, String>> cancelAppointment(Long appointmentId, String token) {
        Map<String, String> response = new HashMap<>();
        try {
            String email = tokenService.extractEmail(token);
            Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);

            if (appointmentOpt.isEmpty()) {
                response.put("message", "Appointment not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            Appointment appointment = appointmentOpt.get();
            if (!appointment.getPatient().getEmail().equals(email)) {
                response.put("message", "Unauthorized to cancel this appointment");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            appointmentRepository.delete(appointment);
            response.put("message", "Appointment cancelled successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Transactional
    public ResponseEntity<Map<String, Object>> getAppointments(String date, String patientName, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            String email = tokenService.extractEmail(token);
            Doctor doctor = doctorRepository.findByEmail(email);

            if (doctor == null) {
                response.put("message", "Doctor not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            LocalDate localDate = LocalDate.parse(date);
            LocalDateTime start = localDate.atStartOfDay();
            LocalDateTime end = localDate.atTime(23, 59, 59);

            Long doctorId = doctor.getDoctorId();
            List<Appointment> appointments;

            if (patientName != null && !patientName.equals("null") && !patientName.isBlank()) {
                appointments = appointmentRepository
                        .findByDoctorIdAndPatientNameContainingIgnoreCaseAndAppointmentTimeBetween(
                                doctorId, patientName, start, end);
            } else {
                appointments = appointmentRepository
                        .findByDoctorIdAndAppointmentTimeBetween(doctorId, start, end);
            }

            List<AppointmentDTO> dtos = new ArrayList<>();
            for (Appointment a : appointments) {
                dtos.add(new AppointmentDTO(
                        a.getAppointmentId(),
                        a.getDoctor().getDoctorId(),
                        a.getDoctor().getFirstName() + " " + a.getDoctor().getLastName(),
                        a.getPatient().getPatientId(),
                        a.getPatient().getFirstName() + " " + a.getPatient().getLastName(),
                        a.getPatient().getEmail(),
                        a.getPatient().getPhone(),
                        null,
                        a.getAppointmentTime(),
                        a.getStatus().equals("COMPLETED") ? 1 : 0
                ));
            }

            response.put("appointments", dtos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Error fetching appointments: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Transactional
    public void changeStatus(String status, long appointmentId) {
        appointmentRepository.updateStatus(status, appointmentId);
    }
}
