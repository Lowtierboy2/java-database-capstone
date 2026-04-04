// modal.js

import { signupPatient, loginPatient } from "../services/patientService.js";
import { adminLoginHandler, doctorLoginHandler } from "../index.js";
import { doctorLoginHandler } from "../auth/doctorAuth.js";

export function openModal(type) {
    let modalContent = "";

    // ===============================
    // ADD DOCTOR (ADMIN)
    // ===============================
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
    }

    // ===============================
    // PATIENT LOGIN
    // ===============================
    else if (type === "patientLogin") {
        modalContent = `
            <h2>Patient Login</h2>
            <input type="email" id="email" placeholder="Email" class="input-field">
            <input type="password" id="password" placeholder="Password" class="input-field">
            <button class="dashboard-btn" id="loginBtn">Login</button>
        `;
    }

    // ===============================
    // PATIENT SIGNUP
    // ===============================
    else if (type === "patientSignup") {
        modalContent = `
            <h2>Patient Signup</h2>
            <input type="text" id="name" placeholder="Name" class="input-field">
            <input type="email" id="email" placeholder="Email" class="input-field">
            <input type="password" id="password" placeholder="Password" class="input-field">
            <input type="text" id="phone" placeholder="Phone" class="input-field">
            <input type="text" id="address" placeholder="Address" class="input-field">
            <button class="dashboard-btn" id="signupBtn">Signup</button>
        `;
    }

    // ===============================
    // ADMIN LOGIN
    // ===============================
    else if (type === "adminLogin") {
        modalContent = `
            <h2>Admin Login</h2>
            <input type="text" id="username" placeholder="Username" class="input-field">
            <input type="password" id="password" placeholder="Password" class="input-field">
            <button class="dashboard-btn" id="adminLoginBtn">Login</button>
        `;
    }

    // ===============================
    // DOCTOR LOGIN
    // ===============================
    else if (type === "doctorLogin") {
        modalContent = `
            <h2>Doctor Login</h2>
            <input type="email" id="email" placeholder="Email" class="input-field">
            <input type="password" id="password" placeholder="Password" class="input-field">
            <button class="dashboard-btn" id="doctorLoginBtn">Login</button>
        `;
    }

    // Render modal
    document.getElementById("modal-body").innerHTML = modalContent;
    document.getElementById("modal").style.display = "block";

    // Close button
    document.getElementById("modal-close").onclick = closeModal;

    // Attach handlers
    if (type === "patientSignup") document.getElementById("signupBtn").onclick = signupPatient;
    if (type === "patientLogin") document.getElementById("loginBtn").onclick = loginPatient;
    if (type === "addDoctor") document.getElementById("saveDoctorBtn").onclick = adminAddDoctor;
    if (type === "adminLogin") document.getElementById("adminLoginBtn").onclick = adminLoginHandler;
    if (type === "doctorLogin") document.getElementById("doctorLoginBtn").onclick = doctorLoginHandler;
}

export function closeModal() {
    document.getElementById("modal").style.display = "none";
}