package bo.com.oxipuroriente.inventory.modules.productos.presentation;

import java.time.Instant;

import bo.com.oxipuroriente.inventory.modules.productos.domain.Product;

public record ProductResponse(
        Long id,
        String code,
        String name,
        String description,
        boolean active,
        Instant createdAt,
        Instant updatedAt) {

    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getCode(),
                product.getName(),
                product.getDescription(),
                product.isActive(),
                product.getCreatedAt(),
                product.getUpdatedAt());
    }
}
