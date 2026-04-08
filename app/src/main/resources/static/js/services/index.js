// adminDoctorAuth.js  (services/index.js)

import { openModal } from "../components/modals.js";
import { API_BASE_URL } from "../config/config.js";
import { selectRole } from "../render.js";

const ADMIN_API = `${API_BASE_URL}/admin/login`;
const DOCTOR_API = `${API_BASE_URL}/doctor/login`;

window.addEventListener("DOMContentLoaded", () => {
  const adminBtn = document.getElementById("adminBtn");
  const doctorBtn = document.getElementById("doctorBtn");

  if (adminBtn) {
    adminBtn.addEventListener("click", () => {
      selectRole("admin");
      openModal("adminLogin");
    });
  }

  if (doctorBtn) {
    doctorBtn.addEventListener("click", () => {
      selectRole("doctor");
      openModal("doctorLogin");
    });
  }
});

export async function adminLoginHandler() {
  try {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const admin = { username, passwordHash: password };

    const response = await fetch(ADMIN_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(admin),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Invalid admin credentials.");
      return;
    }

    localStorage.setItem("token", data.token);
    selectRole("admin");
  } catch (error) {
    console.error("Admin login error:", error);
    alert("Something went wrong. Please try again.");
  }
}

export async function doctorLoginHandler() {
  try {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const doctor = { email, password };

    const response = await fetch(DOCTOR_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doctor),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Invalid doctor credentials.");
      return;
    }

    localStorage.setItem("token", data.token);
    selectRole("doctor");
  } catch (error) {
    console.error("Doctor login error:", error);
    alert("Something went wrong. Please try again.");
  }
}