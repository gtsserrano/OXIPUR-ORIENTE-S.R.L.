package bo.com.oxipuroriente.inventory.modules.cilindros.presentation;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import bo.com.oxipuroriente.inventory.modules.cilindros.application.CylinderService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cylinders")
public class CylinderController {

    private final CylinderService service;

    public CylinderController(CylinderService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<CylinderResponse> create(@Valid @RequestBody CreateCylinderRequest request) {
        CylinderResponse response = service.create(request);
        return ResponseEntity
                .created(URI.create("/api/cylinders/" + response.id()))
                .body(response);
    }

    @GetMapping
    public List<CylinderResponse> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public CylinderResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PatchMapping("/{id}")
    public CylinderResponse update(@PathVariable Long id, @Valid @RequestBody UpdateCylinderRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
