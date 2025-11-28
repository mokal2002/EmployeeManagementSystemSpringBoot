package com.namo.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.annotations.ColumnDefault;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;  // ← ADD THIS (not EntityScan)
import jakarta.persistence.Id;      // ← CHANGE THIS (not spring data Id)
import jakarta.persistence.Table;

import lombok.*;

@Entity  // ← MUST USE @Entity, not @EntityScan
@Table(name = "employees")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Employee {
    @Id  // ← Must be jakarta.persistence.Id
    @UuidGenerator 
    private String id;

    @Column(nullable = false, name = "user_name")
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Getter(AccessLevel.NONE)
    private String password;

    private String role;

    @Column(length = 1000, nullable = true)
    private String about;

    @Column(name = "profile_pic", nullable = true)
    private String profilePic;

    @Column(name = "phone_number", nullable = true)
    private String phoneNumber;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ColumnDefault("true")
    @Column(nullable = false)
    private Boolean isEnabled;
}
