package com.univoice.backend;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ComplaintControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void createUpdateCommentAndDeleteComplaint() throws Exception {
        String created = mockMvc.perform(post("/api/complaints")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Alice Student",
                                  "studentId": "S123",
                                  "email": "alice@example.edu",
                                  "course": "IT342",
                                  "category": "Academic",
                                  "priority": "High",
                                  "subject": "Missing grade",
                                  "description": "My grade is not visible in the portal."
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.status").value("Open"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        String id = created.replaceAll(".*\\\"id\\\":\\\"([^\\\"]+)\\\".*", "$1");

        mockMvc.perform(patch("/api/complaints/{id}/status", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"Resolved\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Resolved"))
                .andExpect(jsonPath("$.resolvedAt").exists());

        mockMvc.perform(post("/api/complaints/{id}/comments", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"text\":\"Registrar notified.\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.text").value("Registrar notified."));

        mockMvc.perform(get("/api/complaints/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.comments[0].text").value("Registrar notified."));

        mockMvc.perform(delete("/api/complaints/{id}", id))
                .andExpect(status().isNoContent());
    }
}
