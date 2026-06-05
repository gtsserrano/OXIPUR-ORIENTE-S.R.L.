package bo.com.oxipuroriente.inventory.modules.ventas.application;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import bo.com.oxipuroriente.inventory.modules.almacenes.domain.Warehouse;
import bo.com.oxipuroriente.inventory.modules.almacenes.infrastructure.WarehouseRepository;
import bo.com.oxipuroriente.inventory.modules.cilindros.domain.Cylinder;
import bo.com.oxipuroriente.inventory.modules.cilindros.domain.CylinderLocationType;
import bo.com.oxipuroriente.inventory.modules.cilindros.infrastructure.CylinderRepository;
import bo.com.oxipuroriente.inventory.modules.inventario.domain.InventoryMovement;
import bo.com.oxipuroriente.inventory.modules.inventario.domain.InventoryMovementType;
import bo.com.oxipuroriente.inventory.modules.inventario.infrastructure.InventoryMovementRepository;
import bo.com.oxipuroriente.inventory.modules.productos.domain.Product;
import bo.com.oxipuroriente.inventory.modules.productos.infrastructure.ProductRepository;
import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNote;
import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNoteCollectedCylinder;
import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNoteDeliveredCylinder;
import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNoteSourceType;
import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNoteStatus;
import bo.com.oxipuroriente.inventory.modules.ventas.infrastructure.SalesNoteCollectedCylinderRepository;
import bo.com.oxipuroriente.inventory.modules.ventas.infrastructure.SalesNoteDeliveredCylinderRepository;
import bo.com.oxipuroriente.inventory.modules.ventas.infrastructure.SalesNoteRepository;
import bo.com.oxipuroriente.inventory.modules.ventas.presentation.CreateSalesNoteRequest;
import bo.com.oxipuroriente.inventory.modules.ventas.presentation.SalesNoteResponse;
import bo.com.oxipuroriente.inventory.modules.ventas.presentation.UpdateSalesNoteRequest;
import bo.com.oxipuroriente.inventory.shared.application.DatePeriod;

@Service
public class SalesNoteService {

    private static final String MAIN_WAREHOUSE_CODE = "PLANTA";

    private final SalesNoteRepository salesNoteRepository;
    private final SalesNoteDeliveredCylinderRepository deliveredRepository;
    private final SalesNoteCollectedCylinderRepository collectedRepository;
    private final InventoryMovementRepository movementRepository;
    private final CylinderRepository cylinderRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;

    public SalesNoteService(
            SalesNoteRepository salesNoteRepository,
            SalesNoteDeliveredCylinderRepository deliveredRepository,
            SalesNoteCollectedCylinderRepository collectedRepository,
            InventoryMovementRepository movementRepository,
            CylinderRepository cylinderRepository,
            ProductRepository productRepository,
            WarehouseRepository warehouseRepository) {
        this.salesNoteRepository = salesNoteRepository;
        this.deliveredRepository = deliveredRepository;
        this.collectedRepository = collectedRepository;
        this.movementRepository = movementRepository;
        this.cylinderRepository = cylinderRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
    }

    @Transactional
    public SalesNoteResponse create(CreateSalesNoteRequest request) {
        List<CreateSalesNoteRequest.DeliveredCylinderRequest> delivered = emptyIfNull(request.deliveredCylinders());
        List<CreateSalesNoteRequest.CollectedCylinderRequest> collected = emptyIfNull(request.collectedCylinders());

        if (delivered.isEmpty() && collected.isEmpty()) {
            throw new SalesNoteException("Sales note must contain at least one cylinder");
        }
        if (salesNoteRepository.existsByNoteNumber(request.noteNumber())) {
            throw new SalesNoteException("Sales note number already exists: " + request.noteNumber());
        }
        validateNoRepeatedCylinder(delivered, collected);

        SalesNoteSourceType sourceType = request.sourceType() == null ? SalesNoteSourceType.USER : request.sourceType();

        SalesNote salesNote = new SalesNote();
        salesNote.setNoteNumber(request.noteNumber());
        salesNote.setCustomerName(request.customerName());
        salesNote.setNoteDate(request.noteDate());
        salesNote.setObservations(request.observations());
        salesNote.setUtilityAmount(utilityAmountOrZero(request.utilityAmount()));
        salesNote.setSourceType(sourceType);
        SalesNote savedNote = salesNoteRepository.save(salesNote);
        Warehouse mainWarehouse = findMainWarehouse();

        for (CreateSalesNoteRequest.DeliveredCylinderRequest line : delivered) {
            registerDeliveredCylinder(savedNote, sourceType, line, mainWarehouse);
        }
        for (CreateSalesNoteRequest.CollectedCylinderRequest line : collected) {
            registerCollectedCylinder(savedNote, sourceType, line, mainWarehouse);
        }

        return findById(savedNote.getId());
    }

