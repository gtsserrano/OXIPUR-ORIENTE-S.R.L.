package bo.com.oxipuroriente.inventory.modules.ventas.presentation;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;

public record UpdateSalesNoteRequest(
        @NotBlank String customerName,
        LocalDateTime noteDate,
        String observations,
        @DecimalMin(value = "0.00") BigDecimal utilityAmount) {
}
