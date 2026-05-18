package com.univoice.backend.complaint;

public class ComplaintNotFoundException extends RuntimeException {
    public ComplaintNotFoundException(String id) {
        super("Complaint not found: " + id);
    }
}