    @Transactional(readOnly = true)
    public List<SalesNoteResponse> findAll() {
        return salesNoteRepository.findAll()
                .stream()
                .map(note -> findById(note.getId()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SalesNoteResponse> findAll(DatePeriod period) {
        List<SalesNote> notes = period == null
                ? salesNoteRepository.findAll()
                : salesNoteRepository.findByNoteDateGreaterThanEqualAndNoteDateLessThan(
                        period.fromDate(),
                        period.toDate());
        return notes
                .stream()
                .map(note -> findById(note.getId()))
                .toList();
    }

    @Transactional(readOnly = true)
    public SalesNoteResponse findById(Long id) {
        SalesNote salesNote = salesNoteRepository.findById(id)
                .orElseThrow(() -> new SalesNoteException("Sales note not found: " + id));
        List<SalesNoteDeliveredCylinder> delivered = deliveredRepository.findBySalesNoteId(id);
        List<SalesNoteCollectedCylinder> collected = collectedRepository.findBySalesNoteId(id);
        List<InventoryMovement> movements = movementRepository.findBySalesNoteId(id);
        return SalesNoteResponse.from(
                salesNote,
                delivered,
                collected,
                movements,
                loadCylinders(delivered, collected, movements),
                loadProducts(delivered, collected, movements));
    }

    @Transactional
    public SalesNoteResponse update(Long id, UpdateSalesNoteRequest request) {
        SalesNote salesNote = salesNoteRepository.findById(id)
                .orElseThrow(() -> new SalesNoteException("Sales note not found: " + id));
        if (salesNote.getStatus() == SalesNoteStatus.CANCELLED) {
            throw new SalesNoteException("Cancelled sales notes cannot be edited");
        }
        if (request.customerName() != null && !request.customerName().isBlank()) {
            salesNote.setCustomerName(request.customerName());
        }
        if (request.noteDate() != null) {
            salesNote.setNoteDate(request.noteDate());
        }
        salesNote.setObservations(request.observations());
        if (request.utilityAmount() != null) {
            salesNote.setUtilityAmount(request.utilityAmount());
        }
        salesNoteRepository.save(salesNote);
        return findById(id);
    }

    @Transactional
    public SalesNoteResponse cancel(Long id) {
        SalesNote salesNote = salesNoteRepository.findById(id)
                .orElseThrow(() -> new SalesNoteException("Sales note not found: " + id));
        if (salesNote.getStatus() == SalesNoteStatus.CANCELLED) {
            throw new SalesNoteException("Sales note is already cancelled");
        }
        Warehouse mainWarehouse = findMainWarehouse();
        List<SalesNoteDeliveredCylinder> delivered = deliveredRepository.findBySalesNoteId(id);
        List<SalesNoteCollectedCylinder> collected = collectedRepository.findBySalesNoteId(id);

        for (SalesNoteDeliveredCylinder line : delivered) {
            reverseDeliveredCylinder(salesNote, line, mainWarehouse);
        }
        for (SalesNoteCollectedCylinder line : collected) {
            reverseCollectedCylinder(salesNote, line, mainWarehouse);
        }

        salesNote.setStatus(SalesNoteStatus.CANCELLED);
        salesNoteRepository.save(salesNote);
        return findById(id);
    }

    private void registerDeliveredCylinder(
            SalesNote salesNote,
            SalesNoteSourceType sourceType,
            CreateSalesNoteRequest.DeliveredCylinderRequest line,
            Warehouse warehouse) {
        Cylinder cylinder = findActiveCylinder(line.cylinderId());
        Product product = findActiveProduct(line.productId());

        if (cylinder.getCurrentLocationType() != CylinderLocationType.PLANTA) {
            throw new SalesNoteException("Cylinder must be in PLANTA to be delivered: " + cylinder.getId());
        }

        SalesNoteDeliveredCylinder deliveredLine = new SalesNoteDeliveredCylinder();
        deliveredLine.setSalesNoteId(salesNote.getId());
        deliveredLine.setCylinderId(cylinder.getId());
        deliveredLine.setProductId(product.getId());
        deliveredLine.setOriginWarehouseId(warehouse.getId());
        deliveredLine.setCapacityM3(line.capacityM3() == null ? cylinder.getCapacityM3() : line.capacityM3());
        deliveredLine.setOwnerName(ownerNameOrCylinderOwner(line.ownerName(), cylinder));
        deliveredLine.setObservations(line.observations());
        deliveredRepository.save(deliveredLine);

        InventoryMovement movement = new InventoryMovement();
        movement.setSalesNoteId(salesNote.getId());
        movement.setCylinderId(cylinder.getId());
        movement.setProductId(product.getId());
        movement.setMovementType(InventoryMovementType.PLANTA_A_CLIENTE);
        movement.setOriginWarehouseId(warehouse.getId());
        movement.setOriginLocationType(CylinderLocationType.PLANTA);
        movement.setDestinationLocationType(CylinderLocationType.CLIENTE);
        movement.setDestinationCustomerName(salesNote.getCustomerName());
        movement.setMovementDate(salesNote.getNoteDate().toLocalDate());
        movement.setNotes(line.observations());
        movement.setSourceType(sourceType);
        movementRepository.save(movement);

        cylinder.setCurrentLocationType(CylinderLocationType.CLIENTE);
        cylinder.setCurrentWarehouseId(null);
        cylinder.setCurrentCustomerName(salesNote.getCustomerName());
        cylinder.setLocationDate(salesNote.getNoteDate().toLocalDate());
        cylinder.setLocationObservation(line.observations());
        cylinderRepository.save(cylinder);
    }

    private void registerCollectedCylinder(
            SalesNote salesNote,
            SalesNoteSourceType sourceType,
            CreateSalesNoteRequest.CollectedCylinderRequest line,
            Warehouse warehouse) {
        Cylinder cylinder = findActiveCylinder(line.cylinderId());
        Product product = line.productId() == null ? null : findActiveProduct(line.productId());

        if (cylinder.getCurrentLocationType() != CylinderLocationType.CLIENTE) {
            throw new SalesNoteException("Cylinder must be in CLIENTE to be collected: " + cylinder.getId());
        }
        String originCustomerName = salesNote.getCustomerName().trim();
        if (!sameCustomer(cylinder.getCurrentCustomerName(), originCustomerName)) {
            throw new SalesNoteException("Collected cylinder customer does not match current location: " + cylinder.getId());
        }

        SalesNoteCollectedCylinder collectedLine = new SalesNoteCollectedCylinder();
        collectedLine.setSalesNoteId(salesNote.getId());
        collectedLine.setCylinderId(cylinder.getId());
        collectedLine.setProductId(product == null ? null : product.getId());
        collectedLine.setDestinationWarehouseId(warehouse.getId());
        collectedLine.setCapacityM3(line.capacityM3() == null ? cylinder.getCapacityM3() : line.capacityM3());
        collectedLine.setOwnerName(ownerNameOrCylinderOwner(line.ownerName(), cylinder));
        collectedLine.setOriginCustomerName(originCustomerName);
        collectedLine.setObservations(line.observations());
        collectedRepository.save(collectedLine);

        InventoryMovement movement = new InventoryMovement();
        movement.setSalesNoteId(salesNote.getId());
        movement.setCylinderId(cylinder.getId());
        movement.setProductId(product == null ? null : product.getId());
        movement.setMovementType(InventoryMovementType.CLIENTE_A_PLANTA);
        movement.setOriginLocationType(CylinderLocationType.CLIENTE);
        movement.setOriginCustomerName(originCustomerName);
        movement.setDestinationWarehouseId(warehouse.getId());
        movement.setDestinationLocationType(CylinderLocationType.PLANTA);
        movement.setMovementDate(salesNote.getNoteDate().toLocalDate());
        movement.setNotes(line.observations());
        movement.setSourceType(sourceType);
        movementRepository.save(movement);

        cylinder.setCurrentLocationType(CylinderLocationType.PLANTA);
        cylinder.setCurrentWarehouseId(warehouse.getId());
        cylinder.setCurrentCustomerName(null);
        cylinder.setLocationDate(salesNote.getNoteDate().toLocalDate());
        cylinder.setLocationObservation(line.observations());
        cylinderRepository.save(cylinder);
    }

    private void reverseDeliveredCylinder(
            SalesNote salesNote,
            SalesNoteDeliveredCylinder line,
            Warehouse warehouse) {
        Cylinder cylinder = findActiveCylinder(line.getCylinderId());
        if (cylinder.getCurrentLocationType() != CylinderLocationType.CLIENTE
                || !sameCustomer(cylinder.getCurrentCustomerName(), salesNote.getCustomerName())) {
            throw new SalesNoteException("Sales note cannot be cancelled because cylinder moved after delivery: "
                    + cylinder.getId());
        }

        InventoryMovement movement = new InventoryMovement();
        movement.setSalesNoteId(salesNote.getId());
        movement.setCylinderId(cylinder.getId());
        movement.setProductId(line.getProductId());
        movement.setMovementType(InventoryMovementType.CLIENTE_A_PLANTA);
        movement.setOriginLocationType(CylinderLocationType.CLIENTE);
        movement.setOriginCustomerName(salesNote.getCustomerName());
        movement.setDestinationWarehouseId(warehouse.getId());
        movement.setDestinationLocationType(CylinderLocationType.PLANTA);
        movement.setMovementDate(salesNote.getNoteDate().toLocalDate());
        movement.setNotes("Anulacion de nota " + salesNote.getNoteNumber());
        movement.setSourceType(SalesNoteSourceType.SYSTEM);
        movementRepository.save(movement);

        cylinder.setCurrentLocationType(CylinderLocationType.PLANTA);
        cylinder.setCurrentWarehouseId(warehouse.getId());
        cylinder.setCurrentCustomerName(null);
        cylinder.setLocationDate(salesNote.getNoteDate().toLocalDate());
        cylinder.setLocationObservation("Anulacion de nota " + salesNote.getNoteNumber());
        cylinderRepository.save(cylinder);
    }

    private void reverseCollectedCylinder(
            SalesNote salesNote,
            SalesNoteCollectedCylinder line,
            Warehouse warehouse) {
        Cylinder cylinder = findActiveCylinder(line.getCylinderId());
        if (cylinder.getCurrentLocationType() != CylinderLocationType.PLANTA) {
            throw new SalesNoteException("Sales note cannot be cancelled because cylinder moved after collection: "
                    + cylinder.getId());
        }

        InventoryMovement movement = new InventoryMovement();
        movement.setSalesNoteId(salesNote.getId());
        movement.setCylinderId(cylinder.getId());
        movement.setProductId(line.getProductId());
        movement.setMovementType(InventoryMovementType.PLANTA_A_CLIENTE);
        movement.setOriginWarehouseId(warehouse.getId());
        movement.setOriginLocationType(CylinderLocationType.PLANTA);
        movement.setDestinationLocationType(CylinderLocationType.CLIENTE);
        movement.setDestinationCustomerName(line.getOriginCustomerName());
        movement.setMovementDate(salesNote.getNoteDate().toLocalDate());
        movement.setNotes("Anulacion de nota " + salesNote.getNoteNumber());
        movement.setSourceType(SalesNoteSourceType.SYSTEM);
        movementRepository.save(movement);

        cylinder.setCurrentLocationType(CylinderLocationType.CLIENTE);
        cylinder.setCurrentWarehouseId(null);
        cylinder.setCurrentCustomerName(line.getOriginCustomerName());
        cylinder.setLocationDate(salesNote.getNoteDate().toLocalDate());
        cylinder.setLocationObservation("Anulacion de nota " + salesNote.getNoteNumber());
        cylinderRepository.save(cylinder);
    }

    private Cylinder findActiveCylinder(Long id) {
        Cylinder cylinder = cylinderRepository.findById(id)
                .orElseThrow(() -> new SalesNoteException("Cylinder not found: " + id));
        if (!cylinder.isActive()) {
            throw new SalesNoteException("Cylinder is inactive: " + id);
        }
        return cylinder;
    }

    private Product findActiveProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new SalesNoteException("Product not found: " + id));
        if (!product.isActive()) {
            throw new SalesNoteException("Product is inactive: " + id);
        }
        return product;
    }

    private Warehouse findMainWarehouse() {
        Warehouse warehouse = warehouseRepository.findByCode(MAIN_WAREHOUSE_CODE)
                .orElseThrow(() -> new SalesNoteException("Main warehouse not found: " + MAIN_WAREHOUSE_CODE));
        if (!warehouse.isActive()) {
            throw new SalesNoteException("Main warehouse is inactive: " + MAIN_WAREHOUSE_CODE);
        }
        return warehouse;
    }

    private void validateNoRepeatedCylinder(
            List<CreateSalesNoteRequest.DeliveredCylinderRequest> delivered,
            List<CreateSalesNoteRequest.CollectedCylinderRequest> collected) {
        Set<Long> cylinderIds = new HashSet<>();
        for (CreateSalesNoteRequest.DeliveredCylinderRequest line : delivered) {
            if (!cylinderIds.add(line.cylinderId())) {
                throw new SalesNoteException("Repeated cylinder in sales note: " + line.cylinderId());
            }
        }
        for (CreateSalesNoteRequest.CollectedCylinderRequest line : collected) {
            if (!cylinderIds.add(line.cylinderId())) {
                throw new SalesNoteException("Repeated cylinder in sales note: " + line.cylinderId());
            }
        }
    }

    private <T> List<T> emptyIfNull(List<T> values) {
        return values == null ? List.of() : values;
    }

    private BigDecimal utilityAmountOrZero(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private String ownerNameOrCylinderOwner(String ownerName, Cylinder cylinder) {
        if (ownerName != null && !ownerName.isBlank()) {
            return ownerName.trim();
        }
        return cylinder.getOwner();
    }

    private boolean sameCustomer(String currentCustomerName, String requestedCustomerName) {
        if (currentCustomerName == null || requestedCustomerName == null) {
            return false;
        }
        return currentCustomerName.trim().equalsIgnoreCase(requestedCustomerName.trim());
    }

    private Map<Long, Cylinder> loadCylinders(
            List<SalesNoteDeliveredCylinder> delivered,
            List<SalesNoteCollectedCylinder> collected,
            List<InventoryMovement> movements) {
        Set<Long> ids = new HashSet<>();
        delivered.forEach(line -> ids.add(line.getCylinderId()));
        collected.forEach(line -> ids.add(line.getCylinderId()));
        movements.forEach(movement -> ids.add(movement.getCylinderId()));
        return cylinderRepository.findAllById(ids)
                .stream()
                .collect(Collectors.toMap(Cylinder::getId, Function.identity()));
    }

    private Map<Long, Product> loadProducts(
            List<SalesNoteDeliveredCylinder> delivered,
            List<SalesNoteCollectedCylinder> collected,
            List<InventoryMovement> movements) {
        Set<Long> ids = new HashSet<>();
        delivered.forEach(line -> ids.add(line.getProductId()));
        collected.stream()
                .map(SalesNoteCollectedCylinder::getProductId)
                .filter(productId -> productId != null)
                .forEach(ids::add);
        movements.stream()
                .map(InventoryMovement::getProductId)
                .filter(productId -> productId != null)
                .forEach(ids::add);
        return productRepository.findAllById(ids)
                .stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));
    }
}
