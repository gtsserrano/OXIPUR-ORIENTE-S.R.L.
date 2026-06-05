package bo.com.oxipuroriente.inventory.modules.inventario.domain;

import java.time.Instant;
import java.time.LocalDate;

import bo.com.oxipuroriente.inventory.modules.cilindros.domain.CylinderLocationType;
import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNoteSourceType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "inventory_movements")
public class InventoryMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sales_note_id", nullable = false)
    private Long salesNoteId;

    @Enumerated(EnumType.STRING)
    @Column(name = "movement_type", nullable = false, length = 40)
    private InventoryMovementType movementType;

    @Column(name = "cylinder_id", nullable = false)
    private Long cylinderId;

    @Column(name = "product_id")
    private Long productId;

    @Enumerated(EnumType.STRING)
    @Column(name = "origin_location_type", length = 40)
    private CylinderLocationType originLocationType;

    @Enumerated(EnumType.STRING)
    @Column(name = "destination_location_type", nullable = false, length = 40)
    private CylinderLocationType destinationLocationType;

    @Column(name = "origin_warehouse_id")
    private Long originWarehouseId;

    @Column(name = "destination_warehouse_id")
    private Long destinationWarehouseId;

    @Column(name = "origin_customer_name", length = 160)
    private String originCustomerName;

    @Column(name = "destination_customer_name", length = 160)
    private String destinationCustomerName;

    @Column(name = "movement_date", nullable = false)
    private LocalDate movementDate;

    @Column(length = 255, name = "notes")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", nullable = false, length = 40)
    private SalesNoteSourceType sourceType = SalesNoteSourceType.USER;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Long getId() {
        return id;
    }

    public Long getSalesNoteId() {
        return salesNoteId;
    }

    public void setSalesNoteId(Long salesNoteId) {
        this.salesNoteId = salesNoteId;
    }

    public InventoryMovementType getMovementType() {
        return movementType;
    }

    public void setMovementType(InventoryMovementType movementType) {
        this.movementType = movementType;
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

    public CylinderLocationType getOriginLocationType() {
        return originLocationType;
    }

    public void setOriginLocationType(CylinderLocationType originLocationType) {
        this.originLocationType = originLocationType;
    }

    public CylinderLocationType getDestinationLocationType() {
        return destinationLocationType;
    }

    public void setDestinationLocationType(CylinderLocationType destinationLocationType) {
        this.destinationLocationType = destinationLocationType;
    }

    public Long getOriginWarehouseId() {
        return originWarehouseId;
    }

    public void setOriginWarehouseId(Long originWarehouseId) {
        this.originWarehouseId = originWarehouseId;
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

    public String getDestinationCustomerName() {
        return destinationCustomerName;
    }

    public void setDestinationCustomerName(String destinationCustomerName) {
        this.destinationCustomerName = destinationCustomerName;
    }

    public LocalDate getMovementDate() {
        return movementDate;
    }

    public void setMovementDate(LocalDate movementDate) {
        this.movementDate = movementDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public SalesNoteSourceType getSourceType() {
        return sourceType;
    }

    public void setSourceType(SalesNoteSourceType sourceType) {
        this.sourceType = sourceType;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    @PrePersist
    void markCreated() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }
}
