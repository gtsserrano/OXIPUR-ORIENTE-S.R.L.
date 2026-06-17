package bo.com.oxipuroriente.inventory.modules.iam.presentation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record IamLoginRequest(
        @NotBlank @Size(max = 80) String username,
        @NotBlank @Size(max = 128) String password) {
}
