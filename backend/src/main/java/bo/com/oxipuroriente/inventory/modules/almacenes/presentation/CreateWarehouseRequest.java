package bo.com.oxipuroriente.inventory.modules.almacenes.presentation;

import jakarta.validation.constraints.NotBlank;

public record CreateWarehouseRequest(
        @NotBlank String code,
        @NotBlank String name,
        String address,
        Boolean active) {
}
