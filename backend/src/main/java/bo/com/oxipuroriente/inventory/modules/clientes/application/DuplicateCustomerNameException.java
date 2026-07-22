package bo.com.oxipuroriente.inventory.modules.clientes.application;

public class DuplicateCustomerNameException extends RuntimeException {

    public DuplicateCustomerNameException(String name) {
        super("Customer name already exists: " + name);
    }
}
