package bo.com.oxipuroriente.inventory.modules.inventario.presentation;

import java.math.BigDecimal;
import java.time.LocalDate;

import bo.com.oxipuroriente.inventory.modules.cilindros.domain.Cylinder;
import bo.com.oxipuroriente.inventory.modules.cilindros.domain.CylinderLocationType;
import bo.com.oxipuroriente.inventory.modules.cilindros.domain.CylinderStatus;
import bo.com.oxipuroriente.inventory.modules.inventario.domain.InventoryMovement;
import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNote;

public record InventoryCylinderResponse(
        Long cylinderId,
        String serialNumber,
        BigDecimal capacityM3,
        CylinderStatus status,
        CylinderLocationType currentLocationType,
        String currentCustomerName,
        LocalDate locationDate,
        String locationObservation,
        Long lastDeliveryMovementId,
        Long lastDeliverySalesNoteId,
        String lastDeliveryNoteNumber,
        LocalDate lastDeliveryDate) {

    public static InventoryCylinderResponse from(
            Cylinder cylinder,
            InventoryMovement lastDeliveryMovement,
            SalesNote lastDeliveryNote) {
        return new InventoryCylinderResponse(
                cylinder.getId(),
                cylinder.getSerialNumber(),
                cylinder.getCapacityM3(),
                cylinder.getStatus(),
                cylinder.getCurrentLocationType(),
                cylinder.getCurrentCustomerName(),
                cylinder.getLocationDate(),
                cylinder.getLocationObservation(),
                lastDeliveryMovement == null ? null : lastDeliveryMovement.getId(),
                lastDeliveryMovement == null ? null : lastDeliveryMovement.getSalesNoteId(),
                lastDeliveryNote == null ? null : lastDeliveryNote.getNoteNumber(),
                lastDeliveryMovement == null ? null : lastDeliveryMovement.getMovementDate());
    }
}
