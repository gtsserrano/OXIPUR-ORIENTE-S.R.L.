-- Maestro de cilindros y ubicacion actual.

USE oxipur_inventory;

CREATE TABLE IF NOT EXISTS cylinders (
    id BIGINT NOT NULL AUTO_INCREMENT,
    serial_number VARCHAR(80) NOT NULL,
    capacity_m3 DECIMAL(10,2) NOT NULL,
    owner VARCHAR(120) NOT NULL,
    price DECIMAL(12,2),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'AVAILABLE',
    owner_type VARCHAR(40) NOT NULL DEFAULT 'COMPANY',
    current_location_type VARCHAR(40),
    current_warehouse_id BIGINT,
    current_customer_name VARCHAR(160),
    location_date DATE,
    location_observation VARCHAR(255),
    CONSTRAINT pk_cylinders PRIMARY KEY (id),
    CONSTRAINT uq_cylinders_serial_number UNIQUE (serial_number),
    CONSTRAINT fk_cylinders_current_warehouse
        FOREIGN KEY (current_warehouse_id) REFERENCES warehouses (id)
) ENGINE=InnoDB;

