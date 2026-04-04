// render.js

import { setRole, getRole } from "./util.js";

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

// FIX: render.js is an ES module (it uses import/export), so its exports are NOT
//      automatically available in the global scope. However, the HTML pages use
//      inline handlers like onload="renderContent()" and onclick="selectRole('doctor')"
//      which require these functions to be on window.
//      Assigning them here bridges the module/global gap without changing every HTML page.
window.renderContent = renderContent;
window.selectRole = selectRole;