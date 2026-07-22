# Catalogo de tablas

| Tabla | Responsabilidad |
| --- | --- |
| `user_profiles` | Usuarios, credenciales, rol y actividad. |
| `audit_logs` | Auditoria de creaciones, cambios, anulaciones y eliminaciones. |
| `customers` | Catalogo normalizado de clientes. |
| `customer_aliases` | Nombres historicos que apuntan al cliente canonico y evitan nuevos duplicados. |
| `sales_notes` | Cabecera de la nota de venta, cliente, fecha, estado y totales. |
| `sales_note_delivered_cylinders` | Cilindros llenos entregados en una nota, producto y monto. |
| `sales_note_collected_cylinders` | Cilindros vacios recibidos dentro de una nota. |
| `inventory_movements` | Trazabilidad de cada cilindro entregado o recibido. |
| `cylinders` | Maestro de cilindros y su ubicacion actual. |
| `products` | Tipos de gases/productos. |
| `warehouses` | Almacenes y planta. |

## Usuarios

La definicion SQL individual se encuentra en `tables/user_profiles.sql`. Los datos recibidos al crear
un usuario se guardan de esta manera:

| Dato del formulario | Columna | Regla |
| --- | --- | --- |
| Nombre completo | `full_name` | Obligatorio, hasta 160 caracteres. |
| Usuario | `username` | Unico, entre 3 y 80 caracteres. |
| Contrasena | `password_hash` | Se almacena como hash BCrypt, nunca en texto plano. |
| Rol | `role_name` | `ADMINISTRADOR` u `OPERADOR`. |
| Activo | `active` | Activo por defecto. |

El sistema completa automaticamente `id`, `last_activity_at`, `online_until`, `created_at` y
`updated_at`.

## Auditoria

`audit_logs` conserva el usuario responsable, entidad afectada, accion, datos anteriores y nuevos,
origen, ruta HTTP, direccion IP y fecha. No expone operaciones de modificacion o eliminacion y su API
de consulta esta restringida al rol `ADMINISTRADOR`.

## Relaciones del detalle de una nota

```text
customers
    1
    |
    +---- N customer_aliases
    |
    N
sales_notes
    |-------------------------------|
    1                               1
    |                               |
    N                               N
sales_note_delivered_cylinders   sales_note_collected_cylinders
    |                               |
    |                               |
    +------------ cylinders --------+
                    |
                    N
                    |
            inventory_movements
```

Una misma fila de `sales_notes` puede tener simultaneamente cilindros entregados y cilindros vacios
recibidos. `source_row_number` conserva la fila original del archivo historico y evita que una
reimportacion duplique movimientos.
