package com.project.back_end.repo;

import com.project.back_end.models.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Doctor findByEmail(String email);

    @Query("SELECT d FROM Doctor d WHERE LOWER(CONCAT(d.firstName, ' ', d.lastName)) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Doctor> findByFullNameContainingIgnoreCase(@Param("name") String name);

    @Query("SELECT d FROM Doctor d WHERE LOWER(CONCAT(d.firstName, ' ', d.lastName)) LIKE LOWER(CONCAT('%', :name, '%')) AND LOWER(d.specialty) = LOWER(:specialty)")
    List<Doctor> findByFullNameContainingIgnoreCaseAndSpecialtyIgnoreCase(@Param("name") String name,
                                                                          @Param("specialty") String specialty);

    List<Doctor> findBySpecialtyIgnoreCase(String specialty);
}