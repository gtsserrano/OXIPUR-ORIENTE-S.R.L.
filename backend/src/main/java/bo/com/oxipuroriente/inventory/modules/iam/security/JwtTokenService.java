package bo.com.oxipuroriente.inventory.modules.iam.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Service;

import bo.com.oxipuroriente.inventory.modules.iam.domain.UserRole;
import bo.com.oxipuroriente.inventory.modules.perfiles.domain.UserProfile;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
public class JwtTokenService {

    private static final String HMAC_SHA256 = "HmacSHA256";

    private final JwtProperties properties;
    private final ObjectMapper objectMapper;
    private final byte[] secret;

    public JwtTokenService(JwtProperties properties, ObjectMapper objectMapper) {
        this.properties = properties;
        this.objectMapper = objectMapper;
        if (properties.getSecret() == null || properties.getSecret().length() < 32) {
            throw new IllegalStateException("JWT secret must be configured with at least 32 characters");
        }
        this.secret = properties.getSecret().getBytes(StandardCharsets.UTF_8);
    }

    public IssuedJwt createToken(UserProfile profile) {
        Instant issuedAt = Instant.now();
        Instant expiresAt = issuedAt.plus(properties.getExpiration());
        return createToken(profile, issuedAt, expiresAt);
    }

    public IssuedJwt createToken(UserProfile profile, Instant issuedAt, Instant expiresAt) {
        String token = signToken(profile, issuedAt, expiresAt);
        return new IssuedJwt(token, expiresAt);
    }

    public JwtClaims parse(String token) {
        try {
            String[] parts = token.split("\\.", -1);
            if (parts.length != 3 || parts[0].isBlank() || parts[1].isBlank() || parts[2].isBlank()) {
                throw new JwtAuthenticationException("malformed_token");
            }
            String unsignedToken = parts[0] + "." + parts[1];
            String expectedSignature = signature(unsignedToken);
            if (!MessageDigest.isEqual(expectedSignature.getBytes(StandardCharsets.UTF_8),
                    parts[2].getBytes(StandardCharsets.UTF_8))) {
                throw new JwtAuthenticationException("invalid_signature");
            }

            JsonNode payload = objectMapper.readTree(new String(base64UrlDecode(parts[1]), StandardCharsets.UTF_8));
            if (!properties.getIssuer().equals(payload.path("iss").asText())) {
                throw new JwtAuthenticationException("invalid_issuer");
            }
            if (!"access".equals(payload.path("typ").asText())) {
                throw new JwtAuthenticationException("invalid_token_type");
            }
            Long subject = parseSubject(payload.path("sub").asText(null));
            String username = payload.path("username").asText(null);
            UserRole role = UserRole.from(payload.path("role").asText(null));
            long expirationEpoch = payload.path("exp").asLong(0);
            Instant expiresAt = Instant.ofEpochSecond(expirationEpoch);
            if (!expiresAt.isAfter(Instant.now())) {
                throw new JwtAuthenticationException("expired_token");
            }
            if (username == null || username.isBlank()) {
                throw new JwtAuthenticationException("missing_username");
            }
            return new JwtClaims(subject, username, role, expiresAt);
        } catch (JwtAuthenticationException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new JwtAuthenticationException("invalid_token", exception);
        }
    }

    private String signToken(UserProfile profile, Instant issuedAt, Instant expiresAt) {
        try {
            UserRole role = UserRole.from(profile.getRoleName());
            String header = base64UrlEncode(objectMapper.writeValueAsBytes(Map.of(
                    "alg", "HS256",
                    "typ", "JWT")));
            String payload = base64UrlEncode(objectMapper.writeValueAsBytes(Map.of(
                    "iss", properties.getIssuer(),
                    "typ", "access",
                    "sub", String.valueOf(profile.getId()),
                    "username", profile.getUsername(),
                    "role", role.name(),
                    "iat", issuedAt.getEpochSecond(),
                    "exp", expiresAt.getEpochSecond())));
            String unsignedToken = header + "." + payload;
            return unsignedToken + "." + signature(unsignedToken);
        } catch (Exception exception) {
            throw new JwtAuthenticationException("token_creation_failed", exception);
        }
    }

    private Long parseSubject(String subject) {
        if (subject == null || subject.isBlank()) {
            throw new JwtAuthenticationException("missing_subject");
        }
        try {
            return Long.valueOf(subject);
        } catch (NumberFormatException exception) {
            throw new JwtAuthenticationException("invalid_subject", exception);
        }
    }

    private String signature(String value) {
        try {
            Mac mac = Mac.getInstance(HMAC_SHA256);
            mac.init(new SecretKeySpec(secret, HMAC_SHA256));
            return base64UrlEncode(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new JwtAuthenticationException("token_signature_failed", exception);
        }
    }

    private String base64UrlEncode(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private byte[] base64UrlDecode(String value) {
        return Base64.getUrlDecoder().decode(value);
    }

    public record IssuedJwt(String token, Instant expiresAt) {
    }
}
