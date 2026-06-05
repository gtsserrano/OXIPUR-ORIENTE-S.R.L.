package bo.com.oxipuroriente.inventory.modules.iam.presentation;

import jakarta.validation.constraints.NotBlank;

public record IamLoginRequest(
        @NotBlank String username,
        @NotBlank String password) {
}
