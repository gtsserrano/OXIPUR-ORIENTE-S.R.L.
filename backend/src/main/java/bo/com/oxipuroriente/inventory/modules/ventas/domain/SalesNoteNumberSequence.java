package bo.com.oxipuroriente.inventory.modules.ventas.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "sales_note_number_sequence")
public class SalesNoteNumberSequence {

    @Id
    private Long id;

    @Column(name = "current_value", nullable = false)
    private long currentValue;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public long getCurrentValue() {
        return currentValue;
    }

    public void setCurrentValue(long currentValue) {
        this.currentValue = currentValue;
    }
}
