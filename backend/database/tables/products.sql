-- Catalogo de gases y productos.

USE oxipur_inventory;

CREATE TABLE IF NOT EXISTS products (
    id BIGINT NOT NULL AUTO_INCREMENT,
    code VARCHAR(60) NOT NULL,
    name VARCHAR(120) NOT NULL,
    description VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT pk_products PRIMARY KEY (id),
    CONSTRAINT uq_products_code UNIQUE (code)
) ENGINE=InnoDB;

