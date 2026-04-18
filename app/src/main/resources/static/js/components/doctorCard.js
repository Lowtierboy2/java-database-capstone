// doctorCard.js

import { deleteDoctor } from "../services/doctorServices.js";
import { getPatientData } from "../services/patientServices.js";
import { getRole } from "../util.js";
import { openBookingOverlay } from "../loggedPatient.js";

export function createDoctorCard(doctor) {
    const card = document.createElement("div");
    card.classList.add("doctor-card");

    const role = getRole();

    const info = document.createElement("div");
    info.classList.add("doctor-info");

    const name = document.createElement("h3");
    name.textContent = `${doctor.firstName} ${doctor.lastName}`;

    const specialty = document.createElement("p");
    specialty.textContent = `Specialty: ${doctor.specialty}`;

    const email = document.createElement("p");
    email.textContent = `Email: ${doctor.email}`;

    const time = document.createElement("p");
    time.textContent = `Available: ${(doctor.availableTimes || []).join(", ")}`;

    info.appendChild(name);
    info.appendChild(specialty);
    info.appendChild(email);
    info.appendChild(time);

    const actions = document.createElement("div");
    actions.classList.add("doctor-actions");

    if (role === "admin") {
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
                const result = await deleteDoctor(doctor.doctorId, token);
                if (result.success) {
                    alert("Doctor deleted successfully.");
                    card.remove();
                } else {
                    alert(result.message || "Failed to delete doctor.");
                }
            } catch (error) {
                console.error("Delete error:", error);
                alert("Error deleting doctor.");
            }
        });

        actions.appendChild(deleteBtn);
    } else if (role === "loggedPatient") {
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
                const patient = await getPatientData(token);
                if (!patient) {
                    alert("Error fetching patient details.");
                    return;
                }
                openBookingOverlay(doctor, patient);
            } catch (error) {
                console.error("Booking error:", error);
                alert("Error preparing booking.");
            }
        });

        actions.appendChild(bookBtn);
    } else {
        const bookBtn = document.createElement("button");
        bookBtn.textContent = "Book Now";
        bookBtn.classList.add("btn-primary");
        bookBtn.addEventListener("click", () => {
            alert("Please log in as a patient to book an appointment.");
        });
        actions.appendChild(bookBtn);
    }

    card.appendChild(info);
    card.appendChild(actions);

    return card;
}
