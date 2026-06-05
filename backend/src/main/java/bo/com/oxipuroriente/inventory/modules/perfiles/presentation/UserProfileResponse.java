package bo.com.oxipuroriente.inventory.modules.perfiles.presentation;

import java.time.Instant;

import bo.com.oxipuroriente.inventory.modules.perfiles.domain.UserProfile;

public record UserProfileResponse(
        Long id,
        String fullName,
        String roleName,
        String username,
        boolean active,
        Instant lastActivityAt,
        boolean online,
        Instant createdAt,
        Instant updatedAt) {

    public static UserProfileResponse from(UserProfile profile, Instant now) {
        return new UserProfileResponse(
                profile.getId(),
                profile.getFullName(),
                profile.getRoleName(),
                profile.getUsername(),
                profile.isActive(),
                profile.getLastActivityAt(),
                profile.isOnline(now),
                profile.getCreatedAt(),
                profile.getUpdatedAt());
    }
}
