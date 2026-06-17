package bo.com.oxipuroriente.inventory.modules.perfiles.application;

public class InvalidUserProfileException extends RuntimeException {

    public InvalidUserProfileException(String message) {
        super(message);
    }
}
