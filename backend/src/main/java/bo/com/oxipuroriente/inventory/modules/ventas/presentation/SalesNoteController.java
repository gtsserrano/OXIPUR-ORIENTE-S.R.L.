package bo.com.oxipuroriente.inventory.modules.ventas.presentation;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import bo.com.oxipuroriente.inventory.modules.ventas.application.SalesNoteService;
import bo.com.oxipuroriente.inventory.shared.application.DateFilterType;
import bo.com.oxipuroriente.inventory.shared.application.DatePeriodFactory;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/sales-notes")
public class SalesNoteController {

    private final SalesNoteService service;

    public SalesNoteController(SalesNoteService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SalesNoteResponse> create(@Valid @RequestBody CreateSalesNoteRequest request) {
        SalesNoteResponse response = service.create(request);
        return ResponseEntity
                .created(URI.create("/api/sales-notes/" + response.id()))
                .body(response);
    }

    @GetMapping
    public List<SalesNoteResponse> findAll(
            @RequestParam(required = false) DateFilterType dateFilterType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        return service.findAll(DatePeriodFactory.from(dateFilterType, date, year, month));
    }

    @GetMapping("/{id}")
    public SalesNoteResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PatchMapping("/{id}")
    public SalesNoteResponse update(@PathVariable Long id, @Valid @RequestBody UpdateSalesNoteRequest request) {
        return service.update(id, request);
    }

    @PatchMapping("/{id}/cancel")
    public SalesNoteResponse cancel(@PathVariable Long id) {
        return service.cancel(id);
    }

    @DeleteMapping("/{id}")
    public SalesNoteResponse delete(@PathVariable Long id) {
        return service.cancel(id);
    }
}
