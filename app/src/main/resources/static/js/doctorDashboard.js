// doctorDashboard.js

import { getAllAppointments } from "./services/appointmentRecordService.js";
// FIX 1: was "./components/patientRow.js" — the actual file is "patientRows.js" (plural)
import { createPatientRow } from "./components/patientRows.js";
// FIX 2: renderContent was called but never imported
import { renderContent } from "./utils/render.js";

// Table body where rows will be inserted
const tableBody = document.getElementById("patientTableBody");

// Selected date defaults to today
let selectedDate = new Date().toISOString().split("T")[0];

// Token for authenticated requests
const token = localStorage.getItem("token");

// Patient name filter
let patientName = null;

// ===============================
// Search Bar Listener
// ===============================
document.getElementById("searchBar").addEventListener("input", (e) => {
    const value = e.target.value.trim();

    patientName = value !== "" ? value : null;

    loadAppointments();
});

// ===============================
// Today Button Listener
// ===============================
document.getElementById("todayButton").addEventListener("click", () => {
    selectedDate = new Date().toISOString().split("T")[0];
    document.getElementById("datePicker").value = selectedDate;

    loadAppointments();
});

// ===============================
// Date Picker Listener
// ===============================
document.getElementById("datePicker").addEventListener("change", (e) => {
    selectedDate = e.target.value;
    loadAppointments();
});

// ===============================
// Load Appointments
// ===============================
async function loadAppointments() {
    try {
        const appointments = await getAllAppointments(selectedDate, patientName, token);

        // Clear table
        tableBody.innerHTML = "";

        if (!appointments || appointments.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="no-results">No Appointments found for today.</td>
                </tr>
            `;
            return;
        }

        // Render each appointment
        // FIX 3: createPatientRow expects (patient, appointmentId, doctorId) — was called with 1 arg
        appointments.forEach(app => {
            const patient = {
                id: app.patientId,
                name: app.patientName,
                phone: app.patientPhone,
                email: app.patientEmail,
                prescription: app.prescription
            };

            const row = createPatientRow(patient, app.id, app.doctorId);
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading appointments:", error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="error-row">Error loading appointments. Try again later.</td>
            </tr>
        `;
    }
}

// ===============================
// Initial Page Load
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    renderContent();
    loadAppointments();
});