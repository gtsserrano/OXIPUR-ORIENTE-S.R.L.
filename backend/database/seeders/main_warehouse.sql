-- Almacen principal requerido por los movimientos.

USE oxipur_inventory;

INSERT INTO warehouses (code, name, active, created_at, updated_at)
SELECT 'PLANTA', 'Planta', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM warehouses WHERE code = 'PLANTA');

