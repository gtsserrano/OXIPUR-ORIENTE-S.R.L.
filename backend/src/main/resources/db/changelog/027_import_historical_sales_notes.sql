-- Normalized import generated from oxipur_detallemovimientos_2026-07-21 (2).xlsx.
-- Every source row is preserved through source_row_number, including source duplicates.

INSERT INTO customers (name, normalized_name, active, created_at, updated_at)
SELECT MIN(customer_name), UPPER(TRIM(customer_name)), TRUE, MIN(STR_TO_DATE(note_date, '%Y-%m-%d %H:%i:%s')), CURRENT_TIMESTAMP
FROM historical_sales_note_rows_20260721
GROUP BY UPPER(TRIM(customer_name))
ON DUPLICATE KEY UPDATE active = TRUE, updated_at = CURRENT_TIMESTAMP;

INSERT INTO customers (name, normalized_name, active, created_at, updated_at)
SELECT MIN(owner_name), UPPER(TRIM(owner_name)), TRUE, MIN(STR_TO_DATE(note_date, '%Y-%m-%d %H:%i:%s')), CURRENT_TIMESTAMP
FROM historical_sales_note_rows_20260721
WHERE UPPER(TRIM(owner_name)) NOT IN ('OXIPUR', 'CLIENTE')
GROUP BY UPPER(TRIM(owner_name))
ON DUPLICATE KEY UPDATE active = TRUE, updated_at = CURRENT_TIMESTAMP;

INSERT INTO products (code, name, description, active, created_at, updated_at)
SELECT product_code, MIN(product_name), 'Importado desde detalle historico de movimientos', TRUE,
       MIN(STR_TO_DATE(note_date, '%Y-%m-%d %H:%i:%s')), CURRENT_TIMESTAMP
FROM historical_sales_note_rows_20260721
GROUP BY product_code
ON DUPLICATE KEY UPDATE name = VALUES(name), active = TRUE, updated_at = CURRENT_TIMESTAMP;

INSERT INTO cylinders (
    serial_number, capacity_m3, owner, price, active, status, owner_type,
    created_at, updated_at, current_location_type, current_warehouse_id,
    current_customer_name, location_date, location_observation)
SELECT source.serial_number,
       CAST(MIN(source.capacity_m3) AS DECIMAL(10,2)),
       CASE
           WHEN UPPER(MIN(source.owner_name)) = 'OXIPUR' THEN 'Oxipur'
           WHEN UPPER(MIN(source.owner_name)) = 'CLIENTE' THEN MIN(source.customer_name)
           ELSE MIN(source.owner_name)
       END,
       NULL,
       TRUE,
       'AVAILABLE',
       CASE WHEN UPPER(MIN(source.owner_name)) = 'OXIPUR' THEN 'COMPANY' ELSE 'CUSTOMER' END,
       MIN(STR_TO_DATE(source.note_date, '%Y-%m-%d %H:%i:%s')),
       CURRENT_TIMESTAMP,
       'PLANTA',
       (SELECT id FROM warehouses WHERE code = 'PLANTA'),
       NULL,
       DATE(MIN(STR_TO_DATE(source.note_date, '%Y-%m-%d %H:%i:%s'))),
       'Creado por migracion historica de notas de venta'
FROM historical_sales_note_rows_20260721 source
WHERE NOT EXISTS (
    SELECT 1 FROM cylinders existing WHERE existing.serial_number = source.serial_number
)
GROUP BY source.serial_number;

INSERT INTO sales_notes (
    note_number, customer_id, customer_name, note_date, observations,
    utility_amount, total_amount, status, source_type, source_reference,
    source_date_text, created_at, updated_at)
SELECT source.note_number,
       customer.id,
       MIN(source.customer_name),
       MIN(STR_TO_DATE(source.note_date, '%Y-%m-%d %H:%i:%s')),
       'Importado desde detalle historico de movimientos',
       0.00,
       SUM(CASE WHEN source.movement_state = 'ENTREGADO' AND source.amount IS NOT NULL AND source.amount <> ''
                THEN CAST(source.amount AS DECIMAL(12,2)) ELSE 0.00 END),
       'REGISTERED',
       'SCRIPT',
       'oxipur_detallemovimientos_2026-07-21 (2).xlsx',
       MIN(source.source_date_text),
       MIN(STR_TO_DATE(source.note_date, '%Y-%m-%d %H:%i:%s')),
       CURRENT_TIMESTAMP
FROM historical_sales_note_rows_20260721 source
JOIN customers customer ON customer.normalized_name = UPPER(TRIM(source.customer_name))
WHERE NOT EXISTS (
    SELECT 1 FROM sales_notes existing WHERE existing.note_number = source.note_number
)
GROUP BY source.note_number, customer.id;

INSERT INTO sales_note_delivered_cylinders (
    sales_note_id, cylinder_id, product_id, origin_warehouse_id,
    capacity_m3, owner_name, amount, source_row_number, observations, created_at)
SELECT note.id,
       cylinder.id,
       product.id,
       warehouse.id,
       CAST(source.capacity_m3 AS DECIMAL(10,2)),
       source.owner_name,
       CASE WHEN source.amount IS NULL OR source.amount = '' THEN NULL ELSE CAST(source.amount AS DECIMAL(12,2)) END,
       source.source_row_number,
       source.observations,
       STR_TO_DATE(source.note_date, '%Y-%m-%d %H:%i:%s')
