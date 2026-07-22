package bo.com.oxipuroriente.inventory.modules.ventas.infrastructure;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNoteCollectedCylinder;

public interface SalesNoteCollectedCylinderRepository extends JpaRepository<SalesNoteCollectedCylinder, Long> {

    List<SalesNoteCollectedCylinder> findBySalesNoteId(Long salesNoteId);

    List<SalesNoteCollectedCylinder> findBySalesNoteIdIn(Collection<Long> salesNoteIds);
}
