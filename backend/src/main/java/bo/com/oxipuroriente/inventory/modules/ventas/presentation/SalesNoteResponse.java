package bo.com.oxipuroriente.inventory.modules.ventas.presentation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import bo.com.oxipuroriente.inventory.modules.cilindros.domain.Cylinder;
import bo.com.oxipuroriente.inventory.modules.cilindros.domain.CylinderLocationType;
import bo.com.oxipuroriente.inventory.modules.inventario.domain.InventoryMovement;
import bo.com.oxipuroriente.inventory.modules.inventario.domain.InventoryMovementType;
import bo.com.oxipuroriente.inventory.modules.productos.domain.Product;
import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNote;
import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNoteCollectedCylinder;
import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNoteDeliveredCylinder;
import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNoteSourceType;
import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNoteStatus;

public record SalesNoteResponse(
        Long id,
        String noteNumber,
        String customerName,
        LocalDateTime noteDate,
        String observations,
        BigDecimal utilityAmount,
        SalesNoteStatus status,
        SalesNoteSourceType sourceType,
        List<DeliveredCylinderLineResponse> deliveredCylinders,
        List<CollectedCylinderLineResponse> collectedCylinders,
        List<MovementResponse> movements) {

    public static SalesNoteResponse from(
            SalesNote salesNote,
            List<SalesNoteDeliveredCylinder> delivered,
            List<SalesNoteCollectedCylinder> collected,
            List<InventoryMovement> movements,
            Map<Long, Cylinder> cylinders,
            Map<Long, Product> products) {
        return new SalesNoteResponse(
                salesNote.getId(),
                salesNote.getNoteNumber(),
                salesNote.getCustomerName(),
                salesNote.getNoteDate(),
                salesNote.getObservations(),
                salesNote.getUtilityAmount(),
                salesNote.getStatus(),
                salesNote.getSourceType(),
                delivered.stream().map(line -> DeliveredCylinderLineResponse.from(line, cylinders, products)).toList(),
                collected.stream().map(line -> CollectedCylinderLineResponse.from(line, cylinders, products)).toList(),
                movements.stream().map(MovementResponse::from).toList());
    }

    public record DeliveredCylinderLineResponse(
            Long id,
            Long cylinderId,
            String serialNumber,
            Long productId,
            String productName,
            Long originWarehouseId,
            BigDecimal capacityM3,
            String ownerName,
            String observations) {

        static DeliveredCylinderLineResponse from(
                SalesNoteDeliveredCylinder line,
                Map<Long, Cylinder> cylinders,
                Map<Long, Product> products) {
            Cylinder cylinder = cylinders.get(line.getCylinderId());
            Product product = products.get(line.getProductId());
            return new DeliveredCylinderLineResponse(
                    line.getId(),
                    line.getCylinderId(),
                    cylinder == null ? null : cylinder.getSerialNumber(),
                    line.getProductId(),
                    product == null ? null : product.getName(),
                    line.getOriginWarehouseId(),
                    line.getCapacityM3(),
                    line.getOwnerName(),
                    line.getObservations());
        }
    }

    public record CollectedCylinderLineResponse(
            Long id,
            Long cylinderId,
            String serialNumber,
            Long productId,
            String productName,
            Long destinationWarehouseId,
            BigDecimal capacityM3,
            String ownerName,
            String observations) {

        static CollectedCylinderLineResponse from(
                SalesNoteCollectedCylinder line,
                Map<Long, Cylinder> cylinders,
                Map<Long, Product> products) {
            Cylinder cylinder = cylinders.get(line.getCylinderId());
            Product product = line.getProductId() == null ? null : products.get(line.getProductId());
            return new CollectedCylinderLineResponse(
                    line.getId(),
                    line.getCylinderId(),
                    cylinder == null ? null : cylinder.getSerialNumber(),
                    line.getProductId(),
                    product == null ? null : product.getName(),
                    line.getDestinationWarehouseId(),
                    line.getCapacityM3(),
                    line.getOwnerName(),
                    line.getObservations());
        }
    }

    public record MovementResponse(
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
            String notes,
            SalesNoteSourceType sourceType) {

        static MovementResponse from(InventoryMovement movement) {
            return new MovementResponse(
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
                    movement.getNotes(),
                    movement.getSourceType());
        }
    }
}
