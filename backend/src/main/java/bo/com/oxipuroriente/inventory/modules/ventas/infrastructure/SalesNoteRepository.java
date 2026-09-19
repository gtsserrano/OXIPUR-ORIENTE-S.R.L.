package bo.com.oxipuroriente.inventory.modules.ventas.infrastructure;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNote;
import bo.com.oxipuroriente.inventory.modules.ventas.domain.SalesNoteStatus;

public interface SalesNoteRepository extends JpaRepository<SalesNote, Long> {

    boolean existsByNoteNumber(String noteNumber);

    @Query("select s.noteNumber from SalesNote s")
    List<String> findAllNoteNumbers();

    List<SalesNote> findAllByOrderByNoteDateDescIdDesc();

    List<SalesNote> findAllByOrderByNoteDateDescIdDesc(Pageable pageable);

    List<SalesNote> findByNoteDateGreaterThanEqualAndNoteDateLessThanOrderByNoteDateDescIdDesc(
            LocalDateTime fromDate,
            LocalDateTime toDate);

    @Query("""
            select s
            from SalesNote s
            where (:fromDate is null or s.noteDate >= :fromDate)
              and (:toDate is null or s.noteDate < :toDate)
              and (:noteNumber is null or upper(s.noteNumber) like concat('%', upper(:noteNumber), '%'))
              and (:customerName is null or upper(s.customerName) like concat('%', upper(:customerName), '%'))
            order by s.noteDate desc, s.id desc
            """)
    List<SalesNote> findByFilters(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("noteNumber") String noteNumber,
            @Param("customerName") String customerName);

    @Query("""
            select coalesce(sum(s.totalAmount), 0)
            from SalesNote s
            where s.status = :status
              and (:fromDate is null or s.noteDate >= :fromDate)
              and (:toDate is null or s.noteDate < :toDate)
            """)
    BigDecimal sumTotalAmount(
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
