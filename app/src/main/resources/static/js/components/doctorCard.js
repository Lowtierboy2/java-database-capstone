// doctorCard.js

// FIX 1: was "../services/doctorService.js" (missing 's') — file is doctorServices.js
import { deleteDoctor } from "../services/doctorServices.js";
// FIX 2: was "../services/patientService.js" (missing 's') — file is patientServices.js
//         also: imported function was "getPatientDetails" but the export in patientServices.js
//         is "getPatientData" — renamed to match.
import { getPatientData } from "../services/patientServices.js";
import { openBookingOverlay } from "../loggedPatient.js";

export function createDoctorCard(doctor) {
    const card = document.createElement("div");
    card.classList.add("doctor-card");

    const role = localStorage.getItem("role");

    const info = document.createElement("div");
    info.classList.add("doctor-info");

    const name = document.createElement("h3");
    name.textContent = `${doctor.firstName} ${doctor.lastName}`;

    const specialty = document.createElement("p");
    specialty.textContent = `Specialty: ${doctor.specialty}`;

    const email = document.createElement("p");
    email.textContent = `Email: ${doctor.email}`;

    // FIX 3: was doctor.availableTime (singular string) — model field is now "availableTimes"
    //         (List<String>). Join the array for display.
    const time = document.createElement("p");
    time.textContent = `Available: ${(doctor.availableTimes || []).join(", ")}`;

    info.appendChild(name);
    info.appendChild(specialty);
    info.appendChild(email);
    info.appendChild(time);

    const actions = document.createElement("div");
    actions.classList.add("doctor-actions");

    if (role === "ADMIN") {
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("btn-danger");

        deleteBtn.addEventListener("click", async () => {
            const token = localStorage.getItem("token");
            if (!token) { alert("Authentication error. Please log in again."); return; }

            const confirmDelete = confirm("Are you sure you want to delete this doctor?");
            if (!confirmDelete) return;

            try {
                const result = await deleteDoctor(doctor.id, token);
                if (result.success) { alert("Doctor deleted successfully."); card.remove(); }
                else alert("Failed to delete doctor.");
            } catch (error) {
                console.error("Delete error:", error);
                alert("Error deleting doctor.");
            }
        });

        actions.appendChild(deleteBtn);
    } else if (role === null) {
        const bookBtn = document.createElement("button");
        bookBtn.textContent = "Book Now";
        bookBtn.classList.add("btn-primary");
        bookBtn.addEventListener("click", () => {
            alert("Please log in as a patient to book an appointment.");
        });
        actions.appendChild(bookBtn);
    } else if (role === "PATIENT") {
        const bookBtn = document.createElement("button");
        bookBtn.textContent = "Book Now";
        bookBtn.classList.add("btn-primary");

        bookBtn.addEventListener("click", async () => {
            const token = localStorage.getItem("token");
            if (!token) { alert("Session expired. Please log in again."); return; }

            try {
                // FIX 2 applied: calling getPatientData instead of getPatientDetails
                const patient = await getPatientData(token);
                if (!patient) { alert("Error fetching patient details."); return; }
                openBookingOverlay(doctor, patient);
            } catch (error) {
                console.error("Booking error:", error);
                alert("Error preparing booking.");
            }
        });

        actions.appendChild(bookBtn);
    }

    card.appendChild(info);
    card.appendChild(actions);

    return card;
}