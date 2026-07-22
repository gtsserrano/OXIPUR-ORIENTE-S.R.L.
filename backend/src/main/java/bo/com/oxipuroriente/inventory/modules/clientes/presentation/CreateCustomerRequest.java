package bo.com.oxipuroriente.inventory.modules.clientes.presentation;

import jakarta.validation.constraints.NotBlank;

public record CreateCustomerRequest(
        @NotBlank String name,
        Boolean active) {
}
