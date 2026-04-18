// header.js

import { openModal } from "./modals.js";
import { clearRole, getRole } from "../util.js";

export function renderHeader() {
    const headerDiv = document.getElementById("header");
    if (!headerDiv) return;

    const path = window.location.pathname;
    const isLandingPage = path === "/" || path.endsWith("/index.html");

    if (isLandingPage) {
        clearRole();

        headerDiv.innerHTML = `
            <header class="header">
                <div class="logo-link">
                    <img src="/assets/images/logo/logo.png" alt="Hospital CMS Logo" class="logo-img">
                    <span class="logo-title">Hospital CMS</span>
                </div>
            </header>
        `;
        return;
    }

    const role = getRole();
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
        clearRole();
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
            <button class="nav-btn" id="doctorHomeBtn">Home</button>
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
    attachHeaderButtonListeners(token);
}

function attachHeaderButtonListeners(token) {
    const loginBtn = document.getElementById("patientLoginBtn");
    const signupBtn = document.getElementById("patientSignupBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const logoutPatientBtn = document.getElementById("logoutPatientBtn");
    const doctorHomeBtn = document.getElementById("doctorHomeBtn");

    if (loginBtn) loginBtn.addEventListener("click", () => openModal("patientLogin"));
    if (signupBtn) signupBtn.addEventListener("click", () => openModal("patientSignup"));
    if (logoutBtn) logoutBtn.addEventListener("click", logout);
    if (logoutPatientBtn) logoutPatientBtn.addEventListener("click", logout);
    if (doctorHomeBtn && token) {
        doctorHomeBtn.addEventListener("click", () => {
            window.location.href = `/doctorDashboard/${token}`;
        });
    }
}

function logout() {
    clearRole();
    localStorage.removeItem("token");
    window.location.href = "/";
}

window.openModal = openModal;

document.addEventListener("DOMContentLoaded", renderHeader);
