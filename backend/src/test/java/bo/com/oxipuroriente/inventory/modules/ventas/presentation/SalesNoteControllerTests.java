package bo.com.oxipuroriente.inventory.modules.ventas.presentation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.junit.jupiter.api.Test;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import bo.com.oxipuroriente.inventory.modules.almacenes.domain.Warehouse;
import bo.com.oxipuroriente.inventory.modules.almacenes.infrastructure.WarehouseRepository;
import bo.com.oxipuroriente.inventory.modules.auditoria.infrastructure.AuditLogRepository;
import bo.com.oxipuroriente.inventory.modules.cilindros.domain.Cylinder;
import bo.com.oxipuroriente.inventory.modules.cilindros.domain.CylinderLocationType;
import bo.com.oxipuroriente.inventory.modules.cilindros.domain.CylinderOwnerType;
import bo.com.oxipuroriente.inventory.modules.cilindros.infrastructure.CylinderRepository;
import bo.com.oxipuroriente.inventory.modules.clientes.domain.Customer;
import bo.com.oxipuroriente.inventory.modules.clientes.domain.CustomerAlias;
import bo.com.oxipuroriente.inventory.modules.clientes.infrastructure.CustomerAliasRepository;
import bo.com.oxipuroriente.inventory.modules.clientes.infrastructure.CustomerRepository;
import bo.com.oxipuroriente.inventory.modules.inventario.infrastructure.InventoryMovementRepository;
import bo.com.oxipuroriente.inventory.modules.productos.domain.Product;
import bo.com.oxipuroriente.inventory.modules.productos.infrastructure.ProductRepository;
import bo.com.oxipuroriente.inventory.modules.ventas.infrastructure.SalesNoteCollectedCylinderRepository;
import bo.com.oxipuroriente.inventory.modules.ventas.infrastructure.SalesNoteDeliveredCylinderRepository;
import bo.com.oxipuroriente.inventory.modules.ventas.infrastructure.SalesNoteRepository;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
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

    @Autowired
    private SalesNoteRepository salesNoteRepository;

    @Autowired
    private SalesNoteDeliveredCylinderRepository deliveredCylinderRepository;

    @Autowired
    private SalesNoteCollectedCylinderRepository collectedCylinderRepository;

    @Autowired
    private InventoryMovementRepository movementRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomerAliasRepository customerAliasRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

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
    void automaticallyRegistersUnknownCylindersWithTheirOwnership() throws Exception {
        Product product = createProduct();
        Warehouse warehouse = mainWarehouse();
        String deliveredSerial = next("CYL-AUTO-EMPRESA");
        String collectedSerial = next("CYL-AUTO-CLIENTE");

        JsonNode response = postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "Cliente Alta Automatica",
                  "noteDate": "2026-07-27T09:00:00",
                  "deliveredCylinders": [
                    {
                      "serialNumber": "%s",
                      "productId": %d,
                      "capacityM3": 7.50,
                      "amount": 125.00,
                      "ownerName": "OXIPUR ORIENTE SRL"
                    }
                  ],
                  "collectedCylinders": [
                    {
                      "serialNumber": "%s",
                      "capacityM3": 6.00,
                      "ownerName": "CLIENTE PROPIETARIO"
                    }
                  ]
                }
                """.formatted(next("NV-AUTO-CYL"), deliveredSerial, product.getId(), collectedSerial));

        assertThat(response.get("deliveredCylinders").get(0).get("serialNumber").asText())
                .isEqualTo(deliveredSerial);
        assertThat(response.get("collectedCylinders").get(0).get("serialNumber").asText())
                .isEqualTo(collectedSerial);

        Cylinder delivered = cylinderRepository.findByNormalizedSerialNumber(deliveredSerial).orElseThrow();
        assertThat(delivered.getOwner()).isEqualTo("OXIPUR ORIENTE SRL");
        assertThat(delivered.getOwnerType()).isEqualTo(CylinderOwnerType.COMPANY);
        assertThat(delivered.getCurrentLocationType()).isEqualTo(CylinderLocationType.CLIENTE);
        assertThat(delivered.getCurrentCustomerName()).isEqualTo("CLIENTE ALTA AUTOMATICA");

        Cylinder collected = cylinderRepository.findByNormalizedSerialNumber(collectedSerial).orElseThrow();
        assertThat(collected.getOwner()).isEqualTo("CLIENTE PROPIETARIO");
        assertThat(collected.getOwnerType()).isEqualTo(CylinderOwnerType.CUSTOMER);
        assertThat(collected.getCurrentLocationType()).isEqualTo(CylinderLocationType.PLANTA);
        assertThat(collected.getCurrentWarehouseId()).isEqualTo(warehouse.getId());
    }

    @Test
    void detectsAndAssignsNextSalesNoteNumberAutomatically() throws Exception {
        Warehouse warehouse = mainWarehouse();
        Product product = createProduct();
        Cylinder previousCylinder = createCylinderInPlant(warehouse.getId());
        Cylinder cylinder = createCylinderInPlant(warehouse.getId());

        postSalesNote("""
                {
                  "noteNumber": "NV-900000",
                  "customerName": "Cliente Correlativo Anterior",
                  "noteDate": "2026-06-02T09:30:00",
                  "deliveredCylinders": [
                    {
                      "cylinderId": %d,
                      "productId": %d
                    }
                  ]
                }
                """.formatted(previousCylinder.getId(), product.getId()));

        String expectedNoteNumber = "NV-900001";
        assertThat(getJson("/api/sales-notes/next-number").get("noteNumber").asText())
                .isEqualTo(expectedNoteNumber);

        JsonNode response = postSalesNote("""
                {
                  "customerName": "Cliente Correlativo",
                  "noteDate": "2026-06-02T10:30:00",
                  "deliveredCylinders": [
                    {
                      "cylinderId": %d,
                      "productId": %d
                    }
                  ]
                }
                """.formatted(cylinder.getId(), product.getId()));

        assertThat(response.get("noteNumber").asText()).isEqualTo(expectedNoteNumber);
        assertThat(getJson("/api/sales-notes/next-number").get("noteNumber").asText())
                .isEqualTo(incrementNoteNumber(expectedNoteNumber));
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
    void exportsFilteredSalesNoteMovementsUsingReferenceExcelFormat() throws Exception {
        Warehouse warehouse = mainWarehouse();
        Product product = createProduct();
        Cylinder delivered = createCylinderInPlant(warehouse.getId());
        Cylinder collected = createCylinderInCustomer("Cliente Excel");
        String noteNumber = next("NV-EXCEL");

        postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "Cliente Excel",
                  "noteDate": "2031-03-15T09:45:00",
                  "deliveredCylinders": [
                    {
                      "cylinderId": %d,
                      "productId": %d,
                      "capacityM3": 6.00,
                      "ownerName": "Oxipur",
                      "amount": 85.50,
                      "observations": "Entrega Excel"
                    }
                  ],
                  "collectedCylinders": [
                    {
                      "cylinderId": %d,
                      "productId": %d,
                      "capacityM3": 5.25,
                      "ownerName": "Cliente",
                      "observations": "Recibido vacio"
                    }
                  ]
                }
                """.formatted(noteNumber, delivered.getId(), product.getId(), collected.getId(), product.getId()));

        byte[] content = mockMvc.perform(get(
                        "/api/sales-notes/movements.xlsx?dateFilterType=MONTH&year=2031&month=3"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsByteArray();

        try (Workbook workbook = WorkbookFactory.create(new ByteArrayInputStream(content))) {
            assertThat(workbook.getNumberOfSheets()).isEqualTo(1);
            Sheet sheet = workbook.getSheet("DetalleMovimientos");
            assertThat(sheet).isNotNull();
            assertThat(sheet.getLastRowNum()).isEqualTo(2);
            assertThat(sheet.getRow(0).getCell(0).getStringCellValue()).isEqualTo("Boleta");
            assertThat(sheet.getRow(0).getCell(10).getStringCellValue()).isEqualTo("Observaciones");
            assertThat(sheet.getRow(1).getCell(0).getStringCellValue()).isEqualTo(noteNumber);
            assertThat(sheet.getRow(1).getCell(1).getStringCellValue()).isEqualTo("15/03/2031 09:45");
            assertThat(sheet.getRow(1).getCell(2).getStringCellValue()).isEqualTo(delivered.getSerialNumber());
            assertThat(sheet.getRow(1).getCell(8).getStringCellValue()).isEqualTo("Entregado");
            assertThat(sheet.getRow(1).getCell(9).getStringCellValue()).isEqualTo("85.50");
            assertThat(sheet.getRow(2).getCell(2).getStringCellValue()).isEqualTo(collected.getSerialNumber());
            assertThat(sheet.getRow(2).getCell(8).getStringCellValue()).isEqualTo("Recibido");
            assertThat(sheet.getRow(2).getCell(9).getStringCellValue()).isEmpty();
        }
    }

    @Test
    void persistsEveryRelatedTableWhenCreatingMixedSalesNote() throws Exception {
        Warehouse warehouse = mainWarehouse();
        Product product = createProduct();
        Cylinder delivered = createCylinderInPlant(warehouse.getId());
        Cylinder collected = createCylinderInCustomer("Cliente Persistencia");
        String customerName = next("CLIENTE-PERSISTENCIA");

        long notesBefore = salesNoteRepository.count();
        long deliveredBefore = deliveredCylinderRepository.count();
        long collectedBefore = collectedCylinderRepository.count();
        long movementsBefore = movementRepository.count();
        long customersBefore = customerRepository.count();
        long auditsBefore = auditLogRepository.count();

        postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "%s",
                  "noteDate": "2026-07-21T12:30:00",
                  "deliveredCylinders": [
                    {
                      "cylinderId": %d,
                      "productId": %d,
                      "amount": 95.00
                    }
                  ],
                  "collectedCylinders": [
                    {
                      "cylinderId": %d,
                      "productId": %d,
                      "observations": "RECIBIDO VACIO"
                    }
                  ]
                }
                """.formatted(
                next("NV-PERSIST"),
                customerName,
                delivered.getId(),
                product.getId(),
                collected.getId(),
                product.getId()));

        assertThat(salesNoteRepository.count()).isEqualTo(notesBefore + 1);
        assertThat(deliveredCylinderRepository.count()).isEqualTo(deliveredBefore + 1);
        assertThat(collectedCylinderRepository.count()).isEqualTo(collectedBefore + 1);
        assertThat(movementRepository.count()).isEqualTo(movementsBefore + 2);
        assertThat(customerRepository.count()).isEqualTo(customersBefore + 1);
        assertThat(auditLogRepository.count()).isEqualTo(auditsBefore + 1);
    }

    @Test
    void resolvesHistoricalCustomerAliasToCanonicalCustomer() throws Exception {
        Warehouse warehouse = mainWarehouse();
        Product product = createProduct();
        Cylinder cylinder = createCylinderInPlant(warehouse.getId());

        String canonicalName = next("CLIENTE-CANONICO");
        String aliasName = next("CLIENTE-ALIAS");
        Customer canonical = new Customer();
        canonical.setName(canonicalName);
        canonical.setNormalizedName(canonicalName);
        canonical = customerRepository.save(canonical);

        CustomerAlias alias = new CustomerAlias();
        alias.setCustomerId(canonical.getId());
        alias.setAliasName(aliasName);
        alias.setNormalizedAlias(aliasName);
        alias.setSourceType("TEST");
        customerAliasRepository.save(alias);

        long customersBefore = customerRepository.count();
        JsonNode response = postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "%s",
                  "noteDate": "2026-07-22T10:30:00",
                  "deliveredCylinders": [
                    {
                      "cylinderId": %d,
                      "productId": %d
                    }
                  ]
                }
                """.formatted(next("NV-ALIAS"), aliasName, cylinder.getId(), product.getId()));

        assertThat(response.get("customerId").longValue()).isEqualTo(canonical.getId());
        assertThat(response.get("customerName").asText()).isEqualTo(canonicalName);
        assertThat(customerRepository.count()).isEqualTo(customersBefore);
        assertThat(cylinderRepository.findById(cylinder.getId()).orElseThrow().getCurrentCustomerName())
                .isEqualTo(canonicalName);
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
    void returnsEveryCylinderAndSumsEveryDeliveredAmount() throws Exception {
        Warehouse warehouse = mainWarehouse();
        Product product = createProduct();
        List<Cylinder> cylinders = IntStream.range(0, 20)
                .mapToObj(index -> createCylinderInPlant(warehouse.getId()))
                .toList();
        String deliveredLines = cylinders.stream()
                .map(cylinder -> """
                        {
                          "cylinderId": %d,
                          "productId": %d,
                          "amount": 12.50
                        }
                        """.formatted(cylinder.getId(), product.getId()))
                .collect(Collectors.joining(","));

        JsonNode created = postSalesNote("""
                {
                  "noteNumber": "%s",
                  "customerName": "Cliente Nota Completa",
                  "noteDate": "2026-07-27T09:30:00",
                  "deliveredCylinders": [%s]
                }
                """.formatted(next("NV-COMPLETA"), deliveredLines));
        JsonNode detail = getJson("/api/sales-notes/" + created.get("id").longValue());

        assertThat(detail.get("deliveredCylinders").size()).isEqualTo(20);
        assertThat(detail.get("totalAmount").decimalValue())
                .isEqualByComparingTo(new BigDecimal("250.00"));
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
    void summarizesSalesRevenueAndExcludesCancelledNotes() throws Exception {
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
                      "productId": %d,
                      "amount": 125.50
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
                      "productId": %d,
                      "amount": 70.00
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
                      "productId": %d,
                      "amount": 30.00
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

        assertThat(total.get("totalRevenue").decimalValue()).isGreaterThanOrEqualTo(new BigDecimal("155.50"));
        assertThat(byDay.get("totalRevenue").decimalValue()).isEqualByComparingTo(new BigDecimal("125.50"));
        assertThat(byDay.get("salesNotesCount").asLong()).isEqualTo(1);
        assertThat(byMonth.get("totalRevenue").decimalValue()).isEqualByComparingTo(new BigDecimal("125.50"));
        assertThat(byYear.get("totalRevenue").decimalValue()).isEqualByComparingTo(new BigDecimal("155.50"));
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

    private String incrementNoteNumber(String noteNumber) {
        long value = Long.parseLong(noteNumber.substring("NV-".length()));
        return "NV-%06d".formatted(value + 1);
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
