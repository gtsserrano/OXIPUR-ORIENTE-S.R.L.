package bo.com.oxipuroriente.inventory.modules.clientes.application;

import java.util.Locale;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import bo.com.oxipuroriente.inventory.modules.clientes.domain.Customer;
import bo.com.oxipuroriente.inventory.modules.clientes.domain.CustomerAlias;
import bo.com.oxipuroriente.inventory.modules.clientes.infrastructure.CustomerAliasRepository;
import bo.com.oxipuroriente.inventory.modules.clientes.infrastructure.CustomerRepository;

@Service
public class CustomerResolver {

    private final CustomerRepository customerRepository;
    private final CustomerAliasRepository aliasRepository;

    public CustomerResolver(CustomerRepository customerRepository, CustomerAliasRepository aliasRepository) {
        this.customerRepository = customerRepository;
        this.aliasRepository = aliasRepository;
    }

    @Transactional(readOnly = true)
    public Optional<Customer> findExisting(String name) {
        String normalizedName = normalize(name);
        Optional<Customer> directMatch = customerRepository.findByNormalizedName(normalizedName)
                .flatMap(this::canonicalCustomer);
        if (directMatch.isPresent()) {
            return directMatch;
        }
        return aliasRepository.findByNormalizedAlias(normalizedName)
                .flatMap(alias -> customerRepository.findById(alias.getCustomerId()))
                .flatMap(this::canonicalCustomer);
    }

    @Transactional
    public Customer resolveOrCreate(String name) {
        return findExisting(name).orElseGet(() -> {
            String normalizedName = normalize(name);
            Customer customer = new Customer();
            customer.setName(normalizedName);
            customer.setNormalizedName(normalizedName);
            return customerRepository.save(customer);
        });
    }

    @Transactional
    public void registerAlias(Long customerId, String aliasName, String sourceType) {
        String normalizedAlias = normalize(aliasName);
        if (aliasRepository.findByNormalizedAlias(normalizedAlias).isPresent()) {
            return;
        }
        CustomerAlias alias = new CustomerAlias();
        alias.setCustomerId(customerId);
        alias.setAliasName(normalizedAlias);
        alias.setNormalizedAlias(normalizedAlias);
        alias.setSourceType(sourceType == null || sourceType.isBlank() ? "SYSTEM" : sourceType);
        aliasRepository.save(alias);
    }

    public String normalize(String name) {
        return name.trim().replaceAll("\\s+", " ").toUpperCase(Locale.ROOT);
    }

    private Optional<Customer> canonicalCustomer(Customer customer) {
        if (customer.getMergedIntoCustomerId() == null) {
            return Optional.of(customer);
        }
        return customerRepository.findById(customer.getMergedIntoCustomerId());
    }
}
