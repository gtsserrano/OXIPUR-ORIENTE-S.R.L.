package bo.com.oxipuroriente.inventory.modules.almacenes.presentation;

public record UpdateWarehouseRequest(
        String code,
        String name,
        String address,
        Boolean active) {
}
