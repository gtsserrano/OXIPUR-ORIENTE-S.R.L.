package bo.com.oxipuroriente.inventory.modules.iam.application;

public class InvalidUserRoleException extends RuntimeException {

    public InvalidUserRoleException(String roleName) {
        super("invalid_role");
    }
}
