package bo.com.oxipuroriente.inventory.modules.utilidades.presentation;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import bo.com.oxipuroriente.inventory.modules.utilidades.application.UtilitySummaryService;
import bo.com.oxipuroriente.inventory.shared.application.DateFilterType;
import bo.com.oxipuroriente.inventory.shared.application.DatePeriodFactory;

@RestController
@RequestMapping("/api/utilities")
public class UtilityController {

    private final UtilitySummaryService service;

    public UtilityController(UtilitySummaryService service) {
        this.service = service;
    }

    @GetMapping("/summary")
    public UtilitySummaryResponse summary(
            @RequestParam(required = false) DateFilterType dateFilterType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        return service.summarize(DatePeriodFactory.from(dateFilterType, date, year, month));
    }
}
