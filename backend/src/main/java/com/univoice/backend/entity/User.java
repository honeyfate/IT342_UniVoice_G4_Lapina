package com.univoice.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @Column(name = "id_number")
    private String idNumber;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "school_email")
    private String schoolEmail;

    private String password;

    // --- MANUALLY ADDED GETTERS AND SETTERS ---
    public String getIdNumber() { return idNumber; }
    public void setIdNumber(String idNumber) { this.idNumber = idNumber; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getSchoolEmail() { return schoolEmail; }
    public void setSchoolEmail(String schoolEmail) { this.schoolEmail = schoolEmail; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}