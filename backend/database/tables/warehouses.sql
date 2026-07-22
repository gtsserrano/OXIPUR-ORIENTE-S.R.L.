-- Almacenes y planta.

USE oxipur_inventory;

CREATE TABLE IF NOT EXISTS warehouses (
    id BIGINT NOT NULL AUTO_INCREMENT,
    code VARCHAR(60) NOT NULL,
    name VARCHAR(120) NOT NULL,
    address VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT pk_warehouses PRIMARY KEY (id),
    CONSTRAINT uq_warehouses_code UNIQUE (code)
) ENGINE=InnoDB;

