package com.univoice.backend.repository;

import com.univoice.backend.entity.User; // ADD THIS
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByIdNumber(String idNumber);
}