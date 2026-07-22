package bo.com.oxipuroriente.inventory.modules.clientes.infrastructure;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import bo.com.oxipuroriente.inventory.modules.clientes.domain.CustomerAlias;

public interface CustomerAliasRepository extends JpaRepository<CustomerAlias, Long> {

    Optional<CustomerAlias> findByNormalizedAlias(String normalizedAlias);
}
