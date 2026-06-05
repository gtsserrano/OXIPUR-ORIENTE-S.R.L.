package bo.com.oxipuroriente.inventory.modules.cilindros.domain;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "cylinders")
public class Cylinder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "serial_number", nullable = false, unique = true, length = 80)
    private String serialNumber;

    @Column(name = "capacity_m3", nullable = false, precision = 10, scale = 2)
    private BigDecimal capacityM3;

    @Column(nullable = false, length = 120)
    private String owner;

    @Column(precision = 12, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private boolean active = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private CylinderStatus status = CylinderStatus.AVAILABLE;

    @Enumerated(EnumType.STRING)
    @Column(name = "owner_type", nullable = false, length = 40)
    private CylinderOwnerType ownerType = CylinderOwnerType.COMPANY;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_location_type", length = 40)
    private CylinderLocationType currentLocationType;

    @Column(name = "current_warehouse_id")
    private Long currentWarehouseId;

    @Column(name = "current_customer_name", length = 160)
    private String currentCustomerName;

    @Column(name = "location_date")
    private java.time.LocalDate locationDate;

    @Column(name = "location_observation", length = 255)
    private String locationObservation;

    public Long getId() {
        return id;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public BigDecimal getCapacityM3() {
        return capacityM3;
    }

    public void setCapacityM3(BigDecimal capacityM3) {
        this.capacityM3 = capacityM3;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public CylinderStatus getStatus() {
        return status;
    }

    public void setStatus(CylinderStatus status) {
        this.status = status;
    }

    public CylinderOwnerType getOwnerType() {
        return ownerType;
    }

    public void setOwnerType(CylinderOwnerType ownerType) {
        this.ownerType = ownerType;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public CylinderLocationType getCurrentLocationType() {
        return currentLocationType;
    }

    public void setCurrentLocationType(CylinderLocationType currentLocationType) {
        this.currentLocationType = currentLocationType;
    }

    public Long getCurrentWarehouseId() {
        return currentWarehouseId;
    }

    public void setCurrentWarehouseId(Long currentWarehouseId) {
        this.currentWarehouseId = currentWarehouseId;
    }

    public String getCurrentCustomerName() {
        return currentCustomerName;
    }

    public void setCurrentCustomerName(String currentCustomerName) {
        this.currentCustomerName = currentCustomerName;
    }

    public java.time.LocalDate getLocationDate() {
        return locationDate;
    }

    public void setLocationDate(java.time.LocalDate locationDate) {
        this.locationDate = locationDate;
    }

    public String getLocationObservation() {
        return locationObservation;
    }

    public void setLocationObservation(String locationObservation) {
        this.locationObservation = locationObservation;
    }

    @PrePersist
    void markCreated() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void markUpdated() {
        updatedAt = Instant.now();
    }
}
