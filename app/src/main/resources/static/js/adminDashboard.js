// adminDashboard.js

import { getDoctors, filterDoctors, saveDoctor } from "./services/doctorServices.js";
import { createDoctorCard } from "./components/doctorCard.js";
import { openModal, closeModal } from "./components/modals.js";

document.addEventListener("DOMContentLoaded", () => {
    loadDoctorCards();

    document.getElementById("searchBar").addEventListener("input", filterDoctorsOnChange);
    document.getElementById("timeFilter").addEventListener("change", filterDoctorsOnChange);
    document.getElementById("specialtyFilter").addEventListener("change", filterDoctorsOnChange);

    document.getElementById("addDoctorBtn").addEventListener("click", () => {
        openModal("addDoctor");
    });
});

async function loadDoctorCards() {
    try {
        const doctors = await getDoctors();
        renderDoctorCards(doctors);
    } catch (error) {
        console.error("Error loading doctors:", error);
    }
}

async function filterDoctorsOnChange() {
    const name = document.getElementById("searchBar").value.trim() || null;
    const time = document.getElementById("timeFilter").value || null;
    const specialty = document.getElementById("specialtyFilter").value || null;

    try {
        // FIX: filterDoctors() returns { doctors: [...] }, not a bare array.
        //      The previous code did `doctors.length` on the whole response object
        //      (which has no .length), so the empty check always failed.
        const response = await filterDoctors(name, time, specialty);
        const doctors = response.doctors || [];

        if (doctors.length === 0) {
            document.getElementById("content").innerHTML =
                `<p class="no-results">No doctors found with the given filters.</p>`;
            return;
        }

        renderDoctorCards(doctors);
    } catch (error) {
        alert("Error filtering doctors.");
        console.error(error);
    }
}

function renderDoctorCards(doctors) {
    const content = document.getElementById("content");
    content.innerHTML = "";

    doctors.forEach(doctor => {
        const card = createDoctorCard(doctor);
        content.appendChild(card);
    });
}

async function adminAddDoctor() {
    const firstName = document.getElementById("doctorFirstName").value.trim();
    const lastName = document.getElementById("doctorLastName").value.trim();
    const email = document.getElementById("doctorEmail").value.trim();
    const phone = document.getElementById("doctorPhone").value.trim();
    const password = document.getElementById("doctorPassword").value.trim();
    const specialty = document.getElementById("doctorSpecialty").value.trim();

    // FIX: the modal uses checkboxes (name="availability") for time slots, not a
    //      text input with id="doctorAvailableTime". The previous code read a
    //      non-existent input, so availableTime was always "".
    //      Collect all checked checkbox values into an array instead.
    const checkedBoxes = document.querySelectorAll('input[name="availability"]:checked');
    const availableTimes = Array.from(checkedBoxes).map(cb => cb.value);

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Authentication error. Please log in again.");
        return;
    }

    const doctor = {
        firstName,
        lastName,
        email,
        phone,
        password,
        specialty,
        availableTimes   // FIX: was "availableTime" (singular string) — now matches Doctor model field
    };

    try {
        const response = await saveDoctor(doctor, token);

        if (response.success) {
            alert("Doctor added successfully!");
            closeModal();
            loadDoctorCards();
        } else {
            alert("Failed to add doctor.");
        }
    } catch (error) {
        console.error("Error adding doctor:", error);
        alert("An error occurred while saving the doctor.");
    }
}