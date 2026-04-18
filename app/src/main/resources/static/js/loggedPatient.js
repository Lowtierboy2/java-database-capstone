// loggedPatient.js

import { getDoctors, filterDoctors } from './services/doctorServices.js';
import { createDoctorCard } from './components/doctorCard.js';
import { bookAppointment } from './services/appointmentRecordService.js';

document.addEventListener("DOMContentLoaded", () => {
  loadDoctorCards();

  const searchBar = document.getElementById("searchBar");
  const filterTime = document.getElementById("filterTime");
  const filterSpecialty = document.getElementById("filterSpecialty");

  if (searchBar) searchBar.addEventListener("input", filterDoctorsOnChange);
  if (filterTime) filterTime.addEventListener("change", filterDoctorsOnChange);
  if (filterSpecialty) filterSpecialty.addEventListener("change", filterDoctorsOnChange);
});

async function loadDoctorCards() {
  try {
    const doctors = await getDoctors();
    renderDoctorCards(doctors);
  } catch (error) {
    console.error("Failed to load doctors:", error);
  }
}

export function openBookingOverlay(doctor, patient) {
  const ripple = document.createElement("div");
  ripple.classList.add("ripple-overlay");
  ripple.style.left = `50%`;
  ripple.style.top = `50%`;
  document.body.appendChild(ripple);

  setTimeout(() => ripple.classList.add("active"), 50);

  const modalApp = document.createElement("div");
  modalApp.classList.add("modalApp");

  const patientName = [patient.firstName, patient.lastName].filter(Boolean).join(" ");

  modalApp.innerHTML = `
    <h2>Book Appointment</h2>
    <input class="input-field" type="text" value="${patientName}" disabled />
    <input class="input-field" type="text" value="${doctor.firstName} ${doctor.lastName}" disabled />
    <input class="input-field" type="text" value="${doctor.specialty}" disabled/>
    <input class="input-field" type="email" value="${doctor.email}" disabled/>
    <input class="input-field" type="date" id="appointment-date" />
    <select class="input-field" id="appointment-time">
      <option value="">Select time</option>
      ${(doctor.availableTimes || []).map(t => `<option value="${t}">${t}</option>`).join('')}
    </select>
    <button class="confirm-booking">Confirm Booking</button>
  `;

  document.body.appendChild(modalApp);
  setTimeout(() => modalApp.classList.add("active"), 600);

  modalApp.querySelector(".confirm-booking").addEventListener("click", async () => {
    const date = modalApp.querySelector("#appointment-date").value;
    const time = modalApp.querySelector("#appointment-time").value;
    const token = localStorage.getItem("token");

    if (!date || !time) {
      alert("Please select a date and time.");
      return;
    }

    const startTime = time.split('-')[0];

    const appointment = {
      doctor: { doctorId: doctor.doctorId },
      patient: { patientId: patient.patientId },
      appointmentTime: `${date}T${startTime}:00`,
      status: "SCHEDULED"
    };

    const { success, message } = await bookAppointment(appointment, token);

    if (success) {
      alert("Appointment booked successfully");
      ripple.remove();
      modalApp.remove();
    } else {
      alert("Failed to book an appointment: " + message);
    }
  });
}

async function filterDoctorsOnChange() {
  const name = document.getElementById("searchBar").value.trim() || null;
  const time = document.getElementById("filterTime").value || null;
  const specialty = document.getElementById("filterSpecialty").value || null;

  try {
    const response = await filterDoctors(name, time, specialty);
    const doctors = response.doctors || [];

    if (doctors.length === 0) {
      document.getElementById("content").innerHTML = "<p>No doctors found with the given filters.</p>";
      return;
    }

    renderDoctorCards(doctors);
  } catch (error) {
    console.error("Failed to filter doctors:", error);
    alert("An error occurred while filtering doctors.");
  }
}

export function renderDoctorCards(doctors) {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = "";

  doctors.forEach(doctor => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}
