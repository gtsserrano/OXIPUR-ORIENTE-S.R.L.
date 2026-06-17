package bo.com.oxipuroriente.inventory.modules.perfiles.application;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Locale;

import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import bo.com.oxipuroriente.inventory.modules.iam.application.PasswordService;
import bo.com.oxipuroriente.inventory.modules.iam.domain.UserRole;
import bo.com.oxipuroriente.inventory.modules.iam.security.CurrentUser;
import bo.com.oxipuroriente.inventory.modules.perfiles.domain.UserProfile;
import bo.com.oxipuroriente.inventory.modules.perfiles.infrastructure.UserProfileRepository;
import bo.com.oxipuroriente.inventory.modules.perfiles.presentation.CreateUserProfileRequest;
import bo.com.oxipuroriente.inventory.modules.perfiles.presentation.UpdateUserProfileRequest;
import bo.com.oxipuroriente.inventory.modules.perfiles.presentation.UserProfileResponse;

@Service
public class UserProfileService {

    private static final Duration ONLINE_WINDOW = Duration.ofMinutes(5);
    private static final int MIN_PASSWORD_LENGTH = 8;

    private final UserProfileRepository repository;
    private final PasswordService passwordService;
    private final CurrentUser currentUser;

    public UserProfileService(UserProfileRepository repository, PasswordService passwordService, CurrentUser currentUser) {
        this.repository = repository;
        this.passwordService = passwordService;
        this.currentUser = currentUser;
    }

    @Transactional
    public UserProfileResponse create(CreateUserProfileRequest request) {
        String fullName = request.fullName().trim();
        String username = usernameOrDefault(request.username(), fullName);
        UserRole role = UserRole.from(request.roleName());
        if (repository.existsByNormalizedFullName(fullName)) {
            throw new DuplicateUserProfileException(fullName);
        }
        if (repository.existsByNormalizedUsername(username)) {
            throw new DuplicateUserProfileException(username);
        }

        Instant now = Instant.now();
        UserProfile profile = new UserProfile();
        profile.setFullName(fullName);
        profile.setRoleName(role.name());
        profile.setUsername(username);
        profile.setPasswordHash(passwordService.encode(request.password()));
        profile.setActive(request.active() == null || request.active());
        profile.setLastActivityAt(now);
        profile.setOnlineUntil(now.plus(ONLINE_WINDOW));

        return UserProfileResponse.from(repository.save(profile), Instant.now());
    }

    public String hashPassword(String password) {
        return passwordService.encode(password);
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
        UserRole requestedRole = UserRole.from(request.roleName());
        boolean requestedActive = request.active() == null || request.active();
        guardSelfUpdate(profile, requestedRole, requestedActive);
        if (repository.existsByNormalizedFullNameAndIdNot(fullName, id)) {
            throw new DuplicateUserProfileException(fullName);
        }
        if (repository.existsByNormalizedUsernameAndIdNot(username, id)) {
            throw new DuplicateUserProfileException(username);
        }

        profile.setFullName(fullName);
        profile.setRoleName(requestedRole.name());
        profile.setUsername(username);
        if (request.password() != null && !request.password().isBlank()) {
            validateOptionalPassword(request.password());
            profile.setPasswordHash(passwordService.encode(request.password()));
        }
        profile.setActive(requestedActive);

        return UserProfileResponse.from(repository.save(profile), Instant.now());
    }

    @Transactional
    public void delete(Long id) {
        currentUser.get()
                .filter(user -> user.id().equals(id))
                .ifPresent(user -> {
                    throw new AccessDeniedException("cannot_delete_own_profile");
                });
        if (!repository.existsById(id)) {
            throw new UserProfileNotFoundException(id);
        }
        repository.deleteById(id);
    }

    @Transactional
    public UserProfileResponse markActivity(Long id) {
        guardProfilePresenceUpdate(id);
        UserProfile profile = repository.findById(id)
                .orElseThrow(() -> new UserProfileNotFoundException(id));
        Instant now = Instant.now();
        profile.setLastActivityAt(now);
        profile.setOnlineUntil(now.plus(ONLINE_WINDOW));
        return UserProfileResponse.from(repository.save(profile), now);
    }

    @Transactional
    public UserProfileResponse markOffline(Long id) {
        guardProfilePresenceUpdate(id);
        UserProfile profile = repository.findById(id)
                .orElseThrow(() -> new UserProfileNotFoundException(id));
        Instant now = Instant.now();
        profile.setOnlineUntil(now);
        return UserProfileResponse.from(repository.save(profile), now);
    }

    private String usernameOrDefault(String username, String fullName) {
        if (username != null && !username.isBlank()) {
            return normalizeUsername(username);
        }
        String generated = fullName.trim().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", ".");
        generated = generated.replaceAll("^\\.+|\\.+$", "");
        if (generated.isBlank()) {
            generated = "user";
        }
        if (generated.length() < 3) {
            generated = generated + ".user";
        }
        return generated.length() <= 80 ? generated : generated.substring(0, 80).replaceAll("\\.+$", "");
    }

    private String normalizeUsername(String username) {
        return username.trim().toLowerCase(Locale.ROOT);
    }

    private void validateOptionalPassword(String password) {
        if (password.length() < MIN_PASSWORD_LENGTH || password.length() > 128) {
            throw new InvalidUserProfileException("invalid_password_length");
        }
    }

    private void guardSelfUpdate(UserProfile profile, UserRole requestedRole, boolean requestedActive) {
        currentUser.get()
                .filter(user -> user.id().equals(profile.getId()))
                .ifPresent(user -> {
                    UserRole currentRole = UserRole.from(profile.getRoleName());
                    if (currentRole != requestedRole || !requestedActive) {
                        throw new AccessDeniedException("cannot_change_own_role_or_status");
                    }
                });
    }

    private void guardProfilePresenceUpdate(Long id) {
        currentUser.get()
                .filter(user -> !user.isAdmin() && !user.id().equals(id))
                .ifPresent(user -> {
                    throw new AccessDeniedException("cannot_update_other_profile_presence");
                });
    }
}
