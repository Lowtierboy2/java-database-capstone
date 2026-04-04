package com.project.back_end.services;

import com.project.back_end.models.Doctor;
import com.project.back_end.models.Appointment;
import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.repo.DoctorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final TokenService tokenService;

    public DoctorService(DoctorRepository doctorRepository,
                         AppointmentRepository appointmentRepository,
                         TokenService tokenService) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.tokenService = tokenService;
    }

    @Transactional
    public ResponseEntity<Map<String, Object>> getDoctorAvailability(Long doctorId, String date) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);
            if (doctorOpt.isEmpty()) {
                response.put("message", "Doctor not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            Doctor doctor = doctorOpt.get();
            List<String> allSlots = new ArrayList<>(doctor.getAvailableTimes());

            LocalDate localDate = LocalDate.parse(date);
            LocalDateTime start = localDate.atStartOfDay();
            LocalDateTime end = localDate.atTime(23, 59, 59);

            List<Appointment> bookedAppointments = appointmentRepository
                    .findByDoctorIdAndAppointmentTimeBetween(doctorId, start, end);

            Set<String> bookedSlots = bookedAppointments.stream()
                    .map(a -> {
                        String t = a.getAppointmentTime().toLocalTime().toString();
                        return t.substring(0, 5);
                    })
                    .collect(Collectors.toSet());

            List<String> availableSlots = allSlots.stream()
                    .filter(slot -> {
                        String slotStart = slot.split("-")[0];
                        return !bookedSlots.contains(slotStart);
                    })
                    .collect(Collectors.toList());

            response.put("availableSlots", availableSlots);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    public int saveDoctor(Doctor doctor) {
        try {
            if (doctorRepository.findByEmail(doctor.getEmail()) != null) {
                return -1;
            }
            doctorRepository.save(doctor);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    public int updateDoctor(Doctor doctor) {
        try {
            if (!doctorRepository.existsById(Long.valueOf(doctor.getDoctorId()))) {
                return -1;
            }
            doctorRepository.save(doctor);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    @Transactional
    public List<Doctor> getDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        doctors.forEach(d -> {
            if (d.getAvailableTimes() != null) d.getAvailableTimes().size();
        });
        return doctors;
    }

    @Transactional
    public int deleteDoctor(Long doctorId) {
        try {
            if (!doctorRepository.existsById(doctorId)) {
                return -1;
            }
            appointmentRepository.deleteAllByDoctorId(doctorId);
            doctorRepository.deleteById(doctorId);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    public ResponseEntity<Map<String, Object>> validateDoctor(String email, String password) {
        Map<String, Object> response = new HashMap<>();
        try {
            Doctor doctor = doctorRepository.findByEmail(email);
            if (doctor == null) {
                response.put("message", "Invalid credentials");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            if (!doctor.getPassword().equals(password)) {
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

    @Transactional
    public List<Doctor> findDoctorByName(String name) {
        List<Doctor> doctors = doctorRepository.findByNameLike(name);
        doctors.forEach(d -> {
            if (d.getAvailableTimes() != null) d.getAvailableTimes().size();
        });
        return doctors;
    }

    @Transactional
    public List<Doctor> filterDoctorsByNameSpecilityandTime(String name, String specialty, String time) {
        List<Doctor> doctors = doctorRepository.findByFirstNameContainingIgnoreCaseAndSpecialtyIgnoreCase(name, specialty);
        doctors.forEach(d -> {
            if (d.getAvailableTimes() != null) d.getAvailableTimes().size();
        });
        return filterDoctorByTime(doctors, time);
    }

    public List<Doctor> filterDoctorByTime(List<Doctor> doctors, String time) {
        boolean isAM = "AM".equalsIgnoreCase(time);
        return doctors.stream()
                .filter(d -> d.getAvailableTimes() != null && d.getAvailableTimes().stream().anyMatch(slot -> {
                    try {
                        int hour = Integer.parseInt(slot.split(":")[0]);
                        return isAM ? hour < 12 : hour >= 12;
                    } catch (Exception e) {
                        return false;
                    }
                }))
                .collect(Collectors.toList());
    }

    @Transactional
    public List<Doctor> filterDoctorByNameAndTime(String name, String time) {
        List<Doctor> doctors = findDoctorByName(name);
        return filterDoctorByTime(doctors, time);
    }

    @Transactional
    public List<Doctor> filterDoctorByNameAndSpecility(String name, String specialty) {
        return doctorRepository.findByFirstNameContainingIgnoreCaseAndSpecialtyIgnoreCase(name, specialty);
    }

    @Transactional
    public List<Doctor> filterDoctorByTimeAndSpecility(String specialty, String time) {
        List<Doctor> doctors = doctorRepository.findBySpecialtyIgnoreCase(specialty);
        doctors.forEach(d -> {
            if (d.getAvailableTimes() != null) d.getAvailableTimes().size();
        });
        return filterDoctorByTime(doctors, time);
    }

    @Transactional
    public List<Doctor> filterDoctorBySpecility(String specialty) {
        return doctorRepository.findBySpecialtyIgnoreCase(specialty);
    }

    @Transactional
    public List<Doctor> filterDoctorsByTime(String time) {
        List<Doctor> all = getDoctors();
        return filterDoctorByTime(all, time);
    }
}