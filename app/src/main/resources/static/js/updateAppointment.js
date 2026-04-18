// updateAppointment.js

import { updateAppointment } from "./services/appointmentRecordService.js";
import { getDoctors } from "./services/doctorServices.js";

document.addEventListener("DOMContentLoaded", initializePage);

async function initializePage() {
  const token = localStorage.getItem("token");

  const urlParams = new URLSearchParams(window.location.search);
  const appointmentId = urlParams.get("appointmentId");
  const patientId = urlParams.get("patientId");
  const doctorId = urlParams.get("doctorId");
  const patientName = urlParams.get("patientName");
  const doctorName = urlParams.get("doctorName");
  const appointmentDate = urlParams.get("appointmentDate");
  const appointmentTime = urlParams.get("appointmentTime");

  if (!token || !patientId) {
    alert("Missing session data, redirecting to appointments page.");
    window.location.href = "/pages/patientAppointments.html";
    return;
  }

  try {
    const doctors = await getDoctors();
    const doctor = doctors.find(d => Number(d.doctorId) === Number(doctorId));
    if (!doctor) {
      alert("Doctor not found.");
      return;
    }

    document.getElementById("patientName").value = patientName || "You";
    document.getElementById("doctorName").value = doctorName;
    document.getElementById("appointmentDate").value = appointmentDate;

    const timeSelect = document.getElementById("appointmentTime");
    timeSelect.innerHTML = "";

    (doctor.availableTimes || []).forEach(time => {
      const option = document.createElement("option");
      option.value = time;
      option.textContent = time;
      if (time.startsWith(appointmentTime)) {
        option.selected = true;
      }
      timeSelect.appendChild(option);
    });

    document.getElementById("updateAppointmentForm").addEventListener("submit", async (e) => {
      e.preventDefault();

      const date = document.getElementById("appointmentDate").value;
      const time = document.getElementById("appointmentTime").value;
      const startTime = time.split('-')[0];

      if (!date || !time) {
        alert("Please select both date and time.");
        return;
      }

      const updatedAppointment = {
        appointmentId: Number(appointmentId),
        doctor: { doctorId: Number(doctor.doctorId) },
        patient: { patientId: Number(patientId) },
        appointmentTime: `${date}T${startTime}:00`,
        status: "SCHEDULED"
      };

      const updateResponse = await updateAppointment(updatedAppointment, token);

      if (updateResponse.success) {
        alert("Appointment updated successfully!");
        window.location.href = "/pages/patientAppointments.html";
      } else {
        alert("Failed to update appointment: " + updateResponse.message);
      }
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    alert("Failed to load doctor data.");
  }
}
