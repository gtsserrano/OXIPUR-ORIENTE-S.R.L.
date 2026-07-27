package bo.com.oxipuroriente.inventory.modules.ventas.presentation;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNoteSourceType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateSalesNoteRequest(
        String noteNumber,
        @NotBlank String customerName,
        @NotNull LocalDateTime noteDate,
        String observations,
        @DecimalMin(value = "0.00") BigDecimal utilityAmount,
        SalesNoteSourceType sourceType,
        @Valid List<DeliveredCylinderRequest> deliveredCylinders,
        @Valid List<CollectedCylinderRequest> collectedCylinders) {

    public record DeliveredCylinderRequest(
            Long cylinderId,
            String serialNumber,
            @NotNull Long productId,
            @DecimalMin(value = "0.01")
            BigDecimal capacityM3,
            @DecimalMin(value = "0.00")
            BigDecimal amount,
            String ownerName,
            String observations) {
    }

    public record CollectedCylinderRequest(
            Long cylinderId,
            String serialNumber,
            Long productId,
            @DecimalMin(value = "0.01")
            BigDecimal capacityM3,
            String ownerName,
            String observations) {
    }
}
