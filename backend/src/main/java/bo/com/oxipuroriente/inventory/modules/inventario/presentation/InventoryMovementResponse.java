package bo.com.oxipuroriente.inventory.modules.inventario.presentation;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import bo.com.oxipuroriente.inventory.modules.cilindros.domain.CylinderLocationType;
import bo.com.oxipuroriente.inventory.modules.inventario.domain.InventoryMovement;
import bo.com.oxipuroriente.inventory.modules.inventario.domain.InventoryMovementType;
import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNoteSourceType;

public record InventoryMovementResponse(
        Long id,
        Long salesNoteId,
        Long cylinderId,
        Long productId,
        InventoryMovementType movementType,
        Long originWarehouseId,
        Long destinationWarehouseId,
        CylinderLocationType originLocationType,
        CylinderLocationType destinationLocationType,
        String originCustomerName,
        String destinationCustomerName,
        LocalDate movementDate,
        LocalDateTime movementAt,
        BigDecimal amount,
        String notes,
        SalesNoteSourceType sourceType) {

    public static InventoryMovementResponse from(InventoryMovement movement) {
        return new InventoryMovementResponse(
                movement.getId(),
                movement.getSalesNoteId(),
                movement.getCylinderId(),
                movement.getProductId(),
                movement.getMovementType(),
                movement.getOriginWarehouseId(),
                movement.getDestinationWarehouseId(),
                movement.getOriginLocationType(),
                movement.getDestinationLocationType(),
                movement.getOriginCustomerName(),
                movement.getDestinationCustomerName(),
                movement.getMovementDate(),
                movement.getMovementAt(),
                movement.getAmount(),
                movement.getNotes(),
                movement.getSourceType());
    }
}
