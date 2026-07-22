-- Nombres historicos que deben resolverse al cliente canonico.

USE oxipur_inventory;

CREATE TABLE IF NOT EXISTS customer_aliases (
    id BIGINT NOT NULL AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    alias_name VARCHAR(160) NOT NULL,
    normalized_alias VARCHAR(160) NOT NULL,
    source_type VARCHAR(40) NOT NULL DEFAULT 'SYSTEM',
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT pk_customer_aliases PRIMARY KEY (id),
    CONSTRAINT uq_customer_aliases_normalized UNIQUE (normalized_alias),
    CONSTRAINT fk_customer_aliases_customer
        FOREIGN KEY (customer_id) REFERENCES customers (id),
    INDEX idx_customer_aliases_customer (customer_id)
) ENGINE=InnoDB;
