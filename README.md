# OXIPUR Oriente SRL

Plataforma web para gestion de inventario.

## Estructura

```text
backend/
  database/
frontend/
```

La carpeta `backend/database/` contiene la fotografia SQL del esquema y el catalogo de tablas para MySQL
Workbench. Las migraciones ejecutables de la aplicacion permanecen integradas en el backend mediante
Liquibase.

El backend esta construido con Spring Boot como monolito modular. La aplicacion operativa debe iniciarse
con el perfil MySQL para leer y actualizar la misma base visible en MySQL Workbench:

```powershell
.\backend\start-mysql.ps1
```

En otra terminal inicia la interfaz:

```powershell
cd frontend
npm.cmd run dev
```

El arranque sin perfil usa una base H2 temporal y se reserva para pruebas; sus datos desaparecen al
detener el backend y no corresponden a `oxipur_inventory`.
