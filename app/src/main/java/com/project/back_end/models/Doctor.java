package com.project.back_end.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;
import java.util.List;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer doctorId;

    @NotNull
    @Size(min = 2, max = 50)
    private String firstName;

    @NotNull
    @Size(min = 2, max = 50)
    private String lastName;

    @NotNull
    @Size(min = 3, max = 100)
    private String specialty;

    @NotNull
    @Email
    @Column(unique = true)
    private String email;

    @NotNull
    private String phone;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    // FIX: was named "availability" — renamed to "availableTimes" to match the
    //      JSON key the frontend expects (doctor.availableTimes in loggedPatient.js,
    //      updateAppointment.js, and the "Book Now" booking overlay).
    @ElementCollection
    private List<String> availableTimes;

    // Getters and Setters
}