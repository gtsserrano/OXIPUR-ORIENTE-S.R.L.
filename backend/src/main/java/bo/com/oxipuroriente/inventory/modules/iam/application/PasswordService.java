package bo.com.oxipuroriente.inventory.modules.iam.application;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.regex.Pattern;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordService {

    private static final Pattern LEGACY_SHA256 = Pattern.compile("^[a-fA-F0-9]{64}$");

    private final PasswordEncoder passwordEncoder;

    public PasswordService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public String encode(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    public boolean matches(String rawPassword, String storedHash) {
        if (rawPassword == null || storedHash == null || storedHash.isBlank()) {
            return false;
        }
        if (isLegacySha256(storedHash)) {
            return legacySha256(rawPassword).equalsIgnoreCase(storedHash);
        }
        return passwordEncoder.matches(rawPassword, storedHash);
    }

    public boolean requiresUpgrade(String storedHash) {
        return storedHash == null || isLegacySha256(storedHash) || passwordEncoder.upgradeEncoding(storedHash);
    }

    private boolean isLegacySha256(String storedHash) {
        return LEGACY_SHA256.matcher(storedHash).matches();
    }

    private String legacySha256(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(password.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 not available", exception);
        }
    }
}
