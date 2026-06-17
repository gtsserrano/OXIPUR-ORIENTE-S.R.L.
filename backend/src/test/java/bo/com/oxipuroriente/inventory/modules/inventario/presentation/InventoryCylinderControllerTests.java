package bo.com.oxipuroriente.inventory.modules.inventario.presentation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import bo.com.oxipuroriente.inventory.modules.almacenes.domain.Warehouse;
import bo.com.oxipuroriente.inventory.modules.almacenes.infrastructure.WarehouseRepository;
import bo.com.oxipuroriente.inventory.modules.cilindros.domain.Cylinder;
import bo.com.oxipuroriente.inventory.modules.cilindros.domain.CylinderLocationType;
import bo.com.oxipuroriente.inventory.modules.cilindros.infrastructure.CylinderRepository;
import bo.com.oxipuroriente.inventory.modules.productos.domain.Product;
import bo.com.oxipuroriente.inventory.modules.productos.infrastructure.ProductRepository;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class InventoryCylinderControllerTests {

    private static final AtomicInteger SEQUENCE = new AtomicInteger();

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private WarehouseRepository warehouseRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CylinderRepository cylinderRepository;

    @Test
    void findsCylindersCurrentlyAtCustomerWithLastDeliveryNote() throws Exception {
        Warehouse warehouse = mainWarehouse();
        Product product = createProduct();
        Cylinder cylinder = createCylinderInPlant(warehouse.getId());
        String noteNumber = next("INV-NV");

        createDeliverySalesNote(noteNumber, "Cliente Inventario", cylinder.getId(), product.getId());

        JsonNode response = objectMapper.readTree(mockMvc.perform(get("/api/inventory/cylinders")
                        .param("locationType", "CLIENTE")
                        .param("customerName", "inventario"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString());

        assertThat(response.size()).isEqualTo(1);
        assertThat(response.get(0).get("cylinderId").longValue()).isEqualTo(cylinder.getId());
        assertThat(response.get(0).get("currentCustomerName").asText()).isEqualTo("CLIENTE INVENTARIO");
        assertThat(response.get(0).get("lastDeliveryNoteNumber").asText()).isEqualTo(noteNumber);
        assertThat(response.get(0).get("lastDeliveryDate").asText()).isEqualTo("2026-06-03");
    }

    @Test
    void filtersCylindersBySerialNumber() throws Exception {
        Warehouse warehouse = mainWarehouse();
        Cylinder expected = createCylinderInPlant(warehouse.getId());
        createCylinderInPlant(warehouse.getId());

        JsonNode response = objectMapper.readTree(mockMvc.perform(get("/api/inventory/cylinders")
                        .param("serialNumber", expected.getSerialNumber()))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString());

        assertThat(response.size()).isEqualTo(1);
        assertThat(response.get(0).get("serialNumber").asText()).isEqualTo(expected.getSerialNumber());
    }

    @Test
    void summarizesCylindersCurrentlyHeldByCustomer() throws Exception {
        Warehouse warehouse = mainWarehouse();
        Product product = createProduct();
        Cylinder first = createCylinderInPlant(warehouse.getId());
        Cylinder second = createCylinderInPlant(warehouse.getId());
        Cylinder otherCustomer = createCylinderInPlant(warehouse.getId());
        String firstNoteNumber = next("INV-NV-CUST");
        String secondNoteNumber = next("INV-NV-CUST");

        createDeliverySalesNote(firstNoteNumber, "Cliente Resumen", first.getId(), product.getId());
        createDeliverySalesNote(secondNoteNumber, "Cliente Resumen", second.getId(), product.getId());
        createDeliverySalesNote(next("INV-NV-OTHER"), "Cliente Resumen Norte", otherCustomer.getId(), product.getId());

        JsonNode response = objectMapper.readTree(mockMvc.perform(get("/api/inventory/customers/{customerName}/cylinders", "Cliente Resumen"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString());

        assertThat(response.get("customerName").asText()).isEqualTo("CLIENTE RESUMEN");
        assertThat(response.get("totalCylinders").intValue()).isEqualTo(2);
        assertThat(textValues(response.get("cylinders"), "serialNumber"))
                .containsExactlyInAnyOrder(first.getSerialNumber(), second.getSerialNumber());
        assertThat(textValues(response.get("cylinders"), "salesNoteNumber"))
                .containsExactlyInAnyOrder(firstNoteNumber, secondNoteNumber);
        assertThat(response.get("cylinders").get(0).get("deliveredAt").asText()).isEqualTo("2026-06-03");
    }

    private List<String> textValues(JsonNode array, String fieldName) {
        List<String> values = new ArrayList<>();
        for (JsonNode item : array) {
            values.add(item.get(fieldName).asText());
        }
        return values;
    }

    private void createDeliverySalesNote(String noteNumber, String customerName, Long cylinderId, Long productId) throws Exception {
        mockMvc.perform(post("/api/sales-notes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "noteNumber": "%s",
                                  "customerName": "%s",
                                  "noteDate": "2026-06-03T10:30:00",
                                  "deliveredCylinders": [
                                    {
                                      "cylinderId": %d,
                                      "productId": %d
                                    }
                                  ]
                                }
                                """.formatted(noteNumber, customerName, cylinderId, productId)))
                .andExpect(status().isCreated());
    }

    private Warehouse mainWarehouse() {
        return warehouseRepository.findAll()
                .stream()
                .filter(warehouse -> "PLANTA".equals(warehouse.getCode()))
                .findFirst()
                .orElseThrow();
    }

    private Product createProduct() {
        Product product = new Product();
        product.setCode(next("INV-PROD"));
        product.setName("Producto de prueba");
        return productRepository.save(product);
    }

    private Cylinder createCylinderInPlant(Long warehouseId) {
        Cylinder cylinder = new Cylinder();
        cylinder.setSerialNumber(next("INV-CYL"));
        cylinder.setCapacityM3(new BigDecimal("6.00"));
        cylinder.setOwner("OXIPUR Oriente SRL");
        cylinder.setCurrentLocationType(CylinderLocationType.PLANTA);
        cylinder.setCurrentWarehouseId(warehouseId);
        cylinder.setLocationDate(LocalDate.of(2026, 6, 1));
        return cylinderRepository.save(cylinder);
    }

    private String next(String prefix) {
        return prefix + "-" + SEQUENCE.incrementAndGet();
    }
}
