package bo.com.oxipuroriente.inventory.modules.productos.presentation;

import jakarta.validation.constraints.NotBlank;

public record CreateProductRequest(
        @NotBlank String code,
        @NotBlank String name,
        String description,
        Boolean active) {
}
