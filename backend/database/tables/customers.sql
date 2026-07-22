-- Catalogo normalizado de clientes.

USE oxipur_inventory;

CREATE TABLE IF NOT EXISTS customers (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(160) NOT NULL,
    normalized_name VARCHAR(160) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    merged_into_customer_id BIGINT,
    merged_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT pk_customers PRIMARY KEY (id),
    CONSTRAINT uq_customers_normalized_name UNIQUE (normalized_name),
    CONSTRAINT fk_customers_merged_into
        FOREIGN KEY (merged_into_customer_id) REFERENCES customers (id),
    INDEX idx_customers_name (name),
    INDEX idx_customers_merged_into (merged_into_customer_id)
) ENGINE=InnoDB;
