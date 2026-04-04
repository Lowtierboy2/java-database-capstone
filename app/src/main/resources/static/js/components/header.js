// header.js

import { openModal } from "./modals.js";

export function renderHeader() {
    const headerDiv = document.getElementById("header");
    if (!headerDiv) return;

    if (window.location.pathname.endsWith("/")) {
        localStorage.removeItem("userRole");

        headerDiv.innerHTML = `
            <header class="header">
                <!-- FIX: was class="logo-section" — style.css defines .logo-link, not .logo-section -->
                <div class="logo-link">
                    <img src="/assets/images/logo/logo.png" alt="Hospital CMS Logo" class="logo-img">
                    <span class="logo-title">Hospital CMS</span>
                </div>
            </header>
        `;
        return;
    }

    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    let headerContent = `
        <header class="header">
            <div class="logo-link">
                <img src="/assets/images/logo/logo.png" alt="Hospital CMS Logo" class="logo-img">
                <span class="logo-title">Hospital CMS</span>
            </div>
            <nav class="header-nav">
    `;

    if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
        localStorage.removeItem("userRole");
        alert("Session expired or invalid login. Please log in again.");
        window.location.href = "/";
        return;
    }

    if (role === "admin") {
        headerContent += `
            <button class="nav-btn" onclick="openModal('addDoctor')">Add Doctor</button>
            <a class="nav-link" href="#" id="logoutBtn">Logout</a>
        `;
    } else if (role === "doctor") {
        headerContent += `
            <button class="nav-btn" onclick="window.location.href='/doctor/doctorDashboard'">Home</button>
            <a class="nav-link" href="#" id="logoutBtn">Logout</a>
        `;
    } else if (role === "patient") {
        headerContent += `
            <button class="nav-btn" id="patientLoginBtn">Login</button>
            <button class="nav-btn" id="patientSignupBtn">Sign Up</button>
        `;
    } else if (role === "loggedPatient") {
        headerContent += `
            <button class="nav-btn" onclick="window.location.href='/pages/loggedPatientDashboard.html'">Home</button>
            <button class="nav-btn" onclick="window.location.href='/pages/patientAppointments.html'">Appointments</button>
            <a class="nav-link" href="#" id="logoutPatientBtn">Logout</a>
        `;
    }

    headerContent += `
            </nav>
        </header>
    `;

    headerDiv.innerHTML = headerContent;
    attachHeaderButtonListeners();
}

function attachHeaderButtonListeners() {
    const loginBtn = document.getElementById("patientLoginBtn");
    const signupBtn = document.getElementById("patientSignupBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const logoutPatientBtn = document.getElementById("logoutPatientBtn");

    if (loginBtn) loginBtn.addEventListener("click", () => openModal("patientLogin"));
    if (signupBtn) signupBtn.addEventListener("click", () => openModal("patientSignup"));
    if (logoutBtn) logoutBtn.addEventListener("click", logout);
    if (logoutPatientBtn) logoutPatientBtn.addEventListener("click", logoutPatient);
}

function logout() {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    window.location.href = "/";
}

function logoutPatient() {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    window.location.href = "/";
}

// FIX: openModal is called from inline onclick in the header's "Add Doctor" button.
//      Since header.js is a module, openModal must be on window for inline handlers to reach it.
window.openModal = openModal;

document.addEventListener("DOMContentLoaded", renderHeader);