package bo.com.oxipuroriente.inventory.modules.perfiles.application;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.util.HexFormat;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import bo.com.oxipuroriente.inventory.modules.perfiles.domain.UserProfile;
import bo.com.oxipuroriente.inventory.modules.perfiles.infrastructure.UserProfileRepository;
import bo.com.oxipuroriente.inventory.modules.perfiles.presentation.CreateUserProfileRequest;
import bo.com.oxipuroriente.inventory.modules.perfiles.presentation.UpdateUserProfileRequest;
import bo.com.oxipuroriente.inventory.modules.perfiles.presentation.UserProfileResponse;

@Service
public class UserProfileService {

    private static final Duration ONLINE_WINDOW = Duration.ofMinutes(5);

    private final UserProfileRepository repository;

    public UserProfileService(UserProfileRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public UserProfileResponse create(CreateUserProfileRequest request) {
        String fullName = request.fullName().trim();
        String username = usernameOrDefault(request.username(), fullName);
        if (repository.existsByNormalizedFullName(fullName)) {
            throw new DuplicateUserProfileException(fullName);
        }
        if (repository.existsByNormalizedUsername(username)) {
            throw new DuplicateUserProfileException(username);
        }

        Instant now = Instant.now();
        UserProfile profile = new UserProfile();
        profile.setFullName(fullName);
        profile.setRoleName(request.roleName().trim());
        profile.setUsername(username);
        profile.setPasswordHash(hashPassword(passwordOrDefault(request.password())));
        profile.setActive(request.active() == null || request.active());
        profile.setLastActivityAt(now);
        profile.setOnlineUntil(now.plus(ONLINE_WINDOW));

        return UserProfileResponse.from(repository.save(profile), Instant.now());
    }

    public String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(password.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 not available", exception);
        }
    }

    @Transactional(readOnly = true)
    public List<UserProfileResponse> findAll() {
        Instant now = Instant.now();
        return repository.findAll(Sort.by(Sort.Direction.ASC, "fullName"))
                .stream()
                .map(profile -> UserProfileResponse.from(profile, now))
                .toList();
    }

    @Transactional
    public UserProfileResponse update(Long id, UpdateUserProfileRequest request) {
        UserProfile profile = repository.findById(id)
                .orElseThrow(() -> new UserProfileNotFoundException(id));
        String fullName = request.fullName().trim();
        String username = usernameOrDefault(request.username(), fullName);
        if (repository.existsByNormalizedFullNameAndIdNot(fullName, id)) {
            throw new DuplicateUserProfileException(fullName);
        }
        if (repository.existsByNormalizedUsernameAndIdNot(username, id)) {
            throw new DuplicateUserProfileException(username);
        }

        profile.setFullName(fullName);
        profile.setRoleName(request.roleName().trim());
        profile.setUsername(username);
        if (request.password() != null && !request.password().isBlank()) {
            profile.setPasswordHash(hashPassword(request.password()));
        }
        profile.setActive(request.active() == null || request.active());

        return UserProfileResponse.from(repository.save(profile), Instant.now());
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new UserProfileNotFoundException(id);
        }
        repository.deleteById(id);
    }

    @Transactional
    public UserProfileResponse markActivity(Long id) {
        UserProfile profile = repository.findById(id)
                .orElseThrow(() -> new UserProfileNotFoundException(id));
        Instant now = Instant.now();
        profile.setLastActivityAt(now);
        profile.setOnlineUntil(now.plus(ONLINE_WINDOW));
        return UserProfileResponse.from(repository.save(profile), now);
    }

    private String usernameOrDefault(String username, String fullName) {
        if (username != null && !username.isBlank()) {
            return username.trim();
        }
        return fullName.trim().toLowerCase().replaceAll("[^a-z0-9]+", ".");
    }

    private String passwordOrDefault(String password) {
        if (password != null && !password.isBlank()) {
            return password;
        }
        return "admin123";
    }
}
