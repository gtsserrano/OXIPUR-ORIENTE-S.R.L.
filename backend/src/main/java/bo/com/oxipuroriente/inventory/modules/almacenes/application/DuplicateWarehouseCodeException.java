package bo.com.oxipuroriente.inventory.modules.almacenes.application;

public class DuplicateWarehouseCodeException extends RuntimeException {

    public DuplicateWarehouseCodeException(String code) {
        super("Warehouse code already exists: " + code);
    }
}
