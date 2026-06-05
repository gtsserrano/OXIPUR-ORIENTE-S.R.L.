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
Para ejecutar la aplicacion:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

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
$env:MYSQL_URL="jdbc:mysql://localhost:3306/oxipur_inventory?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:MYSQL_USER="root"
$env:MYSQL_PASSWORD="tu_password"
```
