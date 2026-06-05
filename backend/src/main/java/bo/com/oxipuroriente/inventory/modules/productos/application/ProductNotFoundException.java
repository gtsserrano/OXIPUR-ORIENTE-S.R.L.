package bo.com.oxipuroriente.inventory.modules.productos.application;

public class ProductNotFoundException extends RuntimeException {

    public ProductNotFoundException(Long id) {
        super("Product not found: " + id);
    }
}
