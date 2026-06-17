package bo.com.oxipuroriente.inventory.modules.perfiles.domain;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 160)
    private String fullName;

    @Column(name = "role_name", nullable = false, length = 80)
    private String roleName;

    @Column(length = 80)
    private String username;

    @Column(name = "password_hash", length = 128)
    private String passwordHash;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "last_activity_at", nullable = false)
    private Instant lastActivityAt;

    @Column(name = "online_until", nullable = false)
    private Instant onlineUntil;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Instant getLastActivityAt() {
        return lastActivityAt;
    }

    public void setLastActivityAt(Instant lastActivityAt) {
        this.lastActivityAt = lastActivityAt;
    }

    public Instant getOnlineUntil() {
        return onlineUntil;
    }

    public void setOnlineUntil(Instant onlineUntil) {
        this.onlineUntil = onlineUntil;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public boolean isOnline(Instant now) {
        return active && onlineUntil != null && onlineUntil.isAfter(now);
    }

    @PrePersist
    void markCreated() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
        if (lastActivityAt == null) {
            lastActivityAt = now;
        }
        if (onlineUntil == null) {
            onlineUntil = now;
        }
    }

    @PreUpdate
    void markUpdated() {
        updatedAt = Instant.now();
    }
}
