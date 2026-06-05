package bo.com.oxipuroriente.inventory.modules.inventario.presentation;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record CustomerCylinderInventoryResponse(
        String customerName,
        int totalCylinders,
        List<CustomerCylinderResponse> cylinders) {

    public static CustomerCylinderInventoryResponse from(String customerName, List<InventoryCylinderResponse> cylinders) {
        return new CustomerCylinderInventoryResponse(
                customerName,
                cylinders.size(),
                cylinders.stream().map(CustomerCylinderResponse::from).toList());
    }

    public record CustomerCylinderResponse(
            Long cylinderId,
            String serialNumber,
            BigDecimal capacityM3,
            LocalDate deliveredAt,
            Long salesNoteId,
            String salesNoteNumber,
            LocalDate locationDate,
            String locationObservation) {

        static CustomerCylinderResponse from(InventoryCylinderResponse cylinder) {
            return new CustomerCylinderResponse(
                    cylinder.cylinderId(),
                    cylinder.serialNumber(),
                    cylinder.capacityM3(),
                    cylinder.lastDeliveryDate(),
                    cylinder.lastDeliverySalesNoteId(),
                    cylinder.lastDeliveryNoteNumber(),
                    cylinder.locationDate(),
                    cylinder.locationObservation());
        }
    }
}
