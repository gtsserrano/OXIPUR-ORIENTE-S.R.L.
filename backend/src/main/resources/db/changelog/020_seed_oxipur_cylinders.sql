-- Seed permanente de cilindros propiedad Oxipur.
-- Fuente: planilla_control_cilindros_unificada_sin_redundancias.xlsx, hoja Control_Cilindros.
-- Filas Oxipur: 2522; cilindros unicos deduplicados por ultima fila: 395.
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '33', 8, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'PREFORTE S.A.', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PREFORTE S.A.'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '33');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '75', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Rudy Portales', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Rudy Portales'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '75');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '105', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '105');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '126', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '126');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '144', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '144');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '145', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Aliviar', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Aliviar'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '145');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '950', 1, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Centro Medico San Pedro', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Centro Medico San Pedro'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '950');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1005', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1005');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1008', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1008');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1039', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Manantial de Vida', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Manantial de Vida'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1039');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1705', 8, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'PREFORTE S.A.', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PREFORTE S.A.'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1705');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1742', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1742');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '3007', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '3007');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT 'LED3007', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = 'LED3007');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT 'LMH3108', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CLINICA APOSTOL SANTIAGO', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CLINICA APOSTOL SANTIAGO'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = 'LMH3108');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '3109', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '3109');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT 'LH03-109', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = 'LH03-109');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT 'LHD3109', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Ana Isabel Coca', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Ana Isabel Coca'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = 'LHD3109');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '3113', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '3113');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT 'LHD3113', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Matersalud', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Matersalud'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = 'LHD3113');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT 'LFS3135', 8, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = 'LFS3135');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '3138', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '3138');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT 'LMH3154', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CLINICA APOSTOL SANTIAGO', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CLINICA APOSTOL SANTIAGO'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = 'LMH3154');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT 'LMH3179', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CLINICA APOSTOL SANTIAGO', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CLINICA APOSTOL SANTIAGO'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = 'LMH3179');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '3183', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '3183');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT 'LEI3183', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = 'LEI3183');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT 'LRI3183', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = 'LRI3183');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '6031', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '6031');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT 'LH06-031', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = 'LH06-031');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT 'LHD6031', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = 'LHD6031');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '6079', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Ana Isabel Coca', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Ana Isabel Coca'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '6079');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '6097', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '6097');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT 'LHD6097', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = 'LHD6097');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '6126', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '6126');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '6197', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'ANA ISABEL COCA', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: ANA ISABEL COCA'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '6197');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '7012', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '7012');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '7026', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '7026');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '7105', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '7105');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT 'LGY7105', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = 'LGY7105');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT 'LGZ7105', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = 'LGZ7105');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '7108', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '7108');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT 'LGY7108', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Tello', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Tello'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = 'LGY7108');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '7153', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Peñaranda', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Peñaranda'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '7153');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT 'LEO7153', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Matersalud', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Matersalud'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = 'LEO7153');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT 'LFE7192', 8, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = 'LFE7192');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '8003', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '8003');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '8009', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '8009');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '8013', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '8013');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '8020', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '8020');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '8063', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '8063');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '8076', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '8076');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '8120', 8, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '8120');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '8122', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'ANA ISABEL COCA', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: ANA ISABEL COCA'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '8122');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '8125', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Raul Salvatierra', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Raul Salvatierra'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '8125');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '8126', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'DANIEL CUEVAS', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: DANIEL CUEVAS'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '8126');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '9010', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '9010');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '9014', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '9014');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '9029', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '9029');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '9039', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '9039');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '9057', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '9057');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '9061', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'DANIEL CUEVAS', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: DANIEL CUEVAS'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '9061');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '9079', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'ANA ISABEL COCA', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: ANA ISABEL COCA'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '9079');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '9089', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '9089');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '9116', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'DANIEL CUEVAS', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: DANIEL CUEVAS'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '9116');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '9117', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '9117');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '9120', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '9120');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '9127', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '9127');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '9152', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'ANA ISABEL COCA', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: ANA ISABEL COCA'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '9152');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '9179', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '9179');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '10011', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'ANA ISABEL COCA', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: ANA ISABEL COCA'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '10011');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '10013', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'ANA ISABEL COCA', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: ANA ISABEL COCA'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '10013');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '10032', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'ANA ISABEL COCA', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: ANA ISABEL COCA'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '10032');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '10051', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'DANIEL CUEVAS', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: DANIEL CUEVAS'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '10051');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '10075', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'DANIEL CUEVAS', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: DANIEL CUEVAS'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '10075');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '10088', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'ANA ISABEL COCA', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: ANA ISABEL COCA'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '10088');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '10091', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '10091');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '10095', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '10095');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '10098', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Daniel Cuevas', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Daniel Cuevas'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '10098');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT 'LE13-183', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Boris Rodriguez', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Boris Rodriguez'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = 'LE13-183');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '23618', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Eduardo Mena', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Eduardo Mena'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '23618');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '28977', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'PREFORTE S.A.', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PREFORTE S.A.'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '28977');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '37088', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '37088');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '55027', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '55027');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '65013', 0.5, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '65013');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '77445', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '77445');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '77466', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CLINICA SANTIAGO APOSTOL', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CLINICA SANTIAGO APOSTOL'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '77466');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '83523', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '83523');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '93295', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '93295');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '95013', 0.5, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Jose Pedro Suarez', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Jose Pedro Suarez'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '95013');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '95701', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Daniel Cuevas', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Daniel Cuevas'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '95701');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '95762', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '95762');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '105035', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Ana Isabel Coca', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Ana Isabel Coca'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '105035');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '107044', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '107044');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '115080', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '115080');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '115150', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '115150');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '115535', 1, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Ana Isabel Coca', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Ana Isabel Coca'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '115535');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '118137', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '118137');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '118193', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '118193');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '119112', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '119112');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '134093', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, '3H Industriales SRL', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: 3H Industriales SRL'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '134093');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '137037', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Eduardo Mena', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Eduardo Mena'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '137037');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '137107', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '137107');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '137112', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '137112');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '137291', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '137291');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '140025', 8, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '140025');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '147050', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '147050');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '207093', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'PREFORTE S.A.', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PREFORTE S.A.'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '207093');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '207547', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'FILADELFIA', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: FILADELFIA'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '207547');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT 'T2210B18', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = 'T2210B18');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '285073', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Gustavo Banegas', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Gustavo Banegas'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '285073');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '350147', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Javier Colque', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Javier Colque'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '350147');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '350269', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '350269');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '363265', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '363265');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '370608', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'SONIA VILLEGAS', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: SONIA VILLEGAS'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '370608');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '370808', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Centro Medico San Pedro', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Centro Medico San Pedro'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '370808');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '415536', 1, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '415536');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '436265', 8, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '436265');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '512257', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Centro Medico San Pedro', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Centro Medico San Pedro'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '512257');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '512537', 1, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Jose Pedro Suarez', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Jose Pedro Suarez'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '512537');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '532938', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Ana Isabel Coca', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Ana Isabel Coca'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '532938');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '547734', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Ana Isabel Coca', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Ana Isabel Coca'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '547734');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '570899', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '570899');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '624256', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Centro Medico San Pedro', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Centro Medico San Pedro'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '624256');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '628285', 7, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '628285');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '636265', 8, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'PREFORTE S.A.', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PREFORTE S.A.'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '636265');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '676265', 8, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '676265');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '6-77466', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '6-77466');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '681338', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Eduardo Mena', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Eduardo Mena'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '681338');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '696096', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'David Solano', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: David Solano'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '696096');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '857027', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '857027');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '907068', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '907068');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957000', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957000');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957001', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CLINICA MELEANMED', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CLINICA MELEANMED'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957001');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957002', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957002');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957003', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Cristo Redentor', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Cristo Redentor'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957003');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957004', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Matersalud', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Matersalud'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957004');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957005', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957005');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957006', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Aliviar', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Aliviar'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957006');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957007', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CLINICA CRISTIANA', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CLINICA CRISTIANA'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957007');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957008', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Nephrology', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Nephrology'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957008');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957009', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Santa Fe', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Santa Fe'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957009');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957010', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CLINICA BILBAO', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CLINICA BILBAO'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957010');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957012', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957012');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957013', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957013');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957014', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Cristo Redentor', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Cristo Redentor'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957014');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957015', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CLINICA MELEANMED', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CLINICA MELEANMED'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957015');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957016', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957016');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957017', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CLINICA SANTIAGO APOSTOL', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CLINICA SANTIAGO APOSTOL'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957017');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957018', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957018');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957019', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957019');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957020', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957020');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957021', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Aliviar', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Aliviar'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957021');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957022', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957022');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957023', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957023');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957024', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Aliviar', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Aliviar'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957024');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957025', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Cristo Redentor', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Cristo Redentor'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957025');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957026', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957026');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957027', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957027');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957028', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Cristo Redentor', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Cristo Redentor'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957028');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957029', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957029');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957030', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CLINICA SANTIAGO APOSTOL', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CLINICA SANTIAGO APOSTOL'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957030');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957031', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957031');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957032', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957032');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957033', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Cristo Redentor', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Cristo Redentor'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957033');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957034', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957034');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957035', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'ALEJANDRA DURAN', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: ALEJANDRA DURAN'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957035');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957036', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Ana Isabel Coca', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Ana Isabel Coca'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957036');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957037', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CLINICA MELEANMED', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CLINICA MELEANMED'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957037');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957038', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957038');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957039', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957039');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957040', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Centro Medico San Pedro', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Centro Medico San Pedro'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957040');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957041', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957041');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957042', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957042');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957043', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957043');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957044', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CLINICA SANTIAGO APOSTOL', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CLINICA SANTIAGO APOSTOL'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957044');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957045', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Aliviar', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Aliviar'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957045');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957046', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957046');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957047', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bethel', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bethel'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957047');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957048', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Centro Medico San Pedro', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Centro Medico San Pedro'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957048');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957049', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957049');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957050', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Cristiana', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Cristiana'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957050');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957051', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Cristo Redentor', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Cristo Redentor'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957051');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957052', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957052');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957053', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Centro Medico San Pedro', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Centro Medico San Pedro'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957053');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957054', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957054');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957055', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CLINICA MELEANMED', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CLINICA MELEANMED'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957055');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957056', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'HECTOR JUSTINIANO', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: HECTOR JUSTINIANO'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957056');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957057', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957057');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957058', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957058');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957059', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957059');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957060', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957060');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957061', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CLINICA SANTIAGO APOSTOL', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CLINICA SANTIAGO APOSTOL'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957061');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957062', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CLINICA BILBAO', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CLINICA BILBAO'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957062');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957063', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Peñaranda', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Peñaranda'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957063');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957064', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957064');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957065', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957065');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957066', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957066');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957067', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957067');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957068', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bethel', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bethel'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957068');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957069', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Cristo Redentor', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Cristo Redentor'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957069');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957070', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957070');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957071', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957071');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957072', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Abel Bohorquez', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Abel Bohorquez'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957072');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957073', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957073');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957074', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Cristo Redentor', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Cristo Redentor'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957074');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957075', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957075');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957076', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957076');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957077', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957077');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957078', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957078');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957079', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Cristo Redentor', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Cristo Redentor'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957079');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957080', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957080');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957081', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Peñaranda', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Peñaranda'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957081');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957082', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957082');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957083', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957083');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957084', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957084');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957085', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957085');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957086', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957086');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957087', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957087');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957089', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Santa Fe', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Santa Fe'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957089');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957090', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Peñaranda', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Peñaranda'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957090');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957091', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957091');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957092', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957092');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957093', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957093');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957094', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957094');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957095', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957095');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957096', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957096');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957097', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Nephrology', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Nephrology'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957097');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957098', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957098');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957099', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CLINICA CRISTIANA', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CLINICA CRISTIANA'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957099');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957100', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Peñaranda', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Peñaranda'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957100');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957101', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957101');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957102', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Santa Fe', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Santa Fe'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957102');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957103', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957103');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957104', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Centro Medico San Pedro', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Centro Medico San Pedro'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957104');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957105', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Peñaranda', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Peñaranda'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957105');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957106', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957106');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957107', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Cristiana', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Cristiana'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957107');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957108', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957108');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957109', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957109');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957110', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957110');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957111', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957111');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957112', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Santa Fe', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Santa Fe'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957112');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957113', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Cristo Redentor', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Cristo Redentor'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957113');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957114', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957114');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957115', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Santa Fe', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Santa Fe'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957115');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957116', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Santa Fe', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Santa Fe'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957116');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957117', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bethel', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bethel'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957117');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957118', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957118');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957119', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957119');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957120', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CLINICA BILBAO', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CLINICA BILBAO'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957120');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957121', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957121');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957122', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Peñaranda', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Peñaranda'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957122');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957123', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957123');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957124', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957124');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957125', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Cristo Redentor', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Cristo Redentor'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957125');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957126', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Peñaranda', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Peñaranda'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957126');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957127', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Cristo Redentor', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Cristo Redentor'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957127');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957128', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957128');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957129', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957129');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957130', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica MELEANMED', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica MELEANMED'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957130');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957131', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Peñaranda', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Peñaranda'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957131');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957132', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CLINICA BILBAO', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CLINICA BILBAO'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957132');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957133', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957133');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957135', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957135');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957136', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Cristo Redentor', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Cristo Redentor'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957136');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957137', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957137');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957138', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Santa Fe', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Santa Fe'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957138');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957139', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957139');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957141', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957141');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957142', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Manantial de Vida', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Manantial de Vida'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957142');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957143', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bethel', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bethel'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957143');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957144', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CLINICA CRISTIANA', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CLINICA CRISTIANA'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957144');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957145', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957145');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957146', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Centro Medico San Pedro', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Centro Medico San Pedro'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957146');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957147', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CLINICA APOSTOL SANTIAGO', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CLINICA APOSTOL SANTIAGO'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957147');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957148', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Nephrology', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Nephrology'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957148');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957149', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Santa Fe', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Santa Fe'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957149');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957150', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957150');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957165', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Ana Isabel Coca', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Ana Isabel Coca'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957165');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '957518', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Nephrology', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Nephrology'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '957518');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969010', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'SONIA VILLEGAS', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: SONIA VILLEGAS'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969010');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969052', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969052');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969082', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Cristiana', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Cristiana'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969082');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969083', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969083');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969086', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969086');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969087', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Cristiana', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Cristiana'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969087');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969088', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Cristiana', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Cristiana'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969088');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969089', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Abel Bohorquez', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Abel Bohorquez'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969089');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969090', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Cristiana', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Cristiana'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969090');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969092', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'SONIA VILLEGAS', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: SONIA VILLEGAS'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969092');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969094', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'SONIA VILLEGAS', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: SONIA VILLEGAS'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969094');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969096', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969096');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969097', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969097');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969098', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, '3H Industriales SRL', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: 3H Industriales SRL'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969098');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969099', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CHARLY ROJAS', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CHARLY ROJAS'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969099');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969102', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969102');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969104', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Cristiana', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Cristiana'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969104');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969110', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CESAR AUGUSTO VILLEGAS', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CESAR AUGUSTO VILLEGAS'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969110');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969111', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'SONIA VILLEGAS', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: SONIA VILLEGAS'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969111');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969113', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969113');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969115', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Cristiana', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Cristiana'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969115');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969119', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969119');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969120', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CESAR AUGUSTO VILLEGAS', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CESAR AUGUSTO VILLEGAS'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969120');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969121', 25, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Vital Medic Curve', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Vital Medic Curve'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969121');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969122', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CESAR AUGUSTO VILLEGAS', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CESAR AUGUSTO VILLEGAS'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969122');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969124', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Abel Bohorquez', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Abel Bohorquez'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969124');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '969129', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, '3H Industriales SRL', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: 3H Industriales SRL'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '969129');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '987687', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'DANIEL CUEVAS', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: DANIEL CUEVAS'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '987687');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1106884', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bethel', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bethel'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1106884');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1141025', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1141025');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1143142', 8, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1143142');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1180022', 25, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Aliviar', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Aliviar'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1180022');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1220735', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Cristo Redentor', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Cristo Redentor'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1220735');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1258132', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1258132');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1258545', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1258545');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1258546', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1258546');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1268111', 8, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'PREFORTE S.A.', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PREFORTE S.A.'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1268111');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1288451', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Nephrology', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Nephrology'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1288451');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1288540', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Javier Colque', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Javier Colque'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1288540');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1419127', 8, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1419127');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1470501', 8, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1470501');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1477385', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Eduardo Mena', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Eduardo Mena'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1477385');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1522730', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1522730');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1522738', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Hector Justiniano', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Hector Justiniano'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1522738');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1522863', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1522863');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1948082', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'PREFORTE S.A.', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PREFORTE S.A.'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1948082');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1949011', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Ana Isabel Coca', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Ana Isabel Coca'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1949011');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '1949057', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Eduardo Mena', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Eduardo Mena'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '1949057');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '5473038', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '5473038');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '6596853', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Willy Arancibia', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Willy Arancibia'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '6596853');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '6858025', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '6858025');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '9570089', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Peñaranda', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Peñaranda'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '9570089');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '9570202', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Daniel Cuevas', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Daniel Cuevas'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '9570202');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '9574045', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '9574045');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '9957075', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Ana Isabel Coca', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Ana Isabel Coca'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '9957075');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '10374076', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, '3H Industriales SRL', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: 3H Industriales SRL'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '10374076');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '11181310', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '11181310');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '14024012', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '14024012');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '14040062', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '14040062');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '15008069', 8, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '15008069');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '15008083', 8, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '15008083');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '15008142', 8, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '15008142');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '15227730', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '15227730');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '18004020', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '18004020');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '18304020', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '18304020');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '22705701', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Peñaranda', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Peñaranda'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '22705701');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '27106097', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '27106097');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '61062195', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Ana Isabel Coca', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Ana Isabel Coca'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '61062195');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '111546468', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '111546468');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '150088142', 8, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '150088142');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '181969013', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Centro Medico San Pedro', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Centro Medico San Pedro'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '181969013');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '181989013', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'JAVIER COLQUE', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: JAVIER COLQUE'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '181989013');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '183004020', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CLINICA SANTIAGO APOSTOL', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CLINICA SANTIAGO APOSTOL'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '183004020');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '207547012', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '207547012');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '207547368', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Hector Justiniano', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Hector Justiniano'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '207547368');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '207547428', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '207547428');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '242802088', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Carmelo Montalvan', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Carmelo Montalvan'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '242802088');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '292802088', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '292802088');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2045474028', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2045474028');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075449137', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075449137');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075471496', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Ana Isabel Coca', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Ana Isabel Coca'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075471496');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075472007', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075472007');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075472030', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075472030');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075472038', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075472038');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075472043', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CHATARRERIA EL PAQUE', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CHATARRERIA EL PAQUE'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075472043');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075472053', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075472053');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075472069', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'FILADELFIA', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: FILADELFIA'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075472069');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075472072', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075472072');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075472082', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075472082');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075472123', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075472123');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075472127', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Bartimeo', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Bartimeo'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075472127');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075472128', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075472128');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075472140', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'PREFORTE S.A.', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PREFORTE S.A.'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075472140');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075472145', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075472145');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075472177', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Manantial de Vida', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Manantial de Vida'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075472177');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075473028', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Claudia Zapata', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Claudia Zapata'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075473028');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075473035', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075473035');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075473038', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'CHATARRERIA EL PAQUE', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: CHATARRERIA EL PAQUE'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075473038');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075473055', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075473055');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075473068', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Matersalud', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Matersalud'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075473068');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075473116', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075473116');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075473149', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Artes', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Artes'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075473149');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075473160', 8, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075473160');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075473173', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075473173');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075474012', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075474012');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075474028', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075474028');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075474032', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075474032');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075474055', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075474055');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075474057', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'FILADELFIA', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: FILADELFIA'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075474057');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075474112', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'GAMET', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: GAMET'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075474112');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2075474720', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Planta'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2075474720');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '2270570185', 25, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Clinica Peñaranda', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Clinica Peñaranda'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '2270570185');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '20275472053', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'PREFORTE S.A.', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PREFORTE S.A.'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '20275472053');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '20751472072', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PLANTA', (SELECT id FROM warehouses WHERE code = 'PLANTA'), NULL, CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: PLANTA OXIPUR'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '20751472072');
INSERT INTO cylinders (serial_number, capacity_m3, owner, price, active, status, owner_type, created_at, updated_at, current_location_type, current_warehouse_id, current_customer_name, location_date, location_observation)
SELECT '20754730368', 6, 'Oxipur', NULL, TRUE, 'AVAILABLE', 'COMPANY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'CLIENTE', NULL, 'Hector Justiniano', CURRENT_DATE, 'Importado desde planilla de control de cilindros. Destino original: Hector Justiniano'
WHERE NOT EXISTS (SELECT 1 FROM cylinders WHERE serial_number = '20754730368');
