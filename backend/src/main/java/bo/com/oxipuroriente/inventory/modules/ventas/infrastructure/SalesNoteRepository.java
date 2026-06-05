package bo.com.oxipuroriente.inventory.modules.ventas.infrastructure;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNote;
import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNoteStatus;

public interface SalesNoteRepository extends JpaRepository<SalesNote, Long> {

    boolean existsByNoteNumber(String noteNumber);

    List<SalesNote> findByNoteDateGreaterThanEqualAndNoteDateLessThan(
            LocalDateTime fromDate,
            LocalDateTime toDate);

    @Query("""
            select coalesce(sum(s.utilityAmount), 0)
            from SalesNote s
            where s.status = :status
              and (:fromDate is null or s.noteDate >= :fromDate)
              and (:toDate is null or s.noteDate < :toDate)
            """)
    BigDecimal sumUtilityAmount(
            @Param("status") SalesNoteStatus status,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate);

    @Query("""
            select count(s)
            from SalesNote s
            where s.status = :status
              and (:fromDate is null or s.noteDate >= :fromDate)
              and (:toDate is null or s.noteDate < :toDate)
            """)
    long countByStatusAndDateRange(
            @Param("status") SalesNoteStatus status,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate);
}
