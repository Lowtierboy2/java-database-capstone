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

    tr.querySelector(".patient-id").addEventListener("click", () => {
        window.location.href = `/pages/patientRecord.html?id=${patient.id}&doctorId=${doctorId}`;
    });

    tr.querySelector(".prescription-btn").addEventListener("click", () => {
        window.location.href = `/pages/addPrescription.html?appointmentId=${appointmentId}&patientName=${encodeURIComponent(patient.name)}`;
    });

    return tr;
}
