# Despliegue de producción

La aplicación se ejecuta en cuatro contenedores:

- `mysql`: base de datos MySQL 8.4 con volumen persistente.
- `backend`: API Spring Boot con Liquibase.
- `frontend`: interfaz React compilada y servida por Nginx.
- `caddy`: entrada pública y certificados HTTPS automáticos.

MySQL y el backend no publican puertos en el servidor. La interfaz solo publica un
puerto de diagnóstico en `127.0.0.1:8080`; el tráfico público entra por Caddy en
los puertos 80 y 443.

## Directorio del servidor

Los archivos se instalan en `/opt/oxipur`. El archivo `.env.production` debe
pertenecer a `root`, tener permisos `600` y nunca copiarse al repositorio.

## Datos persistentes

Docker conserva cuatro volúmenes:

- `oxipur_mysql_data`
- `oxipur_backend_storage`
- `oxipur_caddy_data`
- `oxipur_caddy_config`

`docker compose down` no elimina estos volúmenes. No se debe utilizar la opción
`--volumes` en producción.

## Copias de seguridad

`deploy/backup.sh` genera una copia comprimida, valida el archivo y conserva
treinta días. El servicio y temporizador de `deploy/systemd/` ejecutan la copia
diariamente alrededor de las 02:15.

Las copias se almacenan en `/opt/oxipur/backups` con permisos privados.
