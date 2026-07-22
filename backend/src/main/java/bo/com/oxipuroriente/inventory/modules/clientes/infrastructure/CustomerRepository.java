package bo.com.oxipuroriente.inventory.modules.clientes.infrastructure;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import bo.com.oxipuroriente.inventory.modules.clientes.domain.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByNormalizedName(String normalizedName);

    boolean existsByNormalizedName(String normalizedName);

    boolean existsByNormalizedNameAndIdNot(String normalizedName, Long id);

    List<Customer> findAllByActiveTrueOrderByNameAsc();
}
