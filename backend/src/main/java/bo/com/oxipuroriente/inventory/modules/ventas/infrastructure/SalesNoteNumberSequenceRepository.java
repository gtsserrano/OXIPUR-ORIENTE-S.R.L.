package bo.com.oxipuroriente.inventory.modules.ventas.infrastructure;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNoteNumberSequence;
import jakarta.persistence.LockModeType;

public interface SalesNoteNumberSequenceRepository extends JpaRepository<SalesNoteNumberSequence, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select numberSequence from SalesNoteNumberSequence numberSequence where numberSequence.id = :id")
    Optional<SalesNoteNumberSequence> findByIdForUpdate(@Param("id") Long id);
}
