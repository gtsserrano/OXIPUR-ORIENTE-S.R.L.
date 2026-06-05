package bo.com.oxipuroriente.inventory.modules.utilidades.presentation;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import bo.com.oxipuroriente.inventory.shared.application.DateFilterType;

public record UtilitySummaryResponse(
        BigDecimal totalUtility,
        String currency,
        DateFilterType dateFilterType,
        LocalDateTime fromDate,
        LocalDateTime toDate,
        long salesNotesCount) {
}
