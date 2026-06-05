# Arquitectura de monolito modular

La aplicacion vive en un solo proceso Spring Boot, pero el codigo se separa por capacidades de negocio.

## Modulos iniciales

- `inventario`: stock, movimientos, ajustes y kardex.
- `productos`: catalogo, unidades, categorias y codigos.
- `almacenes`: almacenes, ubicaciones y responsables.
- `compras`: proveedores, ordenes de compra e ingresos.
- `ventas`: clientes, pedidos y salidas.
- `usuarios`: usuarios, roles y permisos.

## Reglas de dependencia

- Un modulo no debe acceder directamente a la infraestructura interna de otro modulo.
- Las reglas de negocio viven en `domain`.
- Los casos de uso coordinan el flujo en `application`.
- Los controladores y DTOs viven en `presentation`.
- Repositorios, JPA, clientes externos y detalles tecnicos viven en `infrastructure`.
- Codigo comun y transversal vive en `shared`.

## Base tecnica

El proyecto usa la estructura estandar de Spring Boot bajo `src/main/java` y `src/main/resources`.
Las carpetas de alto nivel `database`, `infra`, `docs`, `scripts` y `storage` quedan para soporte operativo del proyecto.

## Reglas de negocio acordadas

- El cilindro es el envase fisico. Puede pertenecer a OXIPUR Oriente SRL o a un cliente.
- El cilindro no se compra ni se vende como producto comercial dentro del flujo de ventas.
- El precio del cilindro representa valor interno del activo fisico, no precio de venta.
- Ese valor interno puede ser desconocido, por lo que no debe ser obligatorio al registrar cilindros.
- El producto es el contenido comercial del cilindro y es lo que se comercializa.
- Productos iniciales esperados: oxigeno medicinal, oxigeno industrial, nitrogeno, aire comprimido y CO2.
- El MVP maneja un unico almacen operativo: `PLANTA`.
- La tabla de almacenes se mantiene para ordenar el modelo y permitir cargar `PLANTA`, no para modelar multiples plantas en esta etapa.

## Migracion de registros historicos

- La empresa puede tener registros en papel previos al inicio operativo del sistema.
- Esos registros historicos deben migrarse como movimientos normales, con sus fechas reales.
- No existe un tipo especial para migracion historica.
- Los scripts historicos deben actualizar la ubicacion actual del cilindro igual que lo haria la API.
- Las migraciones estructurales crean tablas y columnas.
- Los scripts historicos insertan datos operativos reales y deben documentarse aparte.
- Los datos reales no deben quedar quemados en codigo Java.
- Los scripts deben ser idempotentes cuando sea posible.
- `serial_number` identifica de forma unica a cada cilindro para evitar duplicados.
- Los scripts deben evitar duplicar productos, unidades y el unico almacen `PLANTA`.
- Los movimientos operativos son `PLANTA_A_CLIENTE` y `CLIENTE_A_PLANTA`.
