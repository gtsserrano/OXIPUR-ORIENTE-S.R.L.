package bo.com.oxipuroriente.inventory.modules.iam.application;

public class IamAuthenticationException extends RuntimeException {

    public IamAuthenticationException() {
        super("Invalid username or password");
    }
}
