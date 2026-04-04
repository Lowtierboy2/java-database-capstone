// patientRow.js

export function createPatientRow(patient, appointmentId, doctorId) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td class="patient-id">${patient.id}</td>
        <td>${patient.name}</td>
        <td>${patient.phone}</td>
        <td>${patient.email}</td>
        <td>
            <img
                src="/assets/images/addPrescriptionIcon/addPrescription.png"
                alt="Add Prescription"
                class="prescription-btn"
                data-id="${patient.id}"
            >
        </td>
    `;

    // Navigate to patient record
    tr.querySelector(".patient-id").addEventListener("click", () => {
        window.location.href = `/patient/record?id=${patient.id}&doctorId=${doctorId}`;
    });

    // Navigate to prescription page
    tr.querySelector(".prescription-btn").addEventListener("click", () => {
        window.location.href = `/patient/add-prescription?appointmentId=${appointmentId}&patientName=${patient.name}`;
    });

    return tr;
}