// patientService.js

import { API_BASE_URL } from "../config/config.js";

const PATIENT_API = `${API_BASE_URL}/patient`;

// ===============================
// SIGNUP PATIENT
// ===============================
export async function signupPatient(data) {
  try {
    const response = await fetch(`${PATIENT_API}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Signup failed");
    }

    return { success: true, message: result.message || "Signup successful" };
  } catch (error) {
    console.error("Error :: signupPatient :: ", error);
    return { success: false, message: error.message || "Signup failed" };
  }
}

// backward-compatible alias if some code still calls patientSignup
export const patientSignup = signupPatient;

// ===============================
// LOGIN PATIENT
// ===============================
export async function loginPatient(data) {
  try {
    const response = await fetch(`${PATIENT_API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Login failed");
    }

    return { success: true, token: result.token, message: result.message || "Login successful" };
  } catch (error) {
    console.error("Error :: loginPatient :: ", error);
    return { success: false, token: null, message: error.message || "Login failed" };
  }
}

// backward-compatible alias if some code still calls patientLogin
export const patientLogin = loginPatient;

// ===============================
// GET PATIENT DATA (FOR BOOKING, PROFILE, ETC.)
// ===============================
export async function getPatientData(token) {
  try {
    const response = await fetch(`${PATIENT_API}/${token}`);
    const data = await response.json();

    if (response.ok) return data.patient || null;
    return null;
  } catch (error) {
    console.error("Error fetching patient details:", error);
    return null;
  }
}

// ===============================
// GET PATIENT APPOINTMENTS
// (USED BY DOCTOR & PATIENT DASHBOARDS)
// ===============================
export async function getPatientAppointments(id, token, user) {
  try {
    const response = await fetch(`${PATIENT_API}/${id}/${user}/${token}`);
    const data = await response.json();

    if (response.ok) {
      return data.appointments || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    return [];
  }
}

// ===============================
// FILTER APPOINTMENTS
// ===============================
export async function filterAppointments(condition, name, token) {
  try {
    const response = await fetch(
      `${PATIENT_API}/filter/${condition}/${name}/${token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch appointments:", response.statusText);
      return { appointments: [] };
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong!");
    return { appointments: [] };
  }
}