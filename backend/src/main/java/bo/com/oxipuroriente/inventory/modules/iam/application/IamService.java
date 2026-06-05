package bo.com.oxipuroriente.inventory.modules.iam.application;

import java.time.Instant;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import bo.com.oxipuroriente.inventory.modules.iam.presentation.IamLoginRequest;
import bo.com.oxipuroriente.inventory.modules.iam.presentation.IamLoginResponse;
import bo.com.oxipuroriente.inventory.modules.perfiles.application.UserProfileService;
import bo.com.oxipuroriente.inventory.modules.perfiles.domain.UserProfile;
import bo.com.oxipuroriente.inventory.modules.perfiles.infrastructure.UserProfileRepository;
import bo.com.oxipuroriente.inventory.modules.perfiles.presentation.UserProfileResponse;

@Service
public class IamService {

    private final UserProfileRepository repository;
    private final UserProfileService profileService;

    public IamService(UserProfileRepository repository, UserProfileService profileService) {
        this.repository = repository;
        this.profileService = profileService;
    }

    @Transactional
    public IamLoginResponse login(IamLoginRequest request) {
        UserProfile profile = repository.findByNormalizedUsername(request.username())
                .orElseThrow(IamAuthenticationException::new);
        if (!profile.isActive() || profile.getPasswordHash() == null) {
            throw new IamAuthenticationException();
        }
        String passwordHash = profileService.hashPassword(request.password());
        if (!profile.getPasswordHash().equals(passwordHash)) {
            throw new IamAuthenticationException();
        }

        Instant now = Instant.now();
        profile.setLastActivityAt(now);
        profile.setOnlineUntil(now.plusSeconds(300));
        UserProfile saved = repository.save(profile);

        return new IamLoginResponse(
                UUID.randomUUID().toString(),
                "Bearer",
                UserProfileResponse.from(saved, now));
    }
}
