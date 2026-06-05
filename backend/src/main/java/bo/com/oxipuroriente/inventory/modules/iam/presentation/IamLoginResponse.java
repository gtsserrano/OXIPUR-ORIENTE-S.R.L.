package bo.com.oxipuroriente.inventory.modules.iam.presentation;

import bo.com.oxipuroriente.inventory.modules.perfiles.presentation.UserProfileResponse;

public record IamLoginResponse(
        String accessToken,
        String tokenType,
        UserProfileResponse profile) {
}
