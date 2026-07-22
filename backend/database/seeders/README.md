# Precarga historica

La precarga del Excel del 21/07/2026 es aplicada una sola vez por Liquibase.

`main_warehouse.sql` crea el registro inicial de `PLANTA` requerido por las relaciones de inventario.

- CSV transformado: `backend/src/main/resources/db/changelog/data/027_historical_sales_note_rows_20260721.csv`
- Importador MySQL: `backend/src/main/resources/db/changelog/027_import_historical_sales_notes.sql`

Contenido validado:

- 9.045 movimientos.
- 6.761 notas de venta.
- 5.678 cilindros entregados.
- 3.367 cilindros vacios recibidos.
- 108 notas con movimientos entregados y recibidos simultaneamente.
