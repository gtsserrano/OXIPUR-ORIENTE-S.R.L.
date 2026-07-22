package bo.com.oxipuroriente.inventory.modules.clientes.application;

public class CustomerNotFoundException extends RuntimeException {

    public CustomerNotFoundException(Long id) {
        super("Customer not found: " + id);
    }
}
