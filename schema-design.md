Section 1: MySQL Database Design (Relational Data)
The Smart Clinic system stores structured, relational data in MySQL using Spring Data JPA.
The relational schema includes four core tables: patients, doctors, appointments, and admin.
Each table is normalized and uses primary and foreign keys to maintain data integrity.
-Patients Table
| Column Name     | Type           | Constraints |
|-----------------|----------------|-------------|
| patient_id      | INT            | PRIMARY KEY, AUTO_INCREMENT |
| first_name      | VARCHAR(50)    | NOT NULL |
| last_name       | VARCHAR(50)    | NOT NULL |
| email           | VARCHAR(100)   | NOT NULL, UNIQUE |
| phone           | VARCHAR(20)    | NOT NULL |
| date_of_birth   | DATE           | NOT NULL |
| created_at      | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP |
-Doctors Table
| Column Name     | Type           | Constraints |
|-----------------|----------------|-------------|
| doctor_id       | INT            | PRIMARY KEY, AUTO_INCREMENT |
| first_name      | VARCHAR(50)    | NOT NULL |
| last_name       | VARCHAR(50)    | NOT NULL |
| specialty       | VARCHAR(100)   | NOT NULL |
| email           | VARCHAR(100)   | NOT NULL, UNIQUE |
| phone           | VARCHAR(20)    | NOT NULL |
-Appointments Table
| Column Name     | Type           | Constraints |
|-----------------|----------------|-------------|
| appointment_id  | INT            | PRIMARY KEY, AUTO_INCREMENT |
| patient_id      | INT            | FOREIGN KEY → patients(patient_id), NOT NULL |
| doctor_id       | INT            | FOREIGN KEY → doctors(doctor_id), NOT NULL |
| appointment_date| DATETIME       | NOT NULL |
| status          | VARCHAR(20)    | DEFAULT 'SCHEDULED' |
| notes           | TEXT           | NULL |
-Admin Table
| Column Name     | Type           | Constraints |
|-----------------|----------------|-------------|
| admin_id        | INT            | PRIMARY KEY, AUTO_INCREMENT |
| username        | VARCHAR(50)    | NOT NULL, UNIQUE |
| password_hash   | VARCHAR(255)   | NOT NULL |
| role            | VARCHAR(20)    | DEFAULT 'ADMIN' |

Section 2: MongoDB Collection Design (Document Data)
MongoDB stores flexible, document‑based data.
The prescriptions collection is ideal because prescriptions vary in structure and may contain multiple medications, dosage instructions, and notes.

{
  "_id": "67a12f9c8b23d90145ef12aa",
  "patientId": 12,
  "doctorId": 4,
  "issuedDate": "2025-03-12",
  "medications": [
    {
      "name": "Amoxicillin",
      "dosage": "500mg",
      "frequency": "3 times a day",
      "duration_days": 7
    },
    {
      "name": "Ibuprofen",
      "dosage": "200mg",
      "frequency": "as needed",
      "notes": "Take with food"
    }
  ],
  "notes": "Patient should return if symptoms persist.",
  "followUpRequired": true
}
