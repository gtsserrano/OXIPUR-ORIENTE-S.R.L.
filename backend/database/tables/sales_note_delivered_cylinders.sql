-- Cilindros llenos entregados dentro de una nota de venta.

USE oxipur_inventory;

CREATE TABLE IF NOT EXISTS sales_note_delivered_cylinders (
    id BIGINT NOT NULL AUTO_INCREMENT,
    sales_note_id BIGINT NOT NULL,
    cylinder_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    origin_warehouse_id BIGINT NOT NULL,
    capacity_m3 DECIMAL(10,2) NOT NULL,
    owner_name VARCHAR(160) NOT NULL,
    amount DECIMAL(12,2),
    source_row_number INTEGER,
    observations VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT pk_sales_note_delivered PRIMARY KEY (id),
    CONSTRAINT uq_sales_note_delivered_source_row
        UNIQUE (sales_note_id, source_row_number),
    CONSTRAINT fk_sales_note_delivered_note
        FOREIGN KEY (sales_note_id) REFERENCES sales_notes (id),
    CONSTRAINT fk_sales_note_delivered_cylinder
        FOREIGN KEY (cylinder_id) REFERENCES cylinders (id),
    CONSTRAINT fk_sales_note_delivered_product
        FOREIGN KEY (product_id) REFERENCES products (id),
    CONSTRAINT fk_sales_note_delivered_origin_warehouse
        FOREIGN KEY (origin_warehouse_id) REFERENCES warehouses (id)
) ENGINE=InnoDB;

