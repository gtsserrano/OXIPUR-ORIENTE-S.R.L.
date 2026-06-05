package bo.com.oxipuroriente.inventory.modules.perfiles.application;

public class DuplicateUserProfileException extends RuntimeException {

    public DuplicateUserProfileException(String fullName) {
        super("Profile already exists: " + fullName);
    }
}
