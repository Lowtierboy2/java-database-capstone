package com.project.back_end.models;

import jakarta.validation.constraints.Future;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer appointmentId;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    // FIX: was named "appointmentDate" — renamed to "appointmentTime" to match the
    //      JSON key the frontend sends: { appointmentTime: "2025-01-01T09:00:00" }.
    //      Jackson deserializes by matching the JSON key to the Java field name.
    //      Also updated @JsonFormat to accept the ISO-8601 format the frontend sends.
    @Future(message = "Appointment date must be in the future")
    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime appointmentTime;

    private String status = "SCHEDULED";

    @Column(columnDefinition = "TEXT")
    private String notes;

    // Helper method
    public LocalDateTime getEndTime() {
        return appointmentTime.plusMinutes(30);
    }

    public String getFormattedAppointmentTime() {
        if (appointmentTime == null) return null;
        return appointmentTime.toString();
    }

    // Getters and Setters
}