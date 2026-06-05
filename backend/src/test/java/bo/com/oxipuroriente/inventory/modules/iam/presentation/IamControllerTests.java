package bo.com.oxipuroriente.inventory.modules.iam.presentation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

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
class IamControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void logsInWithValidProfileCredentials() throws Exception {
        String username = "user-" + UUID.randomUUID();
        createProfile(username, "Clave123");

        JsonNode response = objectMapper.readTree(mockMvc.perform(post("/api/iam/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "%s",
                                  "password": "Clave123"
                                }
                                """.formatted(username)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString());

        assertThat(response.get("accessToken").asText()).isNotBlank();
        assertThat(response.get("tokenType").asText()).isEqualTo("Bearer");
        assertThat(response.get("profile").get("username").asText()).isEqualTo(username);
        assertThat(response.get("profile").get("online").asBoolean()).isTrue();
    }

    @Test
    void rejectsInvalidPassword() throws Exception {
        String username = "user-" + UUID.randomUUID();
        createProfile(username, "Clave123");

        mockMvc.perform(post("/api/iam/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "%s",
                                  "password": "incorrecta"
                                }
                                """.formatted(username)))
                .andExpect(status().isUnauthorized());
    }

    private void createProfile(String username, String password) throws Exception {
        mockMvc.perform(post("/api/profiles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "fullName": "Perfil %s",
                                  "roleName": "OPERADOR",
                                  "username": "%s",
                                  "password": "%s"
                                }
                                """.formatted(username, username, password)))
                .andExpect(status().isCreated());
    }
}
