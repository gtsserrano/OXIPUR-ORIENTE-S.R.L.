package bo.com.oxipuroriente.inventory.modules.iam.security;

import java.time.Instant;

import bo.com.oxipuroriente.inventory.modules.iam.domain.UserRole;

public record JwtClaims(Long subject, String username, UserRole role, Instant expiresAt) {
}
