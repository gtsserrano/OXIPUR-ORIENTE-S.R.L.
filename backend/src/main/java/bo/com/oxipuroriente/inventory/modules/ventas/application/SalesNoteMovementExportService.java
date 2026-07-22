package bo.com.oxipuroriente.inventory.modules.ventas.application;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNoteStatus;
import bo.com.oxipuroriente.inventory.modules.ventas.presentation.SalesNoteResponse;
import bo.com.oxipuroriente.inventory.shared.application.DatePeriod;

@Service
public class SalesNoteMovementExportService {

    private static final String SHEET_NAME = "DetalleMovimientos";
    private static final String[] HEADERS = {
            "Boleta",
            "Fecha",
            "Serie",
            "Tamano (m³)",
            "Producto",
            "Propietario",
            "Cliente Nota",
            "Cliente",
            "Estado",
            "Monto (BOB)",
            "Observaciones"
    };
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final SalesNoteService salesNoteService;

    public SalesNoteMovementExportService(SalesNoteService salesNoteService) {
        this.salesNoteService = salesNoteService;
    }

    @Transactional(readOnly = true)
    public ExportedWorkbook export(DatePeriod period) {
        List<SalesNoteResponse> notes = salesNoteService.findAll(period).stream()
                .filter(note -> note.status() == SalesNoteStatus.REGISTERED)
                .toList();

        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet(SHEET_NAME);
            writeHeader(sheet);

            int rowIndex = 1;
            for (SalesNoteResponse note : notes) {
                for (SalesNoteResponse.DeliveredCylinderLineResponse line : note.deliveredCylinders()) {
                    writeMovementRow(sheet.createRow(rowIndex++), note, line.serialNumber(), line.capacityM3(),
                            line.productName(), line.ownerName(), "Entregado", line.amount(), line.observations());
                }
                for (SalesNoteResponse.CollectedCylinderLineResponse line : note.collectedCylinders()) {
                    writeMovementRow(sheet.createRow(rowIndex++), note, line.serialNumber(), line.capacityM3(),
                            line.productName(), line.ownerName(), "Recibido", null, line.observations());
                }
            }

            workbook.write(output);
            return new ExportedWorkbook(fileName(period), output.toByteArray(), rowIndex - 1);
        } catch (IOException exception) {
            throw new SalesNoteException("No se pudo generar el archivo Excel de movimientos");
        }
    }

    private void writeHeader(Sheet sheet) {
        Row row = sheet.createRow(0);
        for (int index = 0; index < HEADERS.length; index++) {
            row.createCell(index).setCellValue(HEADERS[index]);
        }
    }

    private void writeMovementRow(
            Row row,
            SalesNoteResponse note,
            String serialNumber,
            BigDecimal capacity,
            String productName,
            String ownerName,
            String state,
            BigDecimal amount,
            String observations) {
        writeText(row, 0, note.noteNumber());
        writeText(row, 1, note.noteDate() == null ? null : DATE_FORMAT.format(note.noteDate()));
        writeText(row, 2, serialNumber);
        writeText(row, 3, decimalText(capacity));
        writeText(row, 4, productName);
        writeText(row, 5, ownerName);
        writeText(row, 6, note.customerName());
        writeText(row, 7, note.customerName());
        writeText(row, 8, state);
        writeText(row, 9, decimalText(amount));
        writeText(row, 10, observations);
    }

    private void writeText(Row row, int column, String value) {
        Cell cell = row.createCell(column);
        cell.setCellValue(value == null ? "" : value);
    }

    private String decimalText(BigDecimal value) {
        return value == null ? "" : value.setScale(2, RoundingMode.HALF_UP).toPlainString();
    }

    private String fileName(DatePeriod period) {
        if (period == null) {
            return "oxipur_detallemovimientos_todos.xlsx";
        }
        return switch (period.dateFilterType()) {
            case DAY -> "oxipur_detallemovimientos_" + period.fromLocalDate() + ".xlsx";
            case MONTH -> "oxipur_detallemovimientos_" + period.fromLocalDate().toString().substring(0, 7) + ".xlsx";
            case YEAR -> "oxipur_detallemovimientos_" + period.fromLocalDate().getYear() + ".xlsx";
        };
    }

    public record ExportedWorkbook(String fileName, byte[] content, int movementCount) {
    }
}
