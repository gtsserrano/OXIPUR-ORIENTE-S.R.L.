package bo.com.oxipuroriente.inventory.modules.inventario.infrastructure;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import bo.com.oxipuroriente.inventory.modules.inventario.domain.InventoryMovement;
import bo.com.oxipuroriente.inventory.modules.inventario.domain.InventoryMovementType;

public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, Long> {

    List<InventoryMovement> findBySalesNoteId(Long salesNoteId);

    List<InventoryMovement> findByCylinderId(Long cylinderId);

    List<InventoryMovement> findByMovementDateGreaterThanEqualAndMovementDateLessThan(
            LocalDate fromDate,
            LocalDate toDate);

    List<InventoryMovement> findByCylinderIdAndMovementTypeOrderByMovementDateDescCreatedAtDesc(
            Long cylinderId,
            InventoryMovementType movementType);
}
