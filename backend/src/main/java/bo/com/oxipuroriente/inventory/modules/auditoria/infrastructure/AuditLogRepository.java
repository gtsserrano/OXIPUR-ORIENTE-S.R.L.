package bo.com.oxipuroriente.inventory.modules.auditoria.infrastructure;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import bo.com.oxipuroriente.inventory.modules.auditoria.domain.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    Page<AuditLog> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<AuditLog> findByEntityTypeIgnoreCaseOrderByCreatedAtDesc(String entityType, Pageable pageable);

    Page<AuditLog> findByEntityTypeIgnoreCaseAndEntityIdOrderByCreatedAtDesc(
            String entityType,
            String entityId,
            Pageable pageable);
}

