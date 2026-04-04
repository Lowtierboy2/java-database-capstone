package com.project.back_end.models;


import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "prescriptions")
public class Prescription {

    @Id
    private String id;

    @NotNull
    private String patientName;

    @NotNull
    private String medication;

    @NotNull
    private Integer appointmentId;

    private List<String> instructions;

    // Getters and Setters
}
