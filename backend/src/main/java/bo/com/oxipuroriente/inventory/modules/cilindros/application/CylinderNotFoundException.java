package bo.com.oxipuroriente.inventory.modules.cilindros.application;

public class CylinderNotFoundException extends RuntimeException {

    public CylinderNotFoundException(Long id) {
        super("Cylinder not found: " + id);
    }
}
