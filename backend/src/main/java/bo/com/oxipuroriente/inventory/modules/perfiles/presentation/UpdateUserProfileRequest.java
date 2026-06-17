package bo.com.oxipuroriente.inventory.modules.perfiles.presentation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateUserProfileRequest(
        @NotBlank @Size(max = 160) String fullName,
        @NotBlank @Pattern(regexp = "ADMIN|ADMINISTRADOR|OPERADOR") String roleName,
        @Pattern(regexp = "^[A-Za-z0-9._-]{3,80}$") String username,
        String password,
        Boolean active) {
}
