package bo.com.oxipuroriente.inventory.modules.ventas.domain;

import java.time.Instant;
import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "sales_note_collected_cylinders")
public class SalesNoteCollectedCylinder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sales_note_id", nullable = false)
    private Long salesNoteId;

    @Column(name = "cylinder_id", nullable = false)
    private Long cylinderId;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "destination_warehouse_id", nullable = false)
    private Long destinationWarehouseId;

    @Column(name = "origin_customer_name", nullable = false, length = 160)
    private String originCustomerName;

    @Column(name = "capacity_m3", nullable = false, precision = 10, scale = 2)
    private BigDecimal capacityM3;

    @Column(name = "owner_name", nullable = false, length = 160)
    private String ownerName;

    @Column(length = 255)
    private String observations;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public Long getId() {
        return id;
    }

    public Long getSalesNoteId() {
        return salesNoteId;
    }

    public void setSalesNoteId(Long salesNoteId) {
        this.salesNoteId = salesNoteId;
    }

    public Long getCylinderId() {
        return cylinderId;
    }

    public void setCylinderId(Long cylinderId) {
        this.cylinderId = cylinderId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getDestinationWarehouseId() {
        return destinationWarehouseId;
    }

    public void setDestinationWarehouseId(Long destinationWarehouseId) {
        this.destinationWarehouseId = destinationWarehouseId;
    }

    public String getOriginCustomerName() {
        return originCustomerName;
    }

    public void setOriginCustomerName(String originCustomerName) {
        this.originCustomerName = originCustomerName;
    }

    public String getObservations() {
        return observations;
    }

    public void setObservations(String observations) {
        this.observations = observations;
    }

    public BigDecimal getCapacityM3() {
        return capacityM3;
    }

    public void setCapacityM3(BigDecimal capacityM3) {
        this.capacityM3 = capacityM3;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    @PrePersist
    void markCreated() {
        createdAt = Instant.now();
    }
}
