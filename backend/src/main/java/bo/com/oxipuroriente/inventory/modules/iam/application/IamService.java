package bo.com.oxipuroriente.inventory.modules.iam.application;

import java.time.Instant;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import bo.com.oxipuroriente.inventory.modules.iam.presentation.IamLoginRequest;
import bo.com.oxipuroriente.inventory.modules.iam.presentation.IamLoginResponse;
import bo.com.oxipuroriente.inventory.modules.iam.security.JwtTokenService;
import bo.com.oxipuroriente.inventory.modules.iam.security.JwtTokenService.IssuedJwt;
import bo.com.oxipuroriente.inventory.modules.perfiles.domain.UserProfile;
import bo.com.oxipuroriente.inventory.modules.perfiles.infrastructure.UserProfileRepository;
import bo.com.oxipuroriente.inventory.modules.perfiles.presentation.UserProfileResponse;

@Service
public class IamService {

    private final UserProfileRepository repository;
    private final PasswordService passwordService;
    private final JwtTokenService jwtTokenService;

    public IamService(
            UserProfileRepository repository,
            PasswordService passwordService,
            JwtTokenService jwtTokenService) {
        this.repository = repository;
        this.passwordService = passwordService;
        this.jwtTokenService = jwtTokenService;
    }

    @Transactional
    public IamLoginResponse login(IamLoginRequest request) {
        UserProfile profile = repository.findByNormalizedUsername(request.username())
                .orElseThrow(IamAuthenticationException::new);
        if (!profile.isActive() || profile.getPasswordHash() == null) {
            throw new IamAuthenticationException();
        }
        if (!passwordService.matches(request.password(), profile.getPasswordHash())) {
            throw new IamAuthenticationException();
        }

        Instant now = Instant.now();
        profile.setLastActivityAt(now);
        profile.setOnlineUntil(now.plusSeconds(300));
        if (passwordService.requiresUpgrade(profile.getPasswordHash())) {
            profile.setPasswordHash(passwordService.encode(request.password()));
        }
        UserProfile saved = repository.save(profile);
        IssuedJwt issuedJwt = jwtTokenService.createToken(saved);

        return new IamLoginResponse(
                issuedJwt.token(),
                "Bearer",
                issuedJwt.expiresAt(),
                UserProfileResponse.from(saved, now));
    }
}
