package bo.com.oxipuroriente.inventory.shared.application;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record DatePeriod(
        DateFilterType dateFilterType,
        LocalDateTime fromDate,
        LocalDateTime toDate) {

    public LocalDate fromLocalDate() {
        return fromDate.toLocalDate();
    }

    public LocalDate toLocalDateExclusive() {
        return toDate.toLocalDate();
    }
}
