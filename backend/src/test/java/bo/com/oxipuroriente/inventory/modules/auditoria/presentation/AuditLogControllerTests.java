package bo.com.oxipuroriente.inventory.modules.auditoria.presentation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
@AutoConfigureMockMvc(addFilters = false)
class AuditLogControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void recordsCustomerCreationWithRequestMetadata() throws Exception {
        String customerName = "Cliente auditoria " + UUID.randomUUID();
        JsonNode customer = objectMapper.readTree(mockMvc.perform(post("/api/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "%s",
                                  "active": true
                                }
                                """.formatted(customerName)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString());

        JsonNode auditLog = firstAuditLog("CUSTOMER", customer.get("id").asText());

        assertThat(auditLog.get("action").asText()).isEqualTo("CREATE");
        assertThat(auditLog.get("requestMethod").asText()).isEqualTo("POST");
        assertThat(auditLog.get("requestPath").asText()).isEqualTo("/api/customers");
        assertThat(auditLog.get("newData").asText()).contains(customerName.toUpperCase());
    }

    @Test
    void neverStoresUserPasswordOrHashInAuditData() throws Exception {
        String suffix = UUID.randomUUID().toString();
        JsonNode profile = objectMapper.readTree(mockMvc.perform(post("/api/profiles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "fullName": "Usuario auditado %s",
                                  "roleName": "OPERADOR",
                                  "username": "audit-%s",
                                  "password": "Clave123"
                                }
                                """.formatted(suffix, suffix)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString());

        JsonNode auditLog = firstAuditLog("USER_PROFILE", profile.get("id").asText());
        String newData = auditLog.get("newData").asText();

        assertThat(newData).contains("audit-" + suffix);
        assertThat(newData).doesNotContain("Clave123");
        assertThat(newData).doesNotContainIgnoringCase("password");
        assertThat(auditLog.get("previousData").isNull()).isTrue();
    }

    private JsonNode firstAuditLog(String entityType, String entityId) throws Exception {
        JsonNode page = objectMapper.readTree(mockMvc.perform(get("/api/audit-logs")
                        .queryParam("entityType", entityType)
                        .queryParam("entityId", entityId))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString());

        assertThat(page.get("content").size()).isEqualTo(1);
        return page.get("content").get(0);
    }
}

