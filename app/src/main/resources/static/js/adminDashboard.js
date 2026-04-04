// ===============================
// Admin Dashboard Logic
// ===============================

// Load all doctor cards when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    loadDoctorCards();

    // Search + Filters
    document.getElementById("searchBar").addEventListener("input", filterDoctorsOnChange);
    document.getElementById("timeFilter").addEventListener("change", filterDoctorsOnChange);
    document.getElementById("specialtyFilter").addEventListener("change", filterDoctorsOnChange);

    // Add Doctor Button
    document.getElementById("addDoctorBtn").addEventListener("click", () => {
        openModal("addDoctor");
    });
});

// ===============================
// Load All Doctors
// ===============================
async function loadDoctorCards() {
    try {
        const doctors = await getDoctors();
        renderDoctorCards(doctors);
    } catch (error) {
        console.error("Error loading doctors:", error);
    }
}

// ===============================
// Filter Doctors
// ===============================
async function filterDoctorsOnChange() {
    const name = document.getElementById("searchBar").value.trim() || null;
    const time = document.getElementById("timeFilter").value || null;
    const specialty = document.getElementById("specialtyFilter").value || null;

    try {
        const doctors = await filterDoctors(name, time, specialty);

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

// ===============================
// Render Doctor Cards
// ===============================
function renderDoctorCards(doctors) {
    const content = document.getElementById("content");
    content.innerHTML = "";

    doctors.forEach(doctor => {
        const card = createDoctorCard(doctor);
        content.appendChild(card);
    });
}

// ===============================
// Add Doctor (Modal Form Submission)
// ===============================
async function adminAddDoctor() {
    const firstName = document.getElementById("doctorFirstName").value.trim();
    const lastName = document.getElementById("doctorLastName").value.trim();
    const email = document.getElementById("doctorEmail").value.trim();
    const phone = document.getElementById("doctorPhone").value.trim();
    const password = document.getElementById("doctorPassword").value.trim();
    const specialty = document.getElementById("doctorSpecialty").value.trim();
    const availableTime = document.getElementById("doctorAvailableTime").value.trim();

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
        availableTime
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