package bo.com.oxipuroriente.inventory.modules.perfiles.presentation;

import jakarta.validation.constraints.NotBlank;

public record UpdateUserProfileRequest(
        @NotBlank String fullName,
        @NotBlank String roleName,
        String username,
        String password,
        Boolean active) {
}
