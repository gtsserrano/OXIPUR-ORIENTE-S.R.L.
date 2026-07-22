-- Catalogo normalizado de clientes.

USE oxipur_inventory;

CREATE TABLE IF NOT EXISTS customers (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(160) NOT NULL,
    normalized_name VARCHAR(160) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT pk_customers PRIMARY KEY (id),
    CONSTRAINT uq_customers_normalized_name UNIQUE (normalized_name),
    INDEX idx_customers_name (name)
) ENGINE=InnoDB;

