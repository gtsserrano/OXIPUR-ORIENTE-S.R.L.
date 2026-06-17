package bo.com.oxipuroriente.inventory.modules.iam.presentation;

import java.time.Instant;

import bo.com.oxipuroriente.inventory.modules.perfiles.presentation.UserProfileResponse;

public record IamLoginResponse(
        String accessToken,
        String tokenType,
        Instant expiresAt,
        UserProfileResponse profile) {
}
