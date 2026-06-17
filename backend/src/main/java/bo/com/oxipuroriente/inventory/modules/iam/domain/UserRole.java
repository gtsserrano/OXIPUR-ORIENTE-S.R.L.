package bo.com.oxipuroriente.inventory.modules.iam.domain;

import java.util.Locale;

import bo.com.oxipuroriente.inventory.modules.iam.application.InvalidUserRoleException;

public enum UserRole {
    ADMINISTRADOR,
    OPERADOR;

    public static UserRole from(String value) {
        if (value == null || value.isBlank()) {
            throw new InvalidUserRoleException(value);
        }
        String normalized = value.trim().toUpperCase(Locale.ROOT);
        if ("ADMIN".equals(normalized)) {
            normalized = ADMINISTRADOR.name();
        }
        try {
            return UserRole.valueOf(normalized);
        } catch (IllegalArgumentException exception) {
            throw new InvalidUserRoleException(value);
        }
    }

    public String authority() {
        return "ROLE_" + name();
    }
}
