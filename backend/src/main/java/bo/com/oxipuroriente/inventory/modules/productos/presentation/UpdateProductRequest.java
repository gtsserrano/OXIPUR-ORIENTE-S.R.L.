package bo.com.oxipuroriente.inventory.modules.productos.presentation;

public record UpdateProductRequest(
        String code,
        String name,
        String description,
        Boolean active) {
}
