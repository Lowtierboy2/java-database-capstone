// render.js

import { getRole, setRole } from "./util.js";

// ===============================
// SELECT ROLE (AFTER SUCCESSFUL LOGIN)
// ===============================
export function selectRole(role) {
  setRole(role);
  const token = localStorage.getItem("token");

  if (role === "admin" && token) {
    window.location.href = `/adminDashboard/${token}`;
    return;
  }

  if (role === "doctor" && token) {
    window.location.href = `/doctorDashboard/${token}`;
    return;
  }

  if (role === "patient") {
    window.location.href = "/pages/patientDashboard.html";
    return;
  }

  if (role === "loggedPatient" && token) {
    window.location.href = "/pages/loggedPatientDashboard.html";
  }
}

// ===============================
// BASIC CONTENT GUARD
// ===============================
export function renderContent() {
  const role = getRole();
  if (!role) {
    window.location.href = "/";
  }
}

window.renderContent = renderContent;
window.selectRole = selectRole;
