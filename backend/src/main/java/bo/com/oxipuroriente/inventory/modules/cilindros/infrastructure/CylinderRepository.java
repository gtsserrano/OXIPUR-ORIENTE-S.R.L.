package bo.com.oxipuroriente.inventory.modules.cilindros.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import bo.com.oxipuroriente.inventory.modules.cilindros.domain.Cylinder;

public interface CylinderRepository extends JpaRepository<Cylinder, Long>, JpaSpecificationExecutor<Cylinder> {

    boolean existsBySerialNumber(String serialNumber);

    boolean existsBySerialNumberAndIdNot(String serialNumber, Long id);

    @Query("select count(c) from Cylinder c where c.active = true and upper(trim(c.owner)) = upper(trim(:owner))")
    long countActiveByNormalizedOwner(String owner);
}