FROM historical_sales_note_rows_20260721 source
JOIN sales_notes note ON note.note_number = source.note_number
JOIN cylinders cylinder ON cylinder.serial_number = source.serial_number
JOIN products product ON product.code = source.product_code
JOIN warehouses warehouse ON warehouse.code = 'PLANTA'
WHERE source.movement_state = 'ENTREGADO'
  AND note.source_reference = 'oxipur_detallemovimientos_2026-07-21 (2).xlsx'
  AND NOT EXISTS (
      SELECT 1 FROM sales_note_delivered_cylinders existing
      WHERE existing.sales_note_id = note.id AND existing.source_row_number = source.source_row_number
  );

INSERT INTO sales_note_collected_cylinders (
    sales_note_id, cylinder_id, product_id, destination_warehouse_id,
    origin_customer_name, capacity_m3, owner_name, source_row_number,
    observations, created_at)
SELECT note.id,
       cylinder.id,
       product.id,
       warehouse.id,
       source.customer_name,
       CAST(source.capacity_m3 AS DECIMAL(10,2)),
       source.owner_name,
       source.source_row_number,
       source.observations,
       STR_TO_DATE(source.note_date, '%Y-%m-%d %H:%i:%s')
FROM historical_sales_note_rows_20260721 source
JOIN sales_notes note ON note.note_number = source.note_number
JOIN cylinders cylinder ON cylinder.serial_number = source.serial_number
JOIN products product ON product.code = source.product_code
JOIN warehouses warehouse ON warehouse.code = 'PLANTA'
WHERE source.movement_state = 'RECIBIDO'
  AND note.source_reference = 'oxipur_detallemovimientos_2026-07-21 (2).xlsx'
  AND NOT EXISTS (
      SELECT 1 FROM sales_note_collected_cylinders existing
      WHERE existing.sales_note_id = note.id AND existing.source_row_number = source.source_row_number
  );

INSERT INTO inventory_movements (
    sales_note_id, cylinder_id, product_id, movement_type,
    origin_warehouse_id, destination_warehouse_id,
    origin_location_type, destination_location_type,
    origin_customer_name, destination_customer_name,
    movement_date, movement_at, amount, source_row_number,
    notes, source_type, created_at, updated_at)
SELECT note.id,
       cylinder.id,
       product.id,
       CASE WHEN source.movement_state = 'ENTREGADO' THEN 'PLANTA_A_CLIENTE' ELSE 'CLIENTE_A_PLANTA' END,
       CASE WHEN source.movement_state = 'ENTREGADO' THEN warehouse.id ELSE NULL END,
       CASE WHEN source.movement_state = 'RECIBIDO' THEN warehouse.id ELSE NULL END,
       CASE WHEN source.movement_state = 'ENTREGADO' THEN 'PLANTA' ELSE 'CLIENTE' END,
       CASE WHEN source.movement_state = 'ENTREGADO' THEN 'CLIENTE' ELSE 'PLANTA' END,
       CASE WHEN source.movement_state = 'RECIBIDO' THEN source.customer_name ELSE NULL END,
       CASE WHEN source.movement_state = 'ENTREGADO' THEN source.customer_name ELSE NULL END,
       DATE(STR_TO_DATE(source.note_date, '%Y-%m-%d %H:%i:%s')),
       STR_TO_DATE(source.note_date, '%Y-%m-%d %H:%i:%s'),
       CASE WHEN source.amount IS NULL OR source.amount = '' THEN NULL ELSE CAST(source.amount AS DECIMAL(12,2)) END,
       source.source_row_number,
       source.observations,
       'SCRIPT',
       STR_TO_DATE(source.note_date, '%Y-%m-%d %H:%i:%s'),
       CURRENT_TIMESTAMP
FROM historical_sales_note_rows_20260721 source
JOIN sales_notes note ON note.note_number = source.note_number
JOIN cylinders cylinder ON cylinder.serial_number = source.serial_number
JOIN products product ON product.code = source.product_code
JOIN warehouses warehouse ON warehouse.code = 'PLANTA'
WHERE note.source_reference = 'oxipur_detallemovimientos_2026-07-21 (2).xlsx'
  AND NOT EXISTS (
      SELECT 1 FROM inventory_movements existing
      WHERE existing.sales_note_id = note.id AND existing.source_row_number = source.source_row_number
  );

CREATE TEMPORARY TABLE latest_inventory_movement_20260721 AS
SELECT ranked.cylinder_id,
       ranked.destination_location_type,
       ranked.destination_warehouse_id,
       ranked.destination_customer_name,
       ranked.movement_date,
       ranked.notes
FROM (
    SELECT movement.*,
           ROW_NUMBER() OVER (
               PARTITION BY movement.cylinder_id
               ORDER BY COALESCE(movement.movement_at, CAST(movement.movement_date AS DATETIME)) DESC,
                        COALESCE(movement.source_row_number, 0) DESC,
                        movement.id DESC
           ) AS row_rank
    FROM inventory_movements movement
) ranked
WHERE ranked.row_rank = 1;

UPDATE cylinders cylinder
JOIN latest_inventory_movement_20260721 latest ON latest.cylinder_id = cylinder.id
SET cylinder.current_location_type = latest.destination_location_type,
    cylinder.current_warehouse_id = latest.destination_warehouse_id,
    cylinder.current_customer_name = latest.destination_customer_name,
    cylinder.location_date = latest.movement_date,
    cylinder.location_observation = latest.notes,
    cylinder.status = CASE WHEN latest.destination_location_type = 'CLIENTE' THEN 'IN_USE' ELSE 'AVAILABLE' END,
    cylinder.updated_at = CURRENT_TIMESTAMP;

DROP TEMPORARY TABLE latest_inventory_movement_20260721;
