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

    // FIX: added "dosage" — frontend (addPrescription.js) sends this field in the
    //      prescription payload but the model had no corresponding field.
    private String dosage;

    // FIX: added "doctorNotes" — frontend sends this as well (maps to the "notes"
    //      textarea in addPrescription.html). The previous model only had "instructions"
    //      (List<String>) which didn't match the string the frontend sends.
    private String doctorNotes;

    private List<String> instructions;

    // Getters and Setters
}