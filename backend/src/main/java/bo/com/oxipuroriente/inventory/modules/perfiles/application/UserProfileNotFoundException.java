package bo.com.oxipuroriente.inventory.modules.perfiles.application;

public class UserProfileNotFoundException extends RuntimeException {

    public UserProfileNotFoundException(Long id) {
        super("Profile not found: " + id);
    }
}
