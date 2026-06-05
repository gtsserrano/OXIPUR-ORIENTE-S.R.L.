package bo.com.oxipuroriente.inventory.modules.inventario.presentation;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import bo.com.oxipuroriente.inventory.modules.inventario.infrastructure.InventoryMovementRepository;
import bo.com.oxipuroriente.inventory.modules.ventas.application.SalesNoteException;
import bo.com.oxipuroriente.inventory.shared.application.DateFilterType;
import bo.com.oxipuroriente.inventory.shared.application.DatePeriod;
import bo.com.oxipuroriente.inventory.shared.application.DatePeriodFactory;

@RestController
@RequestMapping("/api/inventory-movements")
public class InventoryMovementController {

    private final InventoryMovementRepository repository;

    public InventoryMovementController(InventoryMovementRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<InventoryMovementResponse> findAll(
            @RequestParam(required = false) DateFilterType dateFilterType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        DatePeriod period = DatePeriodFactory.from(dateFilterType, date, year, month);
        return (period == null
                ? repository.findAll()
                : repository.findByMovementDateGreaterThanEqualAndMovementDateLessThan(
                        period.fromLocalDate(),
                        period.toLocalDateExclusive()))
                .stream()
                .map(InventoryMovementResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public InventoryMovementResponse findById(@PathVariable Long id) {
        return repository.findById(id)
                .map(InventoryMovementResponse::from)
                .orElseThrow(() -> new SalesNoteException("Inventory movement not found: " + id));
    }

    @GetMapping("/cylinder/{cylinderId}")
    public List<InventoryMovementResponse> findByCylinderId(@PathVariable Long cylinderId) {
        return repository.findByCylinderId(cylinderId)
                .stream()
                .map(InventoryMovementResponse::from)
                .toList();
    }
}
