package com.project.back_end.repo;

import com.project.back_end.models.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.doctor d LEFT JOIN FETCH d.availableTimes LEFT JOIN FETCH a.patient WHERE a.doctor.doctorId = :doctorId AND a.appointmentTime BETWEEN :start AND :end")
    List<Appointment> findByDoctorIdAndAppointmentTimeBetween(
            @Param("doctorId") Long doctorId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.doctor LEFT JOIN FETCH a.patient WHERE a.doctor.doctorId = :doctorId AND LOWER(CONCAT(a.patient.firstName, ' ', a.patient.lastName)) LIKE LOWER(CONCAT('%', :patientName, '%')) AND a.appointmentTime BETWEEN :start AND :end")
    List<Appointment> findByDoctorIdAndPatientNameContainingIgnoreCaseAndAppointmentTimeBetween(
            @Param("doctorId") Long doctorId,
            @Param("patientName") String patientName,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Modifying
    @Transactional
    @Query("DELETE FROM Appointment a WHERE a.doctor.doctorId = :doctorId")
    void deleteAllByDoctorId(@Param("doctorId") Long doctorId);

    @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.doctor LEFT JOIN FETCH a.patient WHERE a.patient.patientId = :patientId")
    List<Appointment> findByPatient_PatientId(@Param("patientId") Long patientId);

    @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.doctor LEFT JOIN FETCH a.patient WHERE a.patient.patientId = :patientId AND a.status = :status ORDER BY a.appointmentTime ASC")
    List<Appointment> findByPatient_IdAndStatusOrderByAppointmentTimeAsc(
            @Param("patientId") Long patientId,
            @Param("status") String status);

    @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.doctor LEFT JOIN FETCH a.patient WHERE LOWER(CONCAT(a.doctor.firstName, ' ', a.doctor.lastName)) LIKE LOWER(CONCAT('%', :doctorName, '%')) AND a.patient.patientId = :patientId")
    List<Appointment> filterByDoctorNameAndPatientId(
            @Param("doctorName") String doctorName,
            @Param("patientId") Long patientId);

    @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.doctor LEFT JOIN FETCH a.patient WHERE LOWER(CONCAT(a.doctor.firstName, ' ', a.doctor.lastName)) LIKE LOWER(CONCAT('%', :doctorName, '%')) AND a.patient.patientId = :patientId AND a.status = :status")
    List<Appointment> filterByDoctorNameAndPatientIdAndStatus(
            @Param("doctorName") String doctorName,
            @Param("patientId") Long patientId,
            @Param("status") String status);

    @Modifying
    @Transactional
    @Query("UPDATE Appointment a SET a.status = :status WHERE a.appointmentId = :id")
    void updateStatus(@Param("status") String status, @Param("id") long id);
}
