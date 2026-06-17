package bo.com.oxipuroriente.inventory.modules.iam.security;

import bo.com.oxipuroriente.inventory.modules.iam.domain.UserRole;

public record AuthenticatedUser(Long id, String username, UserRole role) {

    public boolean isAdmin() {
        return role == UserRole.ADMINISTRADOR;
    }
}
