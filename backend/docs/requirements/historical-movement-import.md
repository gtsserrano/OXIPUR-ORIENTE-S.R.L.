# Migracion de registros historicos

Este documento describe como preparar scripts para migrar registros en papel previos al uso operativo del sistema.

## Principio

Los registros historicos se cargan como movimientos normales.
No existe un movimiento especial para migracion historica.

## Movimientos permitidos

- `PLANTA_A_CLIENTE`
- `CLIENTE_A_PLANTA`

## Datos esperados

- Catalogos base: productos, unidades y el unico almacen `PLANTA`.
- Cilindros reales identificados por `serial_number`.
- Movimiento historico con `movement_date`.
- Ubicacion origen y destino.
- Cliente cuando el movimiento involucra cliente.
- Observacion opcional.

## Idempotencia

Los scripts deben poder ejecutarse mas de una vez cuando sea razonable:

- No insertar cilindros duplicados; usar `serial_number`.
- No insertar productos duplicados; usar `code`.
- No insertar el almacen `PLANTA` mas de una vez; usar `code`.
- Para MySQL, preferir `INSERT ... ON DUPLICATE KEY UPDATE` cuando aplique.
- Para otros motores, usar una estrategia equivalente.

## Trazabilidad

Los scripts historicos deben documentar:

- Archivo ejecutado.
- Periodo historico cubierto.
- Datos que carga.
- Validaciones realizadas.
- Si puede ejecutarse mas de una vez.

## Importacion del detalle de movimientos del 21 de julio de 2026

Fuente: `oxipur_detallemovimientos_2026-07-21 (2).xlsx`, hoja `DetalleMovimientos`.

La migracion `027-import-historical-sales-note-details-20260721` carga el archivo transformado
`027_historical_sales_note_rows_20260721.csv` solamente cuando el motor es MySQL. La carga no se ejecuta en H2 ni PostgreSQL.

Resumen validado:

- 9.045 filas de detalle.
- 6.761 notas de venta.
- 5.678 cilindros entregados.
- 3.367 cilindros recibidos vacios.
- 108 notas contienen simultaneamente entregas y recepciones.
- 2.032 numeros de serie distintos.
- 5 claves repetidas de nota, cilindro y estado se conservan como filas independientes porque existen asi en la fuente.

Reglas de transformacion:

- `Boleta` se convierte en la cabecera de `sales_notes`.
- Cada fila `Entregado` crea un detalle en `sales_note_delivered_cylinders` y un movimiento `PLANTA_A_CLIENTE`.
- Cada fila `Recibido` crea un detalle en `sales_note_collected_cylinders` y un movimiento `CLIENTE_A_PLANTA`.
- `Monto (BOB)` se conserva por cilindro entregado y la suma forma `sales_notes.total_amount`.
- La utilidad historica queda en cero porque el archivo no contiene el costo necesario para calcularla.
- `source_row_number` conserva la fila original y hace que la carga sea idempotente.
- Cuando `Cliente Nota` esta vacio se usa el cliente de las filas de la nota; si aparecen `OXIPUR` y otro cliente, se prioriza el otro cliente.
- Los productos y cilindros inexistentes se crean antes de cargar los detalles.
- La ubicacion actual de cada cilindro se reconstruye usando su movimiento mas reciente, sin desplazar movimientos posteriores ya registrados por el sistema.

Correccion documentada:

- La nota `NV-006521` contiene 12 filas con la fecha imposible `10/02/0304 12:30`.
- Por la secuencia `NV-006520` del 22/04/2026 y las notas `NV-006522` a `NV-006527` del 23 y 24/04/2026, se importa como `23/04/2026 12:29`.
- El texto original permanece en `sales_notes.source_date_text` para auditoria.
- La nota `NV-000003` del 03/01/2003 se conserva sin modificar porque es una fecha valida, aunque antigua.

Validacion en MySQL Workbench:

```sql
SELECT COUNT(*) FROM sales_notes
WHERE source_reference = 'oxipur_detallemovimientos_2026-07-21 (2).xlsx';

SELECT COUNT(*) FROM sales_note_delivered_cylinders d
JOIN sales_notes n ON n.id = d.sales_note_id
WHERE n.source_reference = 'oxipur_detallemovimientos_2026-07-21 (2).xlsx';

SELECT COUNT(*) FROM sales_note_collected_cylinders c
JOIN sales_notes n ON n.id = c.sales_note_id
WHERE n.source_reference = 'oxipur_detallemovimientos_2026-07-21 (2).xlsx';

SELECT n.note_number, COUNT(DISTINCT d.id) AS entregados, COUNT(DISTINCT c.id) AS recibidos
FROM sales_notes n
LEFT JOIN sales_note_delivered_cylinders d ON d.sales_note_id = n.id
LEFT JOIN sales_note_collected_cylinders c ON c.sales_note_id = n.id
WHERE n.note_number = 'NV-006775'
GROUP BY n.id, n.note_number;
```
