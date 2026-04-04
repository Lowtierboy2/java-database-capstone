// doctorService.js

import { BASE_URL } from "../config.js";

const DOCTOR_API = `${BASE_URL}/api/doctors`;

// ===============================
// GET ALL DOCTORS
// ===============================
export async function getDoctors() {
    try {
        const response = await fetch(`${DOCTOR_API}/all`);

        if (!response.ok) {
            console.error("Failed to fetch doctors");
            return [];
        }

        const data = await response.json();
        return data.doctors || [];

    } catch (error) {
        console.error("Error fetching doctors:", error);
        return [];
    }
}

// ===============================
// DELETE DOCTOR
// ===============================
export async function deleteDoctor(doctorId, token) {
    try {
        const response = await fetch(`${DOCTOR_API}/delete/${doctorId}/${token}`, {
            method: "DELETE"
        });

        const data = await response.json();

        return {
            success: response.ok,
            message: data.message || "Unknown server response"
        };

    } catch (error) {
        console.error("Error deleting doctor:", error);
        return {
            success: false,
            message: "Failed to delete doctor"
        };
    }
}

// ===============================
// SAVE NEW DOCTOR
// ===============================
export async function saveDoctor(doctor, token) {
    try {
        const response = await fetch(`${DOCTOR_API}/add/${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(doctor)
        });

        const data = await response.json();

        return {
            success: response.ok,
            message: data.message || "Unknown server response"
        };

    } catch (error) {
        console.error("Error saving doctor:", error);
        return {
            success: false,
            message: "Failed to save doctor"
        };
    }
}

// ===============================
// FILTER DOCTORS
// ===============================
export async function filterDoctors(name, time, specialty) {
    try {
        const url = `${DOCTOR_API}/filter/${name || "null"}/${time || "null"}/${specialty || "null"}`;

        const response = await fetch(url);

        if (!response.ok) {
            console.error("Filter request failed");
            return { doctors: [] };
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error filtering doctors:", error);
        alert("Error filtering doctors. Try again later.");
        return { doctors: [] };
    }
}