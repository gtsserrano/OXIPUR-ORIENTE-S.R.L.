# Migraciones

Las migraciones ejecutables estan dentro del classpath del backend para que tambien funcionen al
empaquetar la aplicacion:

- `backend/src/main/resources/db/changelog/db.changelog-master.yml`
- `backend/src/main/resources/db/changelog/027_import_historical_sales_notes.sql`

Los cambios `026-normalize-customers-and-sales-note-amounts` y
`027-import-historical-sales-note-details-20260721` crean las relaciones de clientes, montos, filas de
detalle y trazabilidad del archivo historico.

No se mantienen copias ejecutables en esta carpeta porque dos versiones de una misma migracion podrian
desincronizar el codigo y MySQL. `../schema.sql` crea la base y `../tables/` contiene una definicion SQL
independiente para cada tabla del resultado final.
