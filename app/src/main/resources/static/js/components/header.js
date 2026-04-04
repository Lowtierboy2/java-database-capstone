// ===============================
// Dynamic Header Rendering
// ===============================

export function renderHeader() {
    const headerDiv = document.getElementById("header");
    if (!headerDiv) return;

    // If on root page → clear session and show minimal header
    if (window.location.pathname.endsWith("/")) {
        localStorage.removeItem("userRole");

        headerDiv.innerHTML = `
            <header class="header">
                <div class="logo-section">
                    <img src="/assets/images/logo/logo.png" alt="Hospital CMS Logo" class="logo-img">
                    <span class="logo-title">Hospital CMS</span>
                </div>
            </header>
        `;
        return;
    }

    // Retrieve role + token
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    // Base header content
    let headerContent = `
        <header class="header">
            <div class="logo-section">
                <img src="/assets/images/logo/logo.png" alt="Hospital CMS Logo" class="logo-img">
                <span class="logo-title">Hospital CMS</span>
            </div>
            <nav class="header-nav">
    `;

    // ===============================
    // SESSION VALIDATION
    // ===============================
    if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
        localStorage.removeItem("userRole");
        alert("Session expired or invalid login. Please log in again.");
        window.location.href = "/";
        return;
    }

    // ===============================
    // ROLE-BASED HEADER CONTENT
    // ===============================

    // ADMIN
    if (role === "admin") {
        headerContent += `
            <button class="nav-btn" onclick="openModal('addDoctor')">Add Doctor</button>
            <a class="nav-link" href="#" id="logoutBtn">Logout</a>
        `;
    }

    // DOCTOR
    else if (role === "doctor") {
        headerContent += `
            <button class="nav-btn" onclick="window.location.href='/doctor/doctorDashboard'">Home</button>
            <a class="nav-link" href="#" id="logoutBtn">Logout</a>
        `;
    }

    // PATIENT (not logged in)
    else if (role === "patient") {
        headerContent += `
            <button class="nav-btn" id="patientLoginBtn">Login</button>
            <button class="nav-btn" id="patientSignupBtn">Sign Up</button>
        `;
    }

    // LOGGED-IN PATIENT
    else if (role === "loggedPatient") {
        headerContent += `
            <button class="nav-btn" onclick="window.location.href='/pages/loggedPatientDashboard.html'">Home</button>
            <button class="nav-btn" onclick="window.location.href='/pages/patientAppointments.html'">Appointments</button>
            <a class="nav-link" href="#" id="logoutPatientBtn">Logout</a>
        `;
    }

    // Close nav + header
    headerContent += `
            </nav>
        </header>
    `;

    // Render header
    headerDiv.innerHTML = headerContent;

    // Attach listeners
    attachHeaderButtonListeners();
}

// ===============================
// Helper Functions
// ===============================

function attachHeaderButtonListeners() {
    const loginBtn = document.getElementById("patientLoginBtn");
    const signupBtn = document.getElementById("patientSignupBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const logoutPatientBtn = document.getElementById("logoutPatientBtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", () => openModal("patientLogin"));
    }

    if (signupBtn) {
        signupBtn.addEventListener("click", () => openModal("patientSignup"));
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }

    if (logoutPatientBtn) {
        logoutPatientBtn.addEventListener("click", logoutPatient);
    }
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

// Auto-render header on page load
document.addEventListener("DOMContentLoaded", renderHeader);