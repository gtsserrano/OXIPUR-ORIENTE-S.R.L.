-- Unifica los clientes confirmados por el propietario del sistema el 2026-07-22.
-- Los nombres anteriores se conservan como alias y los registros duplicados se desactivan.

DROP TABLE IF EXISTS customer_merge_map_20260722;

CREATE TABLE customer_merge_map_20260722 (
    canonical_name VARCHAR(160) NOT NULL,
    alias_name VARCHAR(160) NOT NULL,
    PRIMARY KEY (alias_name)
) ENGINE=InnoDB;

-- SALUR no tenia una fila con el nombre canonico exacto elegido.
UPDATE customers
SET name = 'SALUR SRL', normalized_name = 'SALUR SRL', updated_at = CURRENT_TIMESTAMP
WHERE normalized_name = 'SALUR S.R.L.';

INSERT INTO customer_merge_map_20260722 (canonical_name, alias_name) VALUES
('3H INDUSTRIALES', '31T INDUSTRIALES'),
('3H INDUSTRIALES', '3H INDUSTRIALES'),
('3H INDUSTRIALES', '3H INDUSTRIALES SRL'),
('ABRAHAM ANIVARRO', 'ABRAHAM ANIBARRO'),
('ABRAHAM ANIVARRO', 'ABRAHAM ANIVARO'),
('ABRAHAM ANIVARRO', 'ABRAHAM ANIVARRO'),
('ANSELMO BOHEM', 'ANSELMO BOHEM'),
('ANSELMO BOHEM', 'ANSELMO BOHEN'),
('CHATARRERIA EL PARQUE', 'CHATARERIA EL PARQUE'),
('CHATARRERIA EL PARQUE', 'CHATARREIA EL PARQUE'),
('CHATARRERIA EL PARQUE', 'CHATARRERIA "EL PARQUE"'),
('CHATARRERIA EL PARQUE', 'CHATARRERIA EL PAQUE'),
('CHATARRERIA EL PARQUE', 'CHATARRERIA EL PARQUE'),
('SANTIAGO APOSTOL', 'APOSTOL SANTIAGO'),
('SANTIAGO APOSTOL', 'CLINICA APOSTOL SANTIAGO'),
('SANTIAGO APOSTOL', 'CLINICA SANTIAGO APOSTOL'),
('SANTIAGO APOSTOL', 'SANTIAGO APOSTOL'),
('CLINICA BETHEL', 'BETHEL'),
('CLINICA BETHEL', 'CLINICA BETHEL'),
('CLINICA BILBAO', 'CLINICA BILBAO'),
('CLINICA BILBAO', 'CLINICA BILVAO'),
('CLINICA MATERSALUD', 'CLINICA MATERSALUD'),
('CLINICA MATERSALUD', 'CLINICA MATRSALUD'),
('CLINICA MELEANMED', 'CLINICA MELEANMED'),
('CLINICA MELEANMED', 'MELEANMED'),
('CLINICA TELLO', 'CLINICA TELLO'),
('CLINICA TELLO', 'CLÍNICA TELLP'),
('EDSON GUZMAN', 'EDSON GUZMAN'),
('EDSON GUZMAN', 'EDZON GUZMAN'),
('GAMET', 'G.A.M.E.T.'),
('GAMET', 'GAMET'),
('GOBIERNO AUTONOMO MUNICIPAL DE CABEZAS', 'GOBIERNO AUTONOMO MUNICIPAL CABEZAS'),
('GOBIERNO AUTONOMO MUNICIPAL DE CABEZAS', 'GOBIERNO AUTONOMO MUNICIPAL DE CABEZAS'),
('PREFORTE', 'PREFORTE'),
('PREFORTE', 'PREFORTE S.A.'),
('SALUR SRL', 'SALUR S.R.L'),
('SALUR SRL', 'SALUR S.R.L.'),
('SALUR SRL', 'SALUR SRL'),
('SEBASTIAN ABDALA', 'SEBASTIAN ABDALA'),
('SEBASTIAN ABDALA', 'SEBASTIAN ABTALA'),
('YPFB TRANSIERRA', 'YPFB TRANSIERRA'),
('YPFB TRANSIERRA', 'YPFB TRANSIERRA S.A.'),
('NEPHROLOGY', 'NEPHROLOGY'),
('NEPHROLOGY', 'NEPHROLOGY 17 1/2'),
('NEPHROLOGY', 'NEPHROLOGY 17/2'),
('CLINICA BARTIMEO', 'BARTIMEO'),
('CLINICA BARTIMEO', 'CLINICA BARTIMEO'),
('CLINICA BARTIMEO', 'CLINICA BARTIMEO (SAN JOSE)'),
('TECNA BOLIVIA', 'TECNA'),
('TECNA BOLIVIA', 'TECNA BOLIVIA'),
('TECNA BOLIVIA', 'TECNO BOLIVIA S.A.'),
('TECNA BOLIVIA', 'TEENA BOLIVIA'),
('ALEJANDRA DURAN', 'ALEJANDRA DURAN'),
('ALEJANDRA DURAN', 'ALEJANDRO DURAN'),
('CESAR VILLEGAS', 'CESAR AUGUSTO VILLEGAS'),
('CESAR VILLEGAS', 'CESAR VILLEGAS'),
('CENTRO MEDICO SAN PEDRO', 'CENTRO MEDICO SAN PEDRO'),
('CENTRO MEDICO SAN PEDRO', 'CLÍNICA SAN PEDRO'),
('VITAL MEDIC CURVE', 'VITAL MEDIC'),
('VITAL MEDIC CURVE', 'VITAL MEDIC CURVE'),
('CLINICA CRISTO REDENTOR', 'CLINICA CRISTO REDENTOR'),
('CLINICA CRISTO REDENTOR', 'FLAVIO FLORE (CRISTO REDENTOR)'),
('ISRAEL RODRIGUEZ', 'ISABEL RODRIGUEZ'),
('ISRAEL RODRIGUEZ', 'ISRAEL RODRIGUEZ');

INSERT INTO customer_aliases (
    customer_id, alias_name, normalized_alias, source_type, created_at)
SELECT canonical.id, merge_map.alias_name, merge_map.alias_name, 'MERGE', CURRENT_TIMESTAMP
FROM customer_merge_map_20260722 merge_map
JOIN customers canonical ON canonical.normalized_name = merge_map.canonical_name;

INSERT INTO audit_logs (
    entity_type, entity_id, action, previous_data, new_data, source_type, created_at)
SELECT
    'CUSTOMER',
    CAST(canonical.id AS CHAR),
    'MERGE',
    CAST(JSON_OBJECT('mergedCustomerId', duplicate.id, 'mergedCustomerName', duplicate.name) AS CHAR),
    CAST(JSON_OBJECT('canonicalCustomerId', canonical.id, 'canonicalCustomerName', canonical.name) AS CHAR),
    'SYSTEM',
    CURRENT_TIMESTAMP
FROM customers duplicate
JOIN customer_merge_map_20260722 merge_map
    ON duplicate.normalized_name = merge_map.alias_name
JOIN customers canonical
    ON canonical.normalized_name = merge_map.canonical_name
WHERE duplicate.id <> canonical.id;

UPDATE sales_notes note
JOIN customers duplicate ON duplicate.id = note.customer_id
JOIN customer_merge_map_20260722 merge_map ON duplicate.normalized_name = merge_map.alias_name
JOIN customers canonical ON canonical.normalized_name = merge_map.canonical_name
SET note.customer_id = canonical.id,
    note.customer_name = canonical.name,
    note.updated_at = CURRENT_TIMESTAMP;

UPDATE cylinders cylinder
JOIN customer_merge_map_20260722 merge_map
    ON UPPER(TRIM(cylinder.current_customer_name)) = merge_map.alias_name
SET cylinder.current_customer_name = merge_map.canonical_name,
    cylinder.updated_at = CURRENT_TIMESTAMP
WHERE cylinder.current_customer_name IS NOT NULL;

UPDATE inventory_movements movement
JOIN customer_merge_map_20260722 merge_map
    ON UPPER(TRIM(movement.origin_customer_name)) = merge_map.alias_name
SET movement.origin_customer_name = merge_map.canonical_name,
    movement.updated_at = CURRENT_TIMESTAMP
WHERE movement.origin_customer_name IS NOT NULL;

UPDATE inventory_movements movement
JOIN customer_merge_map_20260722 merge_map
    ON UPPER(TRIM(movement.destination_customer_name)) = merge_map.alias_name
SET movement.destination_customer_name = merge_map.canonical_name,
    movement.updated_at = CURRENT_TIMESTAMP
WHERE movement.destination_customer_name IS NOT NULL;

UPDATE sales_note_collected_cylinders collected
JOIN customer_merge_map_20260722 merge_map
    ON UPPER(TRIM(collected.origin_customer_name)) = merge_map.alias_name
SET collected.origin_customer_name = merge_map.canonical_name
WHERE collected.origin_customer_name IS NOT NULL;

UPDATE customers duplicate
JOIN customer_merge_map_20260722 merge_map ON duplicate.normalized_name = merge_map.alias_name
JOIN customers canonical ON canonical.normalized_name = merge_map.canonical_name
SET duplicate.active = FALSE,
    duplicate.merged_into_customer_id = canonical.id,
    duplicate.merged_at = CURRENT_TIMESTAMP,
    duplicate.updated_at = CURRENT_TIMESTAMP
WHERE duplicate.id <> canonical.id;

UPDATE customers canonical
JOIN (SELECT DISTINCT canonical_name FROM customer_merge_map_20260722) selected
    ON canonical.normalized_name = selected.canonical_name
SET canonical.active = TRUE,
    canonical.merged_into_customer_id = NULL,
    canonical.merged_at = NULL,
    canonical.updated_at = CURRENT_TIMESTAMP;

DROP TABLE customer_merge_map_20260722;
