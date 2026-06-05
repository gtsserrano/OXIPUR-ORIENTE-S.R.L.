package bo.com.oxipuroriente.inventory.modules.ventas.infrastructure;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNoteDeliveredCylinder;

public interface SalesNoteDeliveredCylinderRepository extends JpaRepository<SalesNoteDeliveredCylinder, Long> {

    List<SalesNoteDeliveredCylinder> findBySalesNoteId(Long salesNoteId);
}
