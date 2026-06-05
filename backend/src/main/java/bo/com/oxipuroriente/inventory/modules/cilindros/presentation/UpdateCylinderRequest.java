package bo.com.oxipuroriente.inventory.modules.cilindros.presentation;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;

import bo.com.oxipuroriente.inventory.modules.cilindros.domain.CylinderOwnerType;

public record UpdateCylinderRequest(
        String serialNumber,
        @DecimalMin(value = "0.01") BigDecimal capacityM3,
        String owner,
        @DecimalMin(value = "0.00") BigDecimal price,
        Boolean active,
        CylinderOwnerType ownerType) {
}
