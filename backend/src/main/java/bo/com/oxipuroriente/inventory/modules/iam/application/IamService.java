package bo.com.oxipuroriente.inventory.modules.iam.application;

import java.time.Instant;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import bo.com.oxipuroriente.inventory.modules.iam.presentation.IamLoginRequest;
import bo.com.oxipuroriente.inventory.modules.iam.presentation.IamLoginResponse;
import bo.com.oxipuroriente.inventory.modules.iam.security.JwtTokenService;
import bo.com.oxipuroriente.inventory.modules.iam.security.JwtTokenService.IssuedJwt;
import bo.com.oxipuroriente.inventory.modules.perfiles.domain.UserProfile;
import bo.com.oxipuroriente.inventory.modules.perfiles.infrastructure.UserProfileRepository;
import bo.com.oxipuroriente.inventory.modules.perfiles.presentation.UserProfileResponse;
import bo.com.oxipuroriente.inventory.modules.auditoria.application.AuditLogService;
import bo.com.oxipuroriente.inventory.modules.auditoria.domain.AuditAction;

@Service
public class IamService {

    private final UserProfileRepository repository;
    private final PasswordService passwordService;
    private final JwtTokenService jwtTokenService;
    private final AuditLogService auditLogService;

    public IamService(
            UserProfileRepository repository,
            PasswordService passwordService,
            JwtTokenService jwtTokenService,
            AuditLogService auditLogService) {
        this.repository = repository;
        this.passwordService = passwordService;
        this.jwtTokenService = jwtTokenService;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public IamLoginResponse login(IamLoginRequest request) {
        UserProfile profile = repository.findByNormalizedUsername(request.username()).orElse(null);
        if (profile == null) {
            recordLogin(AuditAction.LOGIN_FAILED, null, request.username(), "Credenciales inválidas");
            throw new IamAuthenticationException();
        }
        if (!profile.isActive() || profile.getPasswordHash() == null) {
            recordLogin(AuditAction.LOGIN_FAILED, profile.getId(), profile.getUsername(), "Perfil inactivo o sin contraseña");
            throw new IamAuthenticationException();
        }
        if (!passwordService.matches(request.password(), profile.getPasswordHash())) {
            recordLogin(AuditAction.LOGIN_FAILED, profile.getId(), profile.getUsername(), "Credenciales inválidas");
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
        recordLogin(AuditAction.LOGIN, saved.getId(), saved.getUsername(), "Inicio de sesión exitoso");

        return new IamLoginResponse(
                issuedJwt.token(),
                "Bearer",
                issuedJwt.expiresAt(),
                UserProfileResponse.from(saved, now));
    }

    private void recordLogin(AuditAction action, Long userId, String username, String result) {
        auditLogService.recordAsActor(
                action,
                "SESSION",
                userId == null ? username : userId,
                userId,
                username,
                Map.of("resultado", result));
    }
}
