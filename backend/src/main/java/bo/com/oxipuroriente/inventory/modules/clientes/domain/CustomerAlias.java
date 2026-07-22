package bo.com.oxipuroriente.inventory.modules.clientes.domain;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "customer_aliases")
public class CustomerAlias {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "alias_name", nullable = false, length = 160)
    private String aliasName;

    @Column(name = "normalized_alias", nullable = false, unique = true, length = 160)
    private String normalizedAlias;

    @Column(name = "source_type", nullable = false, length = 40)
    private String sourceType = "SYSTEM";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public Long getId() {
        return id;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getAliasName() {
        return aliasName;
    }

    public void setAliasName(String aliasName) {
        this.aliasName = aliasName;
    }

    public String getNormalizedAlias() {
        return normalizedAlias;
    }

    public void setNormalizedAlias(String normalizedAlias) {
        this.normalizedAlias = normalizedAlias;
    }

    public String getSourceType() {
        return sourceType;
    }

    public void setSourceType(String sourceType) {
        this.sourceType = sourceType;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    @PrePersist
    void markCreated() {
        createdAt = Instant.now();
    }
}
