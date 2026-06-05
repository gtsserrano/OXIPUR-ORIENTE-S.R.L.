package bo.com.oxipuroriente.inventory.modules.almacenes.presentation;

import java.time.Instant;

import bo.com.oxipuroriente.inventory.modules.almacenes.domain.Warehouse;

public record WarehouseResponse(
        Long id,
        String code,
        String name,
        String address,
        boolean active,
        Instant createdAt,
        Instant updatedAt) {

    public static WarehouseResponse from(Warehouse warehouse) {
        return new WarehouseResponse(
                warehouse.getId(),
                warehouse.getCode(),
                warehouse.getName(),
                warehouse.getAddress(),
                warehouse.isActive(),
                warehouse.getCreatedAt(),
                warehouse.getUpdatedAt());
    }
}
