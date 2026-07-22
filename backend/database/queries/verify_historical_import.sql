-- Verificacion de la migracion del archivo:
-- oxipur_detallemovimientos_2026-07-21 (2).xlsx
-- Este archivo solo consulta datos; no modifica ni elimina registros.

USE oxipur_inventory;

SELECT 'Notas de venta importadas' AS comprobacion, COUNT(*) AS resultado
FROM sales_notes
WHERE source_reference = 'oxipur_detallemovimientos_2026-07-21 (2).xlsx'
UNION ALL
SELECT 'Cilindros entregados', COUNT(*)
FROM sales_note_delivered_cylinders delivered
JOIN sales_notes note ON note.id = delivered.sales_note_id
WHERE note.source_reference = 'oxipur_detallemovimientos_2026-07-21 (2).xlsx'
UNION ALL
SELECT 'Cilindros recibidos/vacios', COUNT(*)
FROM sales_note_collected_cylinders collected
JOIN sales_notes note ON note.id = collected.sales_note_id
WHERE note.source_reference = 'oxipur_detallemovimientos_2026-07-21 (2).xlsx'
UNION ALL
SELECT 'Movimientos historicos', COUNT(*)
FROM inventory_movements movement
JOIN sales_notes note ON note.id = movement.sales_note_id
WHERE note.source_reference = 'oxipur_detallemovimientos_2026-07-21 (2).xlsx'
UNION ALL
SELECT 'Notas con entregados y recibidos', COUNT(*)
FROM (
    SELECT note.id
    FROM sales_notes note
    JOIN sales_note_delivered_cylinders delivered ON delivered.sales_note_id = note.id
    JOIN sales_note_collected_cylinders collected ON collected.sales_note_id = note.id
    WHERE note.source_reference = 'oxipur_detallemovimientos_2026-07-21 (2).xlsx'
    GROUP BY note.id
) mixed_notes
UNION ALL
SELECT 'Notas sin detalle', COUNT(*)
FROM sales_notes note
LEFT JOIN sales_note_delivered_cylinders delivered ON delivered.sales_note_id = note.id
LEFT JOIN sales_note_collected_cylinders collected ON collected.sales_note_id = note.id
WHERE note.source_reference = 'oxipur_detallemovimientos_2026-07-21 (2).xlsx'
  AND delivered.id IS NULL
  AND collected.id IS NULL
UNION ALL
SELECT 'Movimientos sin nota', COUNT(*)
FROM inventory_movements
WHERE sales_note_id IS NULL
UNION ALL
SELECT 'Filas importadas sin trazabilidad', COUNT(*)
FROM inventory_movements movement
JOIN sales_notes note ON note.id = movement.sales_note_id
WHERE note.source_reference = 'oxipur_detallemovimientos_2026-07-21 (2).xlsx'
  AND movement.source_row_number IS NULL
UNION ALL
SELECT 'Importaciones auditadas', COUNT(*)
FROM audit_logs
WHERE entity_type = 'HISTORICAL_MOVEMENT_IMPORT'
  AND entity_id = '2026-07-21';

-- Ejemplo de una nota que contiene un cilindro entregado y uno recibido.
-- Puedes reemplazar NV-006775 por cualquier otro numero de nota.

SELECT
    note.id,
    note.note_number,
    note.note_date,
    customer.name AS customer_name,
    note.total_amount,
    note.status,
    note.source_reference
FROM sales_notes note
JOIN customers customer ON customer.id = note.customer_id
WHERE note.note_number = 'NV-006775';

SELECT detail.*
FROM (
    SELECT
        delivered.source_row_number,
        'ENTREGADO' AS movement_state,
        cylinder.serial_number,
        product.name AS product_name,
        delivered.capacity_m3,
        delivered.owner_name,
        delivered.amount,
        delivered.observations
    FROM sales_note_delivered_cylinders delivered
    JOIN sales_notes note ON note.id = delivered.sales_note_id
    JOIN cylinders cylinder ON cylinder.id = delivered.cylinder_id
    JOIN products product ON product.id = delivered.product_id
    WHERE note.note_number = 'NV-006775'

    UNION ALL

    SELECT
        collected.source_row_number,
        'RECIBIDO' AS movement_state,
        cylinder.serial_number,
        product.name AS product_name,
        collected.capacity_m3,
        collected.owner_name,
        CAST(NULL AS DECIMAL(12, 2)) AS amount,
        collected.observations
    FROM sales_note_collected_cylinders collected
    JOIN sales_notes note ON note.id = collected.sales_note_id
    JOIN cylinders cylinder ON cylinder.id = collected.cylinder_id
    JOIN products product ON product.id = collected.product_id
    WHERE note.note_number = 'NV-006775'
) detail
ORDER BY detail.source_row_number;
