package bo.com.oxipuroriente.inventory.modules.cilindros.presentation;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

import bo.com.oxipuroriente.inventory.modules.cilindros.domain.Cylinder;
import bo.com.oxipuroriente.inventory.modules.cilindros.domain.CylinderLocationType;
import bo.com.oxipuroriente.inventory.modules.cilindros.domain.CylinderOwnerType;
import bo.com.oxipuroriente.inventory.modules.cilindros.domain.CylinderStatus;

public record CylinderResponse(
        Long id,
        String serialNumber,
        BigDecimal capacityM3,
        String owner,
        BigDecimal price,
        boolean active,
        CylinderStatus status,
        CylinderOwnerType ownerType,
        CylinderLocationType currentLocationType,
        Long currentWarehouseId,
        String currentCustomerName,
        LocalDate locationDate,
        String locationObservation,
        Instant createdAt,
        Instant updatedAt) {

    public static CylinderResponse from(Cylinder cylinder) {
        return new CylinderResponse(
                cylinder.getId(),
                cylinder.getSerialNumber(),
                cylinder.getCapacityM3(),
                cylinder.getOwner(),
                cylinder.getPrice(),
                cylinder.isActive(),
                cylinder.getStatus(),
                cylinder.getOwnerType(),
                cylinder.getCurrentLocationType(),
                cylinder.getCurrentWarehouseId(),
                cylinder.getCurrentCustomerName(),
                cylinder.getLocationDate(),
                cylinder.getLocationObservation(),
                cylinder.getCreatedAt(),
                cylinder.getUpdatedAt());
    }
}
