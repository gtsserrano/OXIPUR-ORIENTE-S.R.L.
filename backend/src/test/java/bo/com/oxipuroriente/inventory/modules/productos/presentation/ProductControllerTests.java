package bo.com.oxipuroriente.inventory.modules.productos.presentation;

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
@AutoConfigureMockMvc
class ProductControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createsProduct() throws Exception {
        JsonNode response = postProduct("""
                {
                  "code": "OXIGENO_MEDICINAL",
                  "name": "Oxigeno medicinal",
                  "description": "Producto comercializado dentro de cilindros"
                }
                """);

        assertThat(response.get("code").asText()).isEqualTo("OXIGENO_MEDICINAL");
        assertThat(response.get("name").asText()).isEqualTo("Oxigeno medicinal");
        assertThat(response.get("active").asBoolean()).isTrue();
    }

    @Test
    void rejectsDuplicateProductCode() throws Exception {
        postProduct("""
                {
                  "code": "CO2",
                  "name": "Dioxido de carbono"
                }
                """);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "code": "CO2",
                                  "name": "CO2 industrial"
                                }
                                """))
                .andExpect(status().isConflict());
    }

    @Test
    void updatesProduct() throws Exception {
        JsonNode created = postProduct("""
                {
                  "code": "NITROGENO",
                  "name": "Nitrogeno"
                }
                """);

        JsonNode updated = objectMapper.readTree(mockMvc.perform(patch("/api/products/{id}", created.get("id").longValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Nitrogeno industrial",
                                  "active": false
                                }
                                """))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString());

        assertThat(updated.get("name").asText()).isEqualTo("Nitrogeno industrial");
        assertThat(updated.get("active").asBoolean()).isFalse();
    }

    private JsonNode postProduct(String body) throws Exception {
        String response = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return objectMapper.readTree(response);
    }
}
