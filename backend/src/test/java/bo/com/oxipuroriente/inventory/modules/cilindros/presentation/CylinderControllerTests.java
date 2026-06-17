package bo.com.oxipuroriente.inventory.modules.cilindros.presentation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import bo.com.oxipuroriente.inventory.modules.cilindros.domain.Cylinder;
import bo.com.oxipuroriente.inventory.modules.cilindros.domain.CylinderLocationType;
import bo.com.oxipuroriente.inventory.modules.cilindros.infrastructure.CylinderRepository;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class CylinderControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CylinderRepository cylinderRepository;

    @Test
    void createsCylinderWithPriceAndInitialPlantLocation() throws Exception {
        JsonNode response = postCylinder("""
                {
                  "serialNumber": "CYL-001",
                  "capacityM3": 6.00,
                  "owner": "OXIPUR Oriente SRL",
                  "price": 1250.50,
                  "active": true,
                  "status": "FILLED",
                  "ownerType": "COMPANY",
                  "currentLocationType": "CLIENTE",
                  "currentCustomerName": "Cliente manual",
                  "locationDate": "2026-06-01"
                }
                """);

        assertThat(response.get("price").decimalValue()).isEqualByComparingTo(new BigDecimal("1250.50"));
        assertThat(response.get("status").asText()).isEqualTo("AVAILABLE");
        assertThat(response.get("ownerType").asText()).isEqualTo("COMPANY");
        assertThat(response.get("currentLocationType").asText()).isEqualTo("PLANTA");
        assertThat(response.get("currentCustomerName").isNull()).isTrue();
    }

    @Test
    void createsCylinderWithoutPrice() throws Exception {
        JsonNode response = postCylinder("""
                {
                  "serialNumber": "CYL-NO-PRICE",
                  "capacityM3": 6.00,
                  "owner": "OXIPUR Oriente SRL",
                  "ownerType": "COMPANY"
                }
                """);

        assertThat(response.get("price").isNull()).isTrue();
        assertThat(response.get("ownerType").asText()).isEqualTo("COMPANY");
    }

    @Test
    void rejectsCylinderWithNegativePrice() throws Exception {
        mockMvc.perform(post("/api/cylinders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "serialNumber": "CYL-NEG",
                                  "capacityM3": 6.00,
                                  "owner": "OXIPUR Oriente SRL",
                                  "price": -1.00
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updatesCylinderPrice() throws Exception {
        JsonNode created = postCylinder("""
                {
                  "serialNumber": "CYL-002",
                  "capacityM3": 6.00,
                  "owner": "OXIPUR Oriente SRL"
                }
                """);

        JsonNode updated = objectMapper.readTree(mockMvc.perform(patch("/api/cylinders/{id}", created.get("id").longValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "price": 1400.75
                                }
                                """))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString());

        assertThat(updated.get("price").decimalValue()).isEqualByComparingTo(new BigDecimal("1400.75"));
    }

    @Test
    void rejectsDuplicateSerialNumber() throws Exception {
        postCylinder("""
                {
                  "serialNumber": "CYL-DUP",
                  "capacityM3": 6.00,
                  "owner": "OXIPUR Oriente SRL"
                }
                """);

        mockMvc.perform(post("/api/cylinders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "serialNumber": "CYL-DUP",
                                  "capacityM3": 8.00,
                                  "owner": "OXIPUR Oriente SRL"
                                }
                                """))
                .andExpect(status().isConflict());
    }

    @Test
    void updateDoesNotModifyCurrentLocationOrCustomer() throws Exception {
        JsonNode created = postCylinder("""
                {
                  "serialNumber": "CYL-LOCATION",
                  "capacityM3": 10.00,
                  "owner": "OXIPUR Oriente SRL"
                }
                """);

        JsonNode updated = objectMapper.readTree(mockMvc.perform(patch("/api/cylinders/{id}", created.get("id").longValue())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "currentLocationType": "CLIENTE",
                                  "currentCustomerName": "Cliente de prueba",
                                  "locationDate": "2026-06-01",
                                  "locationObservation": "Registro migrado desde papel",
                                  "status": "FILLED"
                                }
                                """))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString());

        assertThat(updated.get("currentLocationType").asText()).isEqualTo("PLANTA");
        assertThat(updated.get("currentCustomerName").isNull()).isTrue();
        assertThat(updated.get("status").asText()).isEqualTo("AVAILABLE");
    }

    @Test
    void updateKeepsExistingCustomerInformationReadOnly() throws Exception {
        Cylinder cylinder = new Cylinder();
        cylinder.setSerialNumber("CYL-READONLY-CUSTOMER");
        cylinder.setCapacityM3(new BigDecimal("8.00"));
        cylinder.setOwner("OXIPUR Oriente SRL");
        cylinder.setCurrentLocationType(CylinderLocationType.CLIENTE);
        cylinder.setCurrentCustomerName("Cliente original");
        cylinder = cylinderRepository.save(cylinder);

        JsonNode updated = objectMapper.readTree(mockMvc.perform(patch("/api/cylinders/{id}", cylinder.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "currentLocationType": "PLANTA",
                                  "currentCustomerName": "Cliente editado",
                                  "price": 900.00
                                }
                                """))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString());

        assertThat(updated.get("currentLocationType").asText()).isEqualTo("CLIENTE");
        assertThat(updated.get("currentCustomerName").asText()).isEqualTo("Cliente original");
        assertThat(updated.get("price").decimalValue()).isEqualByComparingTo(new BigDecimal("900.00"));
    }

    private JsonNode postCylinder(String body) throws Exception {
        String response = mockMvc.perform(post("/api/cylinders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return objectMapper.readTree(response);
    }
}
