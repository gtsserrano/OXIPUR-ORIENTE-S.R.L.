package bo.com.oxipuroriente.inventory.modules.almacenes.presentation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
class WarehouseControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createsWarehouse() throws Exception {
        JsonNode response = postWarehouse("""
                {
                  "code": "ALM-CREATE",
                  "name": "Planta principal",
                  "address": "Direccion pendiente"
                }
                """);

        assertThat(response.get("code").asText()).isEqualTo("ALM-CREATE");
        assertThat(response.get("name").asText()).isEqualTo("Planta principal");
        assertThat(response.get("active").asBoolean()).isTrue();
    }

    @Test
    void rejectsDuplicateWarehouseCode() throws Exception {
        postWarehouse("""
                {
                  "code": "ALM-01",
                  "name": "Almacen 01"
                }
                """);

        mockMvc.perform(post("/api/warehouses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "code": "ALM-01",
                                  "name": "Almacen duplicado"
                                }
                                """))
                .andExpect(status().isConflict());
    }

    @Test
    void updatesWarehouse() throws Exception {
        JsonNode created = postWarehouse("""
                {
                  "code": "ALM-02",
                  "name": "Almacen 02"
                }
                """);

        JsonNode updated = objectMapper.readTree(mockMvc.perform(patch("/api/warehouses/{id}", created.get("id").longValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Almacen secundario",
                                  "active": false
                                }
                                """))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString());

        assertThat(updated.get("name").asText()).isEqualTo("Almacen secundario");
        assertThat(updated.get("active").asBoolean()).isFalse();
    }

    private JsonNode postWarehouse(String body) throws Exception {
        String response = mockMvc.perform(post("/api/warehouses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return objectMapper.readTree(response);
    }
}
