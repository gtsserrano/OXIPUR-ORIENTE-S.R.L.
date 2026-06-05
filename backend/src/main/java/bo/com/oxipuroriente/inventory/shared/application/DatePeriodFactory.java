package bo.com.oxipuroriente.inventory.shared.application;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.YearMonth;

import bo.com.oxipuroriente.inventory.modules.ventas.application.SalesNoteException;

public final class DatePeriodFactory {

    private static final int MIN_YEAR = 2000;
    private static final int MAX_YEAR = 2100;

    private DatePeriodFactory() {
    }

    public static DatePeriod from(DateFilterType dateFilterType, LocalDate date, Integer year, Integer month) {
        if (dateFilterType == null) {
            return null;
        }
        return switch (dateFilterType) {
            case DAY -> fromDay(date);
            case MONTH -> fromMonth(year, month);
            case YEAR -> fromYear(year);
        };
    }

    private static DatePeriod fromDay(LocalDate date) {
        if (date == null) {
            throw new SalesNoteException("date is required for DAY filter");
        }
        validateYear(date.getYear());
        return new DatePeriod(DateFilterType.DAY, date.atStartOfDay(), date.plusDays(1).atStartOfDay());
    }

    private static DatePeriod fromMonth(Integer year, Integer month) {
        validateYear(year);
        if (month == null || month < 1 || month > 12) {
            throw new SalesNoteException("month must be between 1 and 12");
        }
        YearMonth yearMonth = YearMonth.of(year, month);
        return new DatePeriod(
                DateFilterType.MONTH,
                yearMonth.atDay(1).atStartOfDay(),
                yearMonth.plusMonths(1).atDay(1).atStartOfDay());
    }

    private static DatePeriod fromYear(Integer year) {
        validateYear(year);
        Year selectedYear = Year.of(year);
        return new DatePeriod(
                DateFilterType.YEAR,
                selectedYear.atDay(1).atStartOfDay(),
                selectedYear.plusYears(1).atDay(1).atStartOfDay());
    }

    private static void validateYear(Integer year) {
        if (year == null) {
            throw new SalesNoteException("year is required for this date filter");
        }
        if (year < MIN_YEAR || year > MAX_YEAR) {
            throw new SalesNoteException("year must be between " + MIN_YEAR + " and " + MAX_YEAR);
        }
    }
}
