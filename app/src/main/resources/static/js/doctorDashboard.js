// doctorDashboard.js

import { getAllAppointments } from "./services/appointmentRecordService.js";
import { createPatientRow } from "./components/patientRows.js";
// FIX: was "./utils/render.js" — there is no utils/ subfolder; file lives at ./render.js
import { renderContent } from "./render.js";

const tableBody = document.getElementById("patientTableBody");
let selectedDate = new Date().toISOString().split("T")[0];
const token = localStorage.getItem("token");
let patientName = null;

document.getElementById("searchBar").addEventListener("input", (e) => {
    const value = e.target.value.trim();
    patientName = value !== "" ? value : null;
    loadAppointments();
});

document.getElementById("todayButton").addEventListener("click", () => {
    selectedDate = new Date().toISOString().split("T")[0];
    document.getElementById("datePicker").value = selectedDate;
    loadAppointments();
});

document.getElementById("datePicker").addEventListener("change", (e) => {
    selectedDate = e.target.value;
    loadAppointments();
});

async function loadAppointments() {
    try {
        const appointments = await getAllAppointments(selectedDate, patientName, token);

        tableBody.innerHTML = "";

        if (!appointments || appointments.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="no-results">No Appointments found for today.</td>
                </tr>
            `;
            return;
        }

        // FIX (from round 1): createPatientRow expects (patient, appointmentId, doctorId)
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

document.addEventListener("DOMContentLoaded", () => {
    renderContent();
    loadAppointments();
});