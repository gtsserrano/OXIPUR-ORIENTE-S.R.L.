package bo.com.oxipuroriente.inventory.modules.almacenes.application;

public class WarehouseNotFoundException extends RuntimeException {

    public WarehouseNotFoundException(Long id) {
        super("Warehouse not found: " + id);
    }
}
