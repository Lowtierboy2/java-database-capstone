// modals.js

import { signupPatient, loginPatient } from "../services/patientServices.js";
import { adminLoginHandler, doctorLoginHandler } from "../services/index.js";
import { selectRole } from "../render.js";

export function openModal(type) {
    let modalContent = "";

    if (type === "addDoctor") {
        modalContent = `
            <h2>Add Doctor</h2>

            <input type="text" id="doctorFirstName" placeholder="First Name" class="input-field">
            <input type="text" id="doctorLastName" placeholder="Last Name" class="input-field">

            <select id="doctorSpecialty" class="input-field select-dropdown">
                <option value="">Specialization</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="General Medicine">General Medicine</option>
            </select>

            <input type="email" id="doctorEmail" placeholder="Email" class="input-field">
            <input type="password" id="doctorPassword" placeholder="Password" class="input-field">
            <input type="text" id="doctorPhone" placeholder="Phone Number" class="input-field">

            <label class="availabilityLabel">Select Availability:</label>
            <div class="checkbox-group">
                <label><input type="checkbox" name="availability" value="09:00-10:00"> 9:00 AM - 10:00 AM</label>
                <label><input type="checkbox" name="availability" value="10:00-11:00"> 10:00 AM - 11:00 AM</label>
                <label><input type="checkbox" name="availability" value="11:00-12:00"> 11:00 AM - 12:00 PM</label>
                <label><input type="checkbox" name="availability" value="12:00-13:00"> 12:00 PM - 1:00 PM</label>
            </div>

            <button class="dashboard-btn" id="saveDoctorBtn">Save</button>
        `;
    } else if (type === "patientLogin") {
        modalContent = `
            <h2>Patient Login</h2>
            <input type="email" id="email" placeholder="Email" class="input-field">
            <input type="password" id="password" placeholder="Password" class="input-field">
            <button class="dashboard-btn" id="loginBtn">Login</button>
        `;
    } else if (type === "patientSignup") {
        modalContent = `
            <h2>Patient Signup</h2>
            <input type="text" id="firstName" placeholder="First Name" class="input-field">
            <input type="text" id="lastName" placeholder="Last Name" class="input-field">
            <input type="email" id="email" placeholder="Email" class="input-field">
            <input type="password" id="password" placeholder="Password" class="input-field">
            <input type="text" id="phone" placeholder="Phone" class="input-field">
            <input type="date" id="dateOfBirth" class="input-field">
            <button class="dashboard-btn" id="signupBtn">Signup</button>
        `;
    } else if (type === "adminLogin") {
        modalContent = `
            <h2>Admin Login</h2>
            <input type="text" id="username" placeholder="Username" class="input-field">
            <input type="password" id="password" placeholder="Password" class="input-field">
            <button class="dashboard-btn" id="adminLoginBtn">Login</button>
        `;
    } else if (type === "doctorLogin") {
        modalContent = `
            <h2>Doctor Login</h2>
            <input type="email" id="email" placeholder="Email" class="input-field">
            <input type="password" id="password" placeholder="Password" class="input-field">
            <button class="dashboard-btn" id="doctorLoginBtn">Login</button>
        `;
    }

    document.getElementById("modal-body").innerHTML = modalContent;
    document.getElementById("modal").style.display = "block";
    document.getElementById("modal-close").onclick = closeModal;

    if (type === "patientSignup") document.getElementById("signupBtn").onclick = handlePatientSignup;
    if (type === "patientLogin") document.getElementById("loginBtn").onclick = handlePatientLogin;
    if (type === "addDoctor") document.getElementById("saveDoctorBtn").onclick = () => {
        if (typeof window.adminAddDoctor === "function") {
            window.adminAddDoctor();
        } else {
            alert("Doctor form handler is not available on this page.");
        }
    };
    if (type === "adminLogin") document.getElementById("adminLoginBtn").onclick = adminLoginHandler;
    if (type === "doctorLogin") document.getElementById("doctorLoginBtn").onclick = doctorLoginHandler;
}

async function handlePatientSignup(e) {
    e.preventDefault();

    const payload = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        dateOfBirth: document.getElementById("dateOfBirth").value
    };

    const { success, message } = await signupPatient(payload);
    if (success) {
        alert(message || "Signup successful");
        closeModal();
        openModal("patientLogin");
    } else {
        alert(message || "Signup failed");
    }
}

async function handlePatientLogin(e) {
    e.preventDefault();

    const payload = {
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim()
    };

    const { success, token, message } = await loginPatient(payload);
    if (success && token) {
        localStorage.setItem("token", token);
        closeModal();
        selectRole("loggedPatient");
    } else {
        alert(message || "Login failed");
    }
}

export function closeModal() {
    document.getElementById("modal").style.display = "none";
}
