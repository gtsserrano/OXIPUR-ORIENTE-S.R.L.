package bo.com.oxipuroriente.inventory.modules.productos.application;

public class DuplicateProductCodeException extends RuntimeException {

    public DuplicateProductCodeException(String code) {
        super("Product code already exists: " + code);
    }
}
