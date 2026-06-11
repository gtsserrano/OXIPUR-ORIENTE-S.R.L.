package bo.com.oxipuroriente.inventory.modules.inventario.application;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import bo.com.oxipuroriente.inventory.modules.cilindros.domain.Cylinder;
import bo.com.oxipuroriente.inventory.modules.cilindros.domain.CylinderLocationType;
import bo.com.oxipuroriente.inventory.modules.cilindros.infrastructure.CylinderRepository;
import bo.com.oxipuroriente.inventory.modules.inventario.domain.InventoryMovement;
import bo.com.oxipuroriente.inventory.modules.inventario.domain.InventoryMovementType;
import bo.com.oxipuroriente.inventory.modules.inventario.infrastructure.InventoryMovementRepository;
import bo.com.oxipuroriente.inventory.modules.inventario.presentation.CustomerCylinderInventoryResponse;
import bo.com.oxipuroriente.inventory.modules.inventario.presentation.InventoryCylinderResponse;
import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNote;
import bo.com.oxipuroriente.inventory.modules.ventas.infrastructure.SalesNoteRepository;
import jakarta.persistence.criteria.Predicate;

@Service
public class InventoryCylinderQueryService {

    private final CylinderRepository cylinderRepository;
    private final InventoryMovementRepository movementRepository;
    private final SalesNoteRepository salesNoteRepository;

    public InventoryCylinderQueryService(
            CylinderRepository cylinderRepository,
            InventoryMovementRepository movementRepository,
            SalesNoteRepository salesNoteRepository) {
        this.cylinderRepository = cylinderRepository;
        this.movementRepository = movementRepository;
        this.salesNoteRepository = salesNoteRepository;
    }

    @Transactional(readOnly = true)
    public List<InventoryCylinderResponse> findCylinders(
            CylinderLocationType locationType,
            String customerName,
            String serialNumber) {
        return cylinderRepository.findAll(filters(locationType, customerName, serialNumber))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CustomerCylinderInventoryResponse findCustomerCylinders(String customerName) {
        List<InventoryCylinderResponse> cylinders = findCylinders(CylinderLocationType.CLIENTE, customerName, null)
                .stream()
                .filter(cylinder -> sameCustomer(cylinder.currentCustomerName(), customerName))
                .toList();
        return CustomerCylinderInventoryResponse.from(normalizeCustomerName(customerName), cylinders);
    }

    private InventoryCylinderResponse toResponse(Cylinder cylinder) {
        InventoryMovement lastDeliveryMovement = movementRepository
                .findByCylinderIdAndMovementTypeOrderByMovementDateDescCreatedAtDesc(
                        cylinder.getId(),
                        InventoryMovementType.PLANTA_A_CLIENTE)
                .stream()
                .findFirst()
                .orElse(null);
        SalesNote lastDeliveryNote = lastDeliveryMovement == null
                ? null
                : salesNoteRepository.findById(lastDeliveryMovement.getSalesNoteId()).orElse(null);
        return InventoryCylinderResponse.from(cylinder, lastDeliveryMovement, lastDeliveryNote);
    }

    private Specification<Cylinder> filters(
            CylinderLocationType locationType,
            String customerName,
            String serialNumber) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.isTrue(root.get("active")));
            if (locationType != null) {
                predicates.add(criteriaBuilder.equal(root.get("currentLocationType"), locationType));
            }
            if (StringUtils.hasText(customerName)) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("currentCustomerName")),
                        "%" + customerName.trim().toLowerCase() + "%"));
            }
            if (StringUtils.hasText(serialNumber)) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("serialNumber")),
                        "%" + serialNumber.trim().toLowerCase() + "%"));
            }
            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }

    private boolean sameCustomer(String currentCustomerName, String requestedCustomerName) {
        if (!StringUtils.hasText(currentCustomerName) || !StringUtils.hasText(requestedCustomerName)) {
            return false;
        }
        return currentCustomerName.trim().equalsIgnoreCase(requestedCustomerName.trim());
    }

    private String normalizeCustomerName(String customerName) {
        return customerName.trim().toUpperCase(Locale.ROOT);
    }
}
