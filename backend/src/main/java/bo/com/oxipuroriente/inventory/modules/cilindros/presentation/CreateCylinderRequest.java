package bo.com.oxipuroriente.inventory.modules.cilindros.presentation;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;

import bo.com.oxipuroriente.inventory.modules.cilindros.domain.CylinderOwnerType;

public record CreateCylinderRequest(
        @NotBlank String serialNumber,
        @jakarta.validation.constraints.NotNull @DecimalMin(value = "0.01") BigDecimal capacityM3,
        @NotBlank String owner,
        @DecimalMin(value = "0.00") BigDecimal price,
        Boolean active,
        CylinderOwnerType ownerType) {
}
