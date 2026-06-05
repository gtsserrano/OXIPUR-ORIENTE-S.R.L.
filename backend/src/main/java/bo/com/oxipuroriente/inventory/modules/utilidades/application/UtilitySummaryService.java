package bo.com.oxipuroriente.inventory.modules.utilidades.application;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import bo.com.oxipuroriente.inventory.modules.utilidades.presentation.UtilitySummaryResponse;
import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNoteStatus;
import bo.com.oxipuroriente.inventory.modules.ventas.infrastructure.SalesNoteRepository;
import bo.com.oxipuroriente.inventory.shared.application.DatePeriod;

@Service
public class UtilitySummaryService {

    private static final String CURRENCY = "Bs";

    private final SalesNoteRepository salesNoteRepository;

    public UtilitySummaryService(SalesNoteRepository salesNoteRepository) {
        this.salesNoteRepository = salesNoteRepository;
    }

    @Transactional(readOnly = true)
    public UtilitySummaryResponse summarize(DatePeriod period) {
        BigDecimal totalUtility = salesNoteRepository.sumUtilityAmount(
                SalesNoteStatus.REGISTERED,
                period == null ? null : period.fromDate(),
                period == null ? null : period.toDate());
        long salesNotesCount = salesNoteRepository.countByStatusAndDateRange(
                SalesNoteStatus.REGISTERED,
                period == null ? null : period.fromDate(),
                period == null ? null : period.toDate());

        return new UtilitySummaryResponse(
                totalUtility,
                CURRENCY,
                period == null ? null : period.dateFilterType(),
                period == null ? null : period.fromDate(),
                period == null ? null : period.toDate(),
                salesNotesCount);
    }
}
