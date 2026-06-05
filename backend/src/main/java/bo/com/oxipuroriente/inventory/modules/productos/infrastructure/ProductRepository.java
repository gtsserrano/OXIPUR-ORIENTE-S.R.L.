package bo.com.oxipuroriente.inventory.modules.productos.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;

import bo.com.oxipuroriente.inventory.modules.productos.domain.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsByCode(String code);

    boolean existsByCodeAndIdNot(String code, Long id);
}
