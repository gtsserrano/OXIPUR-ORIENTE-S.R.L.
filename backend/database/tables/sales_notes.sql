-- Cabecera de las notas de venta.

USE oxipur_inventory;

CREATE TABLE IF NOT EXISTS sales_notes (
    id BIGINT NOT NULL AUTO_INCREMENT,
    note_number VARCHAR(80) NOT NULL,
    customer_name VARCHAR(160) NOT NULL,
    customer_id BIGINT NOT NULL,
    note_date TIMESTAMP NOT NULL,
    observations VARCHAR(255),
    status VARCHAR(40) NOT NULL DEFAULT 'REGISTERED',
    source_type VARCHAR(40) NOT NULL DEFAULT 'USER',
    utility_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    source_reference VARCHAR(255),
    source_date_text VARCHAR(40),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT pk_sales_notes PRIMARY KEY (id),
    CONSTRAINT uq_sales_notes_note_number UNIQUE (note_number),
    CONSTRAINT fk_sales_notes_customer
        FOREIGN KEY (customer_id) REFERENCES customers (id),
    INDEX idx_sales_notes_note_number (note_number),
    INDEX idx_sales_notes_customer_name (customer_name),
    INDEX idx_sales_notes_customer_id (customer_id),
    INDEX idx_sales_notes_note_date (note_date),
    INDEX idx_sales_notes_status (status)
) ENGINE=InnoDB;

