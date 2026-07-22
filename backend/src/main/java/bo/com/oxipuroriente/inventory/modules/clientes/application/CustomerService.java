package bo.com.oxipuroriente.inventory.modules.clientes.application;

import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import bo.com.oxipuroriente.inventory.modules.auditoria.application.AuditLogService;
import bo.com.oxipuroriente.inventory.modules.auditoria.domain.AuditAction;
import bo.com.oxipuroriente.inventory.modules.clientes.domain.Customer;
import bo.com.oxipuroriente.inventory.modules.clientes.infrastructure.CustomerRepository;
import bo.com.oxipuroriente.inventory.modules.clientes.presentation.CreateCustomerRequest;
import bo.com.oxipuroriente.inventory.modules.clientes.presentation.CustomerResponse;
import bo.com.oxipuroriente.inventory.modules.clientes.presentation.UpdateCustomerRequest;

@Service
public class CustomerService {

    private final CustomerRepository repository;
    private final AuditLogService auditLogService;

    public CustomerService(CustomerRepository repository, AuditLogService auditLogService) {
        this.repository = repository;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public CustomerResponse create(CreateCustomerRequest request) {
        String normalizedName = normalize(request.name());
        if (repository.existsByNormalizedName(normalizedName)) {
            throw new DuplicateCustomerNameException(normalizedName);
        }

        Customer customer = new Customer();
        customer.setName(normalizedName);
        customer.setNormalizedName(normalizedName);
        customer.setActive(request.active() == null || request.active());
        CustomerResponse response = CustomerResponse.from(repository.save(customer));
        auditLogService.record(AuditAction.CREATE, "CUSTOMER", response.id(), null, response);
        return response;
    }

    @Transactional(readOnly = true)
    public List<CustomerResponse> findAll() {
        return repository.findAllByActiveTrueOrderByNameAsc().stream()
                .map(CustomerResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public CustomerResponse findById(Long id) {
        return CustomerResponse.from(findCustomer(id));
    }

    @Transactional
    public CustomerResponse update(Long id, UpdateCustomerRequest request) {
        Customer customer = findCustomer(id);
        CustomerResponse previous = CustomerResponse.from(customer);
        if (request.name() != null && !request.name().isBlank()) {
            String normalizedName = normalize(request.name());
            if (repository.existsByNormalizedNameAndIdNot(normalizedName, id)) {
                throw new DuplicateCustomerNameException(normalizedName);
            }
            customer.setName(normalizedName);
            customer.setNormalizedName(normalizedName);
        }
        if (request.active() != null) {
            customer.setActive(request.active());
        }
        CustomerResponse response = CustomerResponse.from(repository.save(customer));
        auditLogService.record(AuditAction.UPDATE, "CUSTOMER", id, previous, response);
        return response;
    }

    @Transactional
    public void delete(Long id) {
        Customer customer = findCustomer(id);
        CustomerResponse previous = CustomerResponse.from(customer);
        customer.setActive(false);
        CustomerResponse response = CustomerResponse.from(repository.save(customer));
        auditLogService.record(AuditAction.DEACTIVATE, "CUSTOMER", id, previous, response);
    }

    private Customer findCustomer(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(id));
    }

    private String normalize(String name) {
        return name.trim().toUpperCase(Locale.ROOT);
    }
}
