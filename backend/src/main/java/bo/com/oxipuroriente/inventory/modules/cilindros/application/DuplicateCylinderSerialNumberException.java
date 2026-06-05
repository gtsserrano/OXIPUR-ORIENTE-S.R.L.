package bo.com.oxipuroriente.inventory.modules.cilindros.application;

public class DuplicateCylinderSerialNumberException extends RuntimeException {

    public DuplicateCylinderSerialNumberException(String serialNumber) {
        super("Cylinder serial number already exists: " + serialNumber);
    }
}
