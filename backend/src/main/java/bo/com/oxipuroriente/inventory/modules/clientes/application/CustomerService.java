package bo.com.oxipuroriente.inventory.modules.clientes.application;

import java.util.List;
import java.util.Optional;

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
    private final CustomerResolver customerResolver;

    public CustomerService(
            CustomerRepository repository,
            AuditLogService auditLogService,
            CustomerResolver customerResolver) {
        this.repository = repository;
        this.auditLogService = auditLogService;
        this.customerResolver = customerResolver;
    }

    @Transactional
    public CustomerResponse create(CreateCustomerRequest request) {
        String normalizedName = customerResolver.normalize(request.name());
        if (customerResolver.findExisting(normalizedName).isPresent()) {
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
            String normalizedName = customerResolver.normalize(request.name());
            Optional<Customer> existing = customerResolver.findExisting(normalizedName);
            if (existing.isPresent() && !existing.orElseThrow().getId().equals(id)) {
                throw new DuplicateCustomerNameException(normalizedName);
            }
            String previousName = customer.getName();
            customer.setName(normalizedName);
            customer.setNormalizedName(normalizedName);
            if (!previousName.equals(normalizedName)) {
                customerResolver.registerAlias(id, previousName, "RENAME");
            }
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

}
