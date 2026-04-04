// ===============================
// Doctor Card Component
// ===============================

import { deleteDoctor } from "../services/doctorService.js";
import { getPatientDetails } from "../services/patientService.js";
import { openBookingOverlay } from "../loggedPatient.js"; // booking UI

export function createDoctorCard(doctor) {
    // Main card container
    const card = document.createElement("div");
    card.classList.add("doctor-card");

    // Get role from localStorage
    const role = localStorage.getItem("role");

    // Doctor Info Container
    const info = document.createElement("div");
    info.classList.add("doctor-info");

    // Doctor Name
    const name = document.createElement("h3");
    name.textContent = `${doctor.firstName} ${doctor.lastName}`;

    // Specialty
    const specialty = document.createElement("p");
    specialty.textContent = `Specialty: ${doctor.specialty}`;

    // Email
    const email = document.createElement("p");
    email.textContent = `Email: ${doctor.email}`;

    // Available Times
    const time = document.createElement("p");
    time.textContent = `Available: ${doctor.availableTime}`;

    // Append info
    info.appendChild(name);
    info.appendChild(specialty);
    info.appendChild(email);
    info.appendChild(time);

    // ===============================
    // ACTION BUTTONS
    // ===============================
    const actions = document.createElement("div");
    actions.classList.add("doctor-actions");

    // ===============================
    // ADMIN ROLE — DELETE DOCTOR
    // ===============================
    if (role === "ADMIN") {
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("btn-danger");

        deleteBtn.addEventListener("click", async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Authentication error. Please log in again.");
                return;
            }

            const confirmDelete = confirm("Are you sure you want to delete this doctor?");
            if (!confirmDelete) return;

            try {
                const result = await deleteDoctor(doctor.id, token);

                if (result.success) {
                    alert("Doctor deleted successfully.");
                    card.remove();
                } else {
                    alert("Failed to delete doctor.");
                }
            } catch (error) {
                console.error("Delete error:", error);
                alert("Error deleting doctor.");
            }
        });

        actions.appendChild(deleteBtn);
    }

    // ===============================
    // PATIENT NOT LOGGED IN — SHOW LOGIN ALERT
    // ===============================
    else if (role === null) {
        const bookBtn = document.createElement("button");
        bookBtn.textContent = "Book Now";
        bookBtn.classList.add("btn-primary");

        bookBtn.addEventListener("click", () => {
            alert("Please log in as a patient to book an appointment.");
        });

        actions.appendChild(bookBtn);
    }

    // ===============================
    // LOGGED-IN PATIENT — BOOK APPOINTMENT
    // ===============================
    else if (role === "PATIENT") {
        const bookBtn = document.createElement("button");
        bookBtn.textContent = "Book Now";
        bookBtn.classList.add("btn-primary");

        bookBtn.addEventListener("click", async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Session expired. Please log in again.");
                return;
            }

            try {
                const patient = await getPatientDetails(token);

                if (!patient) {
                    alert("Error fetching patient details.");
                    return;
                }

                // Open booking overlay with doctor + patient info
                openBookingOverlay(doctor, patient);

            } catch (error) {
                console.error("Booking error:", error);
                alert("Error preparing booking.");
            }
        });

        actions.appendChild(bookBtn);
    }

    // ===============================
    // FINAL ASSEMBLY
    // ===============================
    card.appendChild(info);
    card.appendChild(actions);

    return card;
}