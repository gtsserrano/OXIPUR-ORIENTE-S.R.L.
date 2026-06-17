package bo.com.oxipuroriente.inventory.shared.presentation;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import bo.com.oxipuroriente.inventory.modules.almacenes.application.DuplicateWarehouseCodeException;
import bo.com.oxipuroriente.inventory.modules.almacenes.application.WarehouseNotFoundException;
import bo.com.oxipuroriente.inventory.modules.cilindros.application.CylinderNotFoundException;
import bo.com.oxipuroriente.inventory.modules.cilindros.application.DuplicateCylinderSerialNumberException;
import bo.com.oxipuroriente.inventory.modules.iam.application.IamAuthenticationException;
import bo.com.oxipuroriente.inventory.modules.iam.application.InvalidUserRoleException;
import bo.com.oxipuroriente.inventory.modules.perfiles.application.DuplicateUserProfileException;
import bo.com.oxipuroriente.inventory.modules.perfiles.application.InvalidUserProfileException;
import bo.com.oxipuroriente.inventory.modules.perfiles.application.UserProfileNotFoundException;
import bo.com.oxipuroriente.inventory.modules.productos.application.DuplicateProductCodeException;
import bo.com.oxipuroriente.inventory.modules.productos.application.ProductNotFoundException;
import bo.com.oxipuroriente.inventory.modules.ventas.application.SalesNoteException;
import org.springframework.security.access.AccessDeniedException;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation() {
        return ResponseEntity.badRequest().body(Map.of("error", "validation_failed"));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> handleUnreadableMessage() {
        return ResponseEntity.badRequest().body(Map.of("error", "invalid_request_body"));
    }

    @ExceptionHandler(IamAuthenticationException.class)
    public ResponseEntity<Map<String, String>> handleIamAuthentication(IamAuthenticationException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", exception.getMessage()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDenied() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "access_denied"));
    }

    @ExceptionHandler(InvalidUserRoleException.class)
    public ResponseEntity<Map<String, String>> handleInvalidRole(InvalidUserRoleException exception) {
        return ResponseEntity.badRequest().body(Map.of("error", exception.getMessage()));
    }

    @ExceptionHandler(InvalidUserProfileException.class)
    public ResponseEntity<Map<String, String>> handleInvalidUserProfile(InvalidUserProfileException exception) {
        return ResponseEntity.badRequest().body(Map.of("error", exception.getMessage()));
    }

    @ExceptionHandler(DuplicateCylinderSerialNumberException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateCylinderSerial(
            DuplicateCylinderSerialNumberException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", exception.getMessage()));
    }

    @ExceptionHandler(DuplicateProductCodeException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateProductCode(DuplicateProductCodeException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", exception.getMessage()));
    }

    @ExceptionHandler(DuplicateUserProfileException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateUserProfile(DuplicateUserProfileException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", exception.getMessage()));
    }

    @ExceptionHandler(DuplicateWarehouseCodeException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateWarehouseCode(DuplicateWarehouseCodeException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", exception.getMessage()));
    }

    @ExceptionHandler(CylinderNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleCylinderNotFound(CylinderNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", exception.getMessage()));
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleProductNotFound(ProductNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", exception.getMessage()));
    }

    @ExceptionHandler(UserProfileNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserProfileNotFound(UserProfileNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", exception.getMessage()));
    }

    @ExceptionHandler(WarehouseNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleWarehouseNotFound(WarehouseNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", exception.getMessage()));
    }

    @ExceptionHandler(SalesNoteException.class)
    public ResponseEntity<Map<String, String>> handleSalesNoteException(SalesNoteException exception) {
        return ResponseEntity.badRequest().body(Map.of("error", exception.getMessage()));
    }
}
