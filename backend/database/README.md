# Base de datos de OXIPUR Oriente SRL

Esta carpeta `backend/database` muestra el modelo MySQL utilizado por el sistema.

## Archivos

- `schema.sql`: crea y selecciona la base `oxipur_inventory`.
- `tables.md`: catalogo de tablas y relaciones principales.
- `tables/`: contiene un archivo SQL independiente para cada tabla.
- `queries/verify_historical_import.sql`: comprueba los totales importados y muestra el detalle de una nota.
- `migrations/README.md`: ubicacion y orden de las migraciones que aplica el backend.
- `seeders/README.md`: ubicacion y resumen de la precarga historica.
- `backups/`: respaldos locales de seguridad; los archivos `.sql` no se incluyen en Git porque
  contienen informacion operativa sensible.

La fuente de verdad para bases existentes son las migraciones Liquibase de
`backend/src/main/resources/db/changelog/db.changelog-master.yml`. Al iniciar el backend con el perfil
`mysql`, Liquibase crea o actualiza estas mismas tablas y registra cada cambio en
`DATABASECHANGELOG`.

La precarga historica se encuentra en:

- `backend/src/main/resources/db/changelog/027_import_historical_sales_notes.sql`
- `backend/src/main/resources/db/changelog/data/027_historical_sales_note_rows_20260721.csv`
- `backend/src/main/resources/db/changelog/031_merge_duplicate_customers.sql`

## Uso recomendado con MySQL Workbench y el backend

1. Crea solamente la base vacia ejecutando `schema.sql`.
2. Configura `MYSQL_USER` y `MYSQL_PASSWORD` para el backend.
3. Inicia el backend con el perfil `mysql`.
4. Liquibase crea las tablas, aplica las relaciones, carga los datos iniciales e importa el historico.

No ejecutes manualmente los archivos de `tables/` ni `seeders/` antes de Liquibase. Esos archivos son
una referencia separada del esquema para inspeccion y recuperacion manual; ejecutarlos previamente
provocaria que Liquibase intentara crear tablas que ya existen.

Para una base existente, no ejecutes `schema.sql`: inicia directamente el backend con Liquibase.
