package bo.com.oxipuroriente.inventory.modules.ventas.presentation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.LocalDate;
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
@AutoConfigureMockMvc
class SalesNoteControllerTests {

    private static final AtomicInteger SEQUENCE = new AtomicInteger();

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CylinderRepository cylinderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WarehouseRepository warehouseRepository;

    @Test
    void createsSalesNoteWithDeliveredCylinderAndGeneratesMovement() throws Exception {
        Warehouse warehouse = mainWarehouse();
        Product product = createProduct();
        Cylinder cylinder = createCylinderInPlant(warehouse.getId());

        JsonNode response = postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "Cliente Entrega",
                  "noteDate": "2026-06-02T10:30:00",
                  "deliveredCylinders": [
                    {
                      "cylinderId": %d,
                      "productId": %d,
                      "capacityM3": 7.50,
                      "ownerName": "Propiedad Entrega",
                      "observations": "Entrega operativa"
                    }
                  ]
                }
                """.formatted(next("NV-DEL"), cylinder.getId(), product.getId()));

        assertThat(response.get("movements").size()).isEqualTo(1);
        assertThat(response.get("movements").get(0).get("movementType").asText()).isEqualTo("PLANTA_A_CLIENTE");
        assertThat(response.get("deliveredCylinders").get(0).get("capacityM3").decimalValue())
                .isEqualByComparingTo(new BigDecimal("7.50"));
        assertThat(response.get("deliveredCylinders").get(0).get("ownerName").asText())
                .isEqualTo("Propiedad Entrega");

        Cylinder updated = cylinderRepository.findById(cylinder.getId()).orElseThrow();
        assertThat(updated.getCurrentLocationType()).isEqualTo(CylinderLocationType.CLIENTE);
        assertThat(updated.getCurrentCustomerName()).isEqualTo("CLIENTE ENTREGA");
    }

    @Test
    void createsSalesNoteWithCollectedCylinderAndGeneratesMovement() throws Exception {
        Warehouse warehouse = mainWarehouse();
        Product product = createProduct();
        Cylinder cylinder = createCylinderInCustomer("Cliente Retorno");

        JsonNode response = postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "Cliente Retorno",
                  "noteDate": "2026-06-02T11:30:00",
                  "collectedCylinders": [
                    {
                      "cylinderId": %d,
                      "productId": %d,
                      "capacityM3": 5.25,
                      "ownerName": "Propiedad Recojo",
                      "observations": "Recojo operativo"
                    }
                  ]
                }
                """.formatted(next("NV-COL"), cylinder.getId(), product.getId()));

        assertThat(response.get("movements").size()).isEqualTo(1);
        assertThat(response.get("movements").get(0).get("movementType").asText()).isEqualTo("CLIENTE_A_PLANTA");
        assertThat(response.get("movements").get(0).get("productId").longValue()).isEqualTo(product.getId());
        assertThat(response.get("movements").get(0).get("originCustomerName").asText()).isEqualTo("CLIENTE RETORNO");
        assertThat(response.get("collectedCylinders").get(0).has("originCustomerName")).isFalse();
        assertThat(response.get("collectedCylinders").get(0).get("productId").longValue()).isEqualTo(product.getId());
        assertThat(response.get("collectedCylinders").get(0).get("productName").asText()).isEqualTo(product.getName());
        assertThat(response.get("collectedCylinders").get(0).get("capacityM3").decimalValue())
                .isEqualByComparingTo(new BigDecimal("5.25"));
        assertThat(response.get("collectedCylinders").get(0).get("ownerName").asText())
                .isEqualTo("Propiedad Recojo");

        Cylinder updated = cylinderRepository.findById(cylinder.getId()).orElseThrow();
        assertThat(updated.getCurrentLocationType()).isEqualTo(CylinderLocationType.PLANTA);
        assertThat(updated.getCurrentWarehouseId()).isEqualTo(warehouse.getId());
        assertThat(updated.getCurrentCustomerName()).isNull();
    }

    @Test
    void createsSalesNoteWithDeliveredAndCollectedCylinders() throws Exception {
        Warehouse warehouse = mainWarehouse();
        Product product = createProduct();
        Cylinder delivered = createCylinderInPlant(warehouse.getId());
        Cylinder collected = createCylinderInCustomer("Cliente Mixto");

        JsonNode response = postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "Cliente Mixto",
                  "noteDate": "2026-06-02T12:30:00",
                  "deliveredCylinders": [
                    {
                      "cylinderId": %d,
                      "productId": %d
                    }
                  ],
                "collectedCylinders": [
                  {
                    "cylinderId": %d
                  }
                ]
                }
                """.formatted(next("NV-MIX"), delivered.getId(), product.getId(), collected.getId()));

        assertThat(response.get("movements").size()).isEqualTo(2);
    }

    @Test
    void rejectsEmptySalesNote() throws Exception {
        mockMvc.perform(post("/api/sales-notes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "noteNumber": "NV-EMPTY",
                                  "customerName": "Cliente",
                                  "noteDate": "2026-06-02T10:30:00"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rejectsDuplicateNoteNumber() throws Exception {
        Warehouse warehouse = mainWarehouse();
        Product product = createProduct();
        Cylinder first = createCylinderInPlant(warehouse.getId());
        String noteNumber = next("NV-DUP");

        postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "Cliente",
                  "noteDate": "2026-06-02T10:30:00",
                  "deliveredCylinders": [
                    {
                      "cylinderId": %d,
                      "productId": %d
                    }
                  ]
                }
                """.formatted(noteNumber, first.getId(), product.getId()));

        Cylinder second = createCylinderInPlant(warehouse.getId());
        mockMvc.perform(post("/api/sales-notes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "noteNumber": "%s",
                                  "customerName": "Cliente",
                                  "noteDate": "2026-06-02T10:30:00",
                                  "deliveredCylinders": [
                                    {
                                      "cylinderId": %d,
                                      "productId": %d
                                    }
                                  ]
                                }
                                """.formatted(noteNumber, second.getId(), product.getId())))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createsDeliveredLineEvenWhenCylinderIsAlreadyWithCustomer() throws Exception {
        Warehouse warehouse = mainWarehouse();
        Product product = createProduct();
        Cylinder cylinder = createCylinderInCustomer("Cliente Actual");

        JsonNode response = postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "Cliente",
                  "noteDate": "2026-06-02T10:30:00",
                  "deliveredCylinders": [
                    {
                      "cylinderId": %d,
                      "productId": %d
                    }
                  ]
                }
                """.formatted(next("NV-FLEX-DEL"), cylinder.getId(), product.getId()));

        assertThat(response.get("movements").get(0).get("movementType").asText()).isEqualTo("PLANTA_A_CLIENTE");
        Cylinder updated = cylinderRepository.findById(cylinder.getId()).orElseThrow();
        assertThat(updated.getCurrentLocationType()).isEqualTo(CylinderLocationType.CLIENTE);
        assertThat(updated.getCurrentCustomerName()).isEqualTo("CLIENTE");
    }

    @Test
    void createsCollectedLineEvenWhenCylinderIsAlreadyInPlant() throws Exception {
        Warehouse warehouse = mainWarehouse();
        Cylinder cylinder = createCylinderInPlant(warehouse.getId());

        JsonNode response = postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "Cliente",
                  "noteDate": "2026-06-02T10:30:00",
                "collectedCylinders": [
                  {
                    "cylinderId": %d
                  }
                ]
                }
                """.formatted(next("NV-FLEX-COL"), cylinder.getId()));

        assertThat(response.get("movements").get(0).get("movementType").asText()).isEqualTo("CLIENTE_A_PLANTA");
        assertThat(response.get("movements").get(0).get("originCustomerName").asText()).isEqualTo("CLIENTE");
        Cylinder updated = cylinderRepository.findById(cylinder.getId()).orElseThrow();
        assertThat(updated.getCurrentLocationType()).isEqualTo(CylinderLocationType.PLANTA);
        assertThat(updated.getCurrentWarehouseId()).isEqualTo(warehouse.getId());
        assertThat(updated.getCurrentCustomerName()).isNull();
    }

    @Test
    void findsSalesNoteDetailWithGeneratedMovements() throws Exception {
        Warehouse warehouse = mainWarehouse();
        Product product = createProduct();
        Cylinder cylinder = createCylinderInPlant(warehouse.getId());

        JsonNode created = postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "Cliente Consulta",
                  "noteDate": "2026-06-02T10:30:00",
                  "deliveredCylinders": [
                    {
                      "cylinderId": %d,
                      "productId": %d
                    }
                  ]
                }
                """.formatted(next("NV-GET"), cylinder.getId(), product.getId()));

        JsonNode detail = objectMapper.readTree(mockMvc.perform(get("/api/sales-notes/{id}", created.get("id").longValue()))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString());

        assertThat(detail.get("deliveredCylinders").size()).isEqualTo(1);
        assertThat(detail.get("movements").size()).isEqualTo(1);
    }

    @Test
    void filtersSalesNotesByDayMonthAndYear() throws Exception {
        Warehouse warehouse = mainWarehouse();
        Product product = createProduct();
        Cylinder dayCylinder = createCylinderInPlant(warehouse.getId());
        Cylinder monthCylinder = createCylinderInPlant(warehouse.getId());
        Cylinder yearCylinder = createCylinderInPlant(warehouse.getId());

        postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "Cliente Fecha Dia",
                  "noteDate": "2026-06-05T10:30:00",
                  "utilityAmount": 20.00,
                  "deliveredCylinders": [
                    {
                      "cylinderId": %d,
                      "productId": %d
                    }
                  ]
                }
                """.formatted(next("NV-DAY"), dayCylinder.getId(), product.getId()));
        postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "Cliente Fecha Mes",
                  "noteDate": "2026-06-20T10:30:00",
                  "utilityAmount": 30.00,
                  "deliveredCylinders": [
                    {
                      "cylinderId": %d,
                      "productId": %d
                    }
                  ]
                }
                """.formatted(next("NV-MONTH"), monthCylinder.getId(), product.getId()));
        postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "Cliente Fecha Anio",
                  "noteDate": "2027-01-10T10:30:00",
                  "utilityAmount": 40.00,
                  "deliveredCylinders": [
                    {
                      "cylinderId": %d,
                      "productId": %d
                    }
                  ]
                }
                """.formatted(next("NV-YEAR"), yearCylinder.getId(), product.getId()));

        JsonNode byDay = getJson("/api/sales-notes?dateFilterType=DAY&date=2026-06-05");
        JsonNode byMonth = getJson("/api/sales-notes?dateFilterType=MONTH&year=2026&month=6");
        JsonNode byYear = getJson("/api/sales-notes?dateFilterType=YEAR&year=2027");

        assertThat(hasNoteForCustomer(byDay, "CLIENTE FECHA DIA")).isTrue();
        assertThat(hasNoteForCustomer(byDay, "CLIENTE FECHA MES")).isFalse();
        assertThat(hasNoteForCustomer(byMonth, "CLIENTE FECHA DIA")).isTrue();
        assertThat(hasNoteForCustomer(byMonth, "CLIENTE FECHA MES")).isTrue();
        assertThat(hasNoteForCustomer(byMonth, "CLIENTE FECHA ANIO")).isFalse();
        assertThat(hasNoteForCustomer(byYear, "CLIENTE FECHA ANIO")).isTrue();
    }

    @Test
    void summarizesUtilitiesAndExcludesCancelledNotes() throws Exception {
        Warehouse warehouse = mainWarehouse();
        Product product = createProduct();
        Cylinder registered = createCylinderInPlant(warehouse.getId());
        Cylinder cancelled = createCylinderInPlant(warehouse.getId());
        Cylinder anotherMonth = createCylinderInPlant(warehouse.getId());

        postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "Cliente Utilidad Registrada",
                  "noteDate": "2028-08-05T10:30:00",
                  "utilityAmount": 125.50,
                  "deliveredCylinders": [
                    {
                      "cylinderId": %d,
                      "productId": %d
                    }
                  ]
                }
                """.formatted(next("NV-UTIL-OK"), registered.getId(), product.getId()));
        JsonNode cancelledNote = postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "Cliente Utilidad Anulada",
                  "noteDate": "2028-08-05T11:30:00",
                  "utilityAmount": 70.00,
                  "deliveredCylinders": [
                    {
                      "cylinderId": %d,
                      "productId": %d
                    }
                  ]
                }
                """.formatted(next("NV-UTIL-CAN"), cancelled.getId(), product.getId()));
        postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "Cliente Utilidad Julio",
                  "noteDate": "2028-09-01T09:30:00",
                  "utilityAmount": 30.00,
                  "deliveredCylinders": [
                    {
                      "cylinderId": %d,
                      "productId": %d
                    }
                  ]
                }
                """.formatted(next("NV-UTIL-JUL"), anotherMonth.getId(), product.getId()));
        mockMvc.perform(patch("/api/sales-notes/{id}/cancel", cancelledNote.get("id").longValue()))
                .andExpect(status().isOk());

        JsonNode total = getJson("/api/utilities/summary");
        JsonNode byDay = getJson("/api/utilities/summary?dateFilterType=DAY&date=2028-08-05");
        JsonNode byMonth = getJson("/api/utilities/summary?dateFilterType=MONTH&year=2028&month=8");
        JsonNode byYear = getJson("/api/utilities/summary?dateFilterType=YEAR&year=2028");

        assertThat(total.get("totalUtility").decimalValue()).isGreaterThanOrEqualTo(new BigDecimal("155.50"));
        assertThat(byDay.get("totalUtility").decimalValue()).isEqualByComparingTo(new BigDecimal("125.50"));
        assertThat(byDay.get("salesNotesCount").asLong()).isEqualTo(1);
        assertThat(byMonth.get("totalUtility").decimalValue()).isEqualByComparingTo(new BigDecimal("125.50"));
        assertThat(byYear.get("totalUtility").decimalValue()).isEqualByComparingTo(new BigDecimal("155.50"));
    }

    @Test
    void filtersInventoryMovementsByDatePeriod() throws Exception {
        Warehouse warehouse = mainWarehouse();
        Product product = createProduct();
        Cylinder juneCylinder = createCylinderInPlant(warehouse.getId());
        Cylinder julyCylinder = createCylinderInPlant(warehouse.getId());

        postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "Cliente Movimiento Junio",
                  "noteDate": "2026-06-05T10:30:00",
                  "deliveredCylinders": [
                    {
                      "cylinderId": %d,
                      "productId": %d
                    }
                  ]
                }
                """.formatted(next("NV-MOV-JUN"), juneCylinder.getId(), product.getId()));
        postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "Cliente Movimiento Julio",
                  "noteDate": "2026-07-05T10:30:00",
                  "deliveredCylinders": [
                    {
                      "cylinderId": %d,
                      "productId": %d
                    }
                  ]
                }
                """.formatted(next("NV-MOV-JUL"), julyCylinder.getId(), product.getId()));

        JsonNode byDay = getJson("/api/inventory-movements?dateFilterType=DAY&date=2026-06-05");
        JsonNode byMonth = getJson("/api/inventory-movements?dateFilterType=MONTH&year=2026&month=7");

        assertThat(hasMovementForCylinder(byDay, juneCylinder.getId())).isTrue();
        assertThat(hasMovementForCylinder(byDay, julyCylinder.getId())).isFalse();
        assertThat(hasMovementForCylinder(byMonth, julyCylinder.getId())).isTrue();
    }

    @Test
    void cancelsDeliveredSalesNoteAndReturnsCylinderToPlant() throws Exception {
        Warehouse warehouse = mainWarehouse();
        Product product = createProduct();
        Cylinder cylinder = createCylinderInPlant(warehouse.getId());

        JsonNode created = postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "Cliente Cancelacion Entrega",
                  "noteDate": "2026-06-02T10:30:00",
                  "deliveredCylinders": [
                    {
                      "cylinderId": %d,
                      "productId": %d
                    }
                  ]
                }
                """.formatted(next("NV-CAN-DEL"), cylinder.getId(), product.getId()));

        JsonNode cancelled = objectMapper.readTree(mockMvc.perform(patch("/api/sales-notes/{id}/cancel", created.get("id").longValue()))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString());

        assertThat(cancelled.get("status").asText()).isEqualTo("CANCELLED");
        assertThat(cancelled.get("movements").size()).isEqualTo(2);
        assertThat(cancelled.get("movements").get(1).get("movementType").asText()).isEqualTo("CLIENTE_A_PLANTA");
        assertThat(cancelled.get("movements").get(1).get("sourceType").asText()).isEqualTo("SYSTEM");

        Cylinder updated = cylinderRepository.findById(cylinder.getId()).orElseThrow();
        assertThat(updated.getCurrentLocationType()).isEqualTo(CylinderLocationType.PLANTA);
        assertThat(updated.getCurrentWarehouseId()).isEqualTo(warehouse.getId());
        assertThat(updated.getCurrentCustomerName()).isNull();
    }

    @Test
    void cancelsCollectedSalesNoteAndReturnsCylinderToCustomer() throws Exception {
        Cylinder cylinder = createCylinderInCustomer("Cliente Cancelacion Recojo");

        JsonNode created = postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "Cliente Cancelacion Recojo",
                  "noteDate": "2026-06-02T10:30:00",
                "collectedCylinders": [
                  {
                    "cylinderId": %d
                  }
                ]
                }
                """.formatted(next("NV-CAN-COL"), cylinder.getId()));

        JsonNode cancelled = objectMapper.readTree(mockMvc.perform(patch("/api/sales-notes/{id}/cancel", created.get("id").longValue()))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString());

        assertThat(cancelled.get("status").asText()).isEqualTo("CANCELLED");
        assertThat(cancelled.get("movements").size()).isEqualTo(2);
        assertThat(cancelled.get("movements").get(1).get("movementType").asText()).isEqualTo("PLANTA_A_CLIENTE");
        assertThat(cancelled.get("movements").get(1).get("sourceType").asText()).isEqualTo("SYSTEM");

        Cylinder updated = cylinderRepository.findById(cylinder.getId()).orElseThrow();
        assertThat(updated.getCurrentLocationType()).isEqualTo(CylinderLocationType.CLIENTE);
        assertThat(updated.getCurrentCustomerName()).isEqualTo("CLIENTE CANCELACION RECOJO");
    }

    @Test
    void createsCollectedCylinderUsingSalesNoteCustomerAsOrigin() throws Exception {
        Cylinder cylinder = createCylinderInCustomer("Cliente Recojo");

        JsonNode response = postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "Cliente Recojo",
                  "noteDate": "2026-06-02T10:30:00",
                  "collectedCylinders": [
                    {
                      "cylinderId": %d
                    }
                  ]
                }
                """.formatted(next("NV-COL-NO-CUSTOMER"), cylinder.getId()));

        assertThat(response.get("movements").get(0).get("movementType").asText()).isEqualTo("CLIENTE_A_PLANTA");
        assertThat(response.get("movements").get(0).get("originCustomerName").asText()).isEqualTo("CLIENTE RECOJO");
    }

    @Test
    void createsCollectedLineEvenWhenCylinderBelongsToDifferentCustomer() throws Exception {
        Cylinder cylinder = createCylinderInCustomer("Cliente Actual");

        JsonNode response = postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "Cliente Diferente",
                  "noteDate": "2026-06-02T10:30:00",
                "collectedCylinders": [
                  {
                    "cylinderId": %d
                  }
                ]
                }
                """.formatted(next("NV-COL-FLEX-CUSTOMER"), cylinder.getId()));

        assertThat(response.get("movements").get(0).get("movementType").asText()).isEqualTo("CLIENTE_A_PLANTA");
        assertThat(response.get("movements").get(0).get("originCustomerName").asText()).isEqualTo("CLIENTE DIFERENTE");
        Cylinder updated = cylinderRepository.findById(cylinder.getId()).orElseThrow();
        assertThat(updated.getCurrentLocationType()).isEqualTo(CylinderLocationType.PLANTA);
        assertThat(updated.getCurrentCustomerName()).isNull();
    }

    private JsonNode postSalesNote(String body) throws Exception {
        String response = mockMvc.perform(post("/api/sales-notes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        return objectMapper.readTree(response);
    }

    private JsonNode getJson(String path) throws Exception {
        String response = mockMvc.perform(get(path))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        return objectMapper.readTree(response);
    }

    private boolean hasNoteForCustomer(JsonNode notes, String customerName) {
        for (JsonNode note : notes) {
            if (customerName.equals(note.get("customerName").asText())) {
                return true;
            }
        }
        return false;
    }

    private boolean hasMovementForCylinder(JsonNode movements, Long cylinderId) {
        for (JsonNode movement : movements) {
            if (movement.get("cylinderId").longValue() == cylinderId) {
                return true;
            }
        }
        return false;
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
        product.setCode(next("PROD"));
        product.setName("Producto de prueba");
        return productRepository.save(product);
    }

    private Cylinder createCylinderInPlant(Long warehouseId) {
        Cylinder cylinder = baseCylinder();
        cylinder.setCurrentLocationType(CylinderLocationType.PLANTA);
        cylinder.setCurrentWarehouseId(warehouseId);
        cylinder.setLocationDate(LocalDate.of(2026, 6, 1));
        return cylinderRepository.save(cylinder);
    }

    private Cylinder createCylinderInCustomer(String customerName) {
        Cylinder cylinder = baseCylinder();
        cylinder.setCurrentLocationType(CylinderLocationType.CLIENTE);
        cylinder.setCurrentCustomerName(customerName);
        cylinder.setLocationDate(LocalDate.of(2026, 6, 1));
        return cylinderRepository.save(cylinder);
    }

    private Cylinder baseCylinder() {
        Cylinder cylinder = new Cylinder();
        cylinder.setSerialNumber(next("CYL"));
        cylinder.setCapacityM3(new BigDecimal("6.00"));
        cylinder.setOwner("OXIPUR Oriente SRL");
        return cylinder;
    }

    private String next(String prefix) {
        return prefix + "-" + SEQUENCE.incrementAndGet();
    }
}
