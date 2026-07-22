package bo.com.oxipuroriente.inventory.modules.clientes.presentation;

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

import bo.com.oxipuroriente.inventory.modules.clientes.application.CustomerService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<CustomerResponse> create(@Valid @RequestBody CreateCustomerRequest request) {
        CustomerResponse response = service.create(request);
        return ResponseEntity.created(URI.create("/api/customers/" + response.id())).body(response);
    }

    @GetMapping
    public List<CustomerResponse> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public CustomerResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PatchMapping("/{id}")
    public CustomerResponse update(@PathVariable Long id, @RequestBody UpdateCustomerRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
