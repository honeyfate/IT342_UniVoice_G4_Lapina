package com.univoice.backend.controller;

// Add these two lines to connect your folders
import com.univoice.backend.entity.User;
import com.univoice.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        if(userRepository.existsById(user.getIdNumber())) {
            return "User with this ID already exists!";
        }
        userRepository.save(user);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public String loginUser(@RequestBody User loginRequest) {
        return userRepository.findByIdNumber(loginRequest.getIdNumber())
                .filter(user -> user.getPassword().equals(loginRequest.getPassword()))
                .map(user -> "Login successful! Welcome " + user.getFullName())
                .orElse("Invalid ID Number or Password");
    }
}