-- Trazabilidad de entradas y salidas de cilindros.

USE oxipur_inventory;

CREATE TABLE IF NOT EXISTS inventory_movements (
    id BIGINT NOT NULL AUTO_INCREMENT,
    sales_note_id BIGINT NOT NULL,
    cylinder_id BIGINT NOT NULL,
    product_id BIGINT,
    movement_type VARCHAR(40) NOT NULL,
    origin_warehouse_id BIGINT,
    destination_warehouse_id BIGINT,
    origin_location_type VARCHAR(40),
    destination_location_type VARCHAR(40) NOT NULL,
    origin_customer_name VARCHAR(160),
    destination_customer_name VARCHAR(160),
    movement_date DATE NOT NULL,
    movement_at TIMESTAMP,
    amount DECIMAL(12,2),
    source_row_number INTEGER,
    notes VARCHAR(255),
    source_type VARCHAR(40) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT pk_inventory_movements PRIMARY KEY (id),
    CONSTRAINT uq_inventory_movements_source_row
        UNIQUE (sales_note_id, source_row_number),
    CONSTRAINT fk_inventory_movements_sales_note
        FOREIGN KEY (sales_note_id) REFERENCES sales_notes (id),
    CONSTRAINT fk_inventory_movements_cylinder
        FOREIGN KEY (cylinder_id) REFERENCES cylinders (id),
    CONSTRAINT fk_inventory_movements_product
        FOREIGN KEY (product_id) REFERENCES products (id),
    CONSTRAINT fk_inventory_movements_origin_warehouse
        FOREIGN KEY (origin_warehouse_id) REFERENCES warehouses (id),
    CONSTRAINT fk_inventory_movements_destination_warehouse
        FOREIGN KEY (destination_warehouse_id) REFERENCES warehouses (id),
    INDEX idx_inventory_movements_sales_note (sales_note_id),
    INDEX idx_inventory_movements_cylinder (cylinder_id),
    INDEX idx_inventory_movements_movement_date (movement_date),
    INDEX idx_inventory_movements_movement_at (movement_at)
) ENGINE=InnoDB;

