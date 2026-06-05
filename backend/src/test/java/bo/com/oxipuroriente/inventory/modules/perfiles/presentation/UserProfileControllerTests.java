package bo.com.oxipuroriente.inventory.modules.perfiles.presentation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;
import java.util.stream.StreamSupport;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
class UserProfileControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createsProfileOnlineWithLastActivity() throws Exception {
        JsonNode response = postProfile(uniqueName("Operador"), "OPERADOR");

        assertThat(response.get("fullName").asText()).startsWith("Operador");
        assertThat(response.get("roleName").asText()).isEqualTo("OPERADOR");
        assertThat(response.get("online").asBoolean()).isTrue();
        assertThat(response.get("lastActivityAt").asText()).isNotBlank();
    }

    @Test
    void listsProfiles() throws Exception {
        String fullName = uniqueName("Administrador");
        postProfile(fullName, "ADMIN");

        JsonNode response = objectMapper.readTree(mockMvc.perform(get("/api/profiles"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString());

        assertThat(StreamSupport.stream(response.spliterator(), false))
                .anyMatch(profile -> profile.get("fullName").asText().equals(fullName));
    }

    @Test
    void marksProfileActivity() throws Exception {
        JsonNode created = postProfile(uniqueName("Actividad"), "OPERADOR");

        JsonNode updated = objectMapper.readTree(mockMvc.perform(patch("/api/profiles/{id}/activity", created.get("id").longValue()))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString());

        assertThat(updated.get("online").asBoolean()).isTrue();
        assertThat(updated.get("lastActivityAt").asText()).isNotBlank();
    }

    @Test
    void updatesProfile() throws Exception {
        JsonNode created = postProfile(uniqueName("Editable"), "OPERADOR");
        String newFullName = uniqueName("Administrador editado");
        String newUsername = "admin-editado-" + UUID.randomUUID();

        JsonNode updated = objectMapper.readTree(mockMvc.perform(put("/api/profiles/{id}", created.get("id").longValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "fullName": "%s",
                                  "roleName": "ADMINISTRADOR",
                                  "username": "%s",
                                  "password": ""
                                }
                                """.formatted(newFullName, newUsername)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString());

        assertThat(updated.get("fullName").asText()).isEqualTo(newFullName);
        assertThat(updated.get("username").asText()).isEqualTo(newUsername);
        assertThat(updated.get("roleName").asText()).isEqualTo("ADMINISTRADOR");
    }

    @Test
    void deletesProfile() throws Exception {
        JsonNode created = postProfile(uniqueName("Eliminar"), "OPERADOR");

        mockMvc.perform(delete("/api/profiles/{id}", created.get("id").longValue()))
                .andExpect(status().isNoContent());

        mockMvc.perform(patch("/api/profiles/{id}/activity", created.get("id").longValue()))
                .andExpect(status().isNotFound());
    }

    @Test
    void rejectsDuplicateProfileName() throws Exception {
        String fullName = uniqueName("Duplicado");
        postProfile(fullName, "ADMIN");

        mockMvc.perform(post("/api/profiles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "fullName": "%s",
                                  "roleName": "OPERADOR"
                                }
                                """.formatted(fullName)))
                .andExpect(status().isConflict());
    }

    private JsonNode postProfile(String fullName, String roleName) throws Exception {
        String response = mockMvc.perform(post("/api/profiles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "fullName": "%s",
                                  "roleName": "%s"
                                }
                                """.formatted(fullName, roleName)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return objectMapper.readTree(response);
    }

    private String uniqueName(String prefix) {
        return prefix + " " + UUID.randomUUID();
    }
}
