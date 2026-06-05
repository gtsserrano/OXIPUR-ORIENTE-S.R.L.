package bo.com.oxipuroriente.inventory.modules.almacenes.infrastructure;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import bo.com.oxipuroriente.inventory.modules.almacenes.domain.Warehouse;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {

    boolean existsByCode(String code);

    boolean existsByCodeAndIdNot(String code, Long id);

    Optional<Warehouse> findByCode(String code);
}
