# OXIPUR Oriente Inventory Platform

Sistema web de gestion de inventario construido como monolito modular con Spring Boot.

## Stack inicial

- Java 21
- Spring Boot 4.0.6
- Maven
- Spring MVC
- Spring Data JPA
- Liquibase
- MySQL para desarrollo con MySQL Workbench
- PostgreSQL disponible si mas adelante se necesita
- H2 para desarrollo local rapido

## Estructura principal

```text
src/main/java/bo/com/oxipuroriente/inventory
  modules/
    inventario/
    productos/
    almacenes/
    compras/
    ventas/
    usuarios/
  shared/
src/main/resources/
database/
docs/
infra/
tests/
```

Cada modulo se organiza en:

- `domain`: entidades, value objects y reglas del negocio.
- `application`: casos de uso y servicios de aplicacion.
- `infrastructure`: persistencia, integraciones y adaptadores tecnicos.
- `presentation`: controladores REST, DTOs y entrada/salida web.

## Ubicacion

Este backend vive dentro de la carpeta `backend` del proyecto.

## Arranque

El proyecto incluye Maven Wrapper, por lo que solo necesitas Java instalado.
Para ejecutar la aplicacion operativa contra la base MySQL configurada en el archivo `.env` del proyecto:

```powershell
.\start-mysql.ps1
```

El comando `mvnw spring-boot:run` sin el perfil `mysql` utiliza H2 en memoria y se reserva para pruebas.

Endpoint de prueba:

```text
GET http://localhost:8080/api/status
```

## MySQL Workbench

MySQL Workbench se usa para conectarse al servidor MySQL, ejecutar scripts y revisar tablas.
El backend se conecta al mismo servidor usando el perfil `mysql`.

Configuracion local sugerida:

```text
Host: localhost
Port: 3306
Database: oxipur_inventory
User: root
Password: tu password local
```

Para ejecutar el backend contra MySQL:

```powershell
cd backend
$env:MYSQL_PASSWORD="tu_password"
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=mysql
```

Tambien puedes personalizar toda la conexion:

```powershell
$env:MYSQL_URL="jdbc:mysql://localhost:3306/oxipur_inventory?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=America/La_Paz"
$env:MYSQL_USER="root"
$env:MYSQL_PASSWORD="tu_password"
```

Al iniciar con el perfil `mysql`, Liquibase crea o actualiza las mismas tablas que se observan en MySQL Workbench. La migracion historica de notas del 21/07/2026 se ejecuta una sola vez y deja su registro en `DATABASECHANGELOG`.

Tablas principales del flujo:

- `user_profiles`: usuarios y acceso.
- `customers`: catalogo normalizado de clientes.
- `sales_notes`: cabecera de cada nota de venta.
- `sales_note_delivered_cylinders`: cilindros entregados y monto por linea.
- `sales_note_collected_cylinders`: cilindros recibidos vacios.
- `inventory_movements`: trazabilidad de cada entrada y salida.
- `audit_logs`: historial inmutable de acciones sensibles, visible solo para administradores.

La auditoria se consulta mediante `GET /api/audit-logs`. Permite filtrar por `entityType` y
`entityId`, y devuelve resultados paginados con un maximo de 200 registros por pagina.
