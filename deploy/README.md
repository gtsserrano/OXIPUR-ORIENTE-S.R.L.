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

## Guía paso a paso (primer despliegue)

Asume un VPS Ubuntu/Debian limpio con acceso `root` o `sudo` por SSH, y que
`oxipur.net` ya está delegado al servidor (registros DNS gestionados fuera de
este repositorio).

### 1. DNS (Namecheap)

El dominio `oxipur.net` y el VPS se compraron en Namecheap, así que el DNS se
gestiona ahí:

1. Entra a [namecheap.com](https://www.namecheap.com) → **Domain List** →
   `oxipur.net` → **Manage**.
2. Pestaña **Advanced DNS** → **Host Records** → **Add New Record** dos veces:

   | Tipo (Type) | Host | Valor (Value) | TTL       |
   |-------------|------|-----------------|-----------|
   | A Record    | `@`  | IP pública del VPS (panel VPS Control) | Automatic |
   | A Record    | `www`| IP pública del VPS (panel VPS Control) | Automatic |

3. Si aparece algún registro `URL Redirect` o `CNAME` previo en `@`/`www`
   (Namecheap los deja por defecto con "parking"), elimínalo para que no
   choque con los registros A nuevos.
4. Guarda con el check verde. La propagación suele tardar minutos, hasta un
   par de horas. Verifica desde tu máquina con:

   ```powershell
   nslookup oxipur.net
   ```

   Confirma que la IP mostrada sea la IP pública del VPS antes de continuar.

Consulta la IP pública actual en el panel **VPS Control** de Namecheap
(sección del servidor, "IP Address") — puede cambiar si el VPS se reconstruye,
así que verifícala ahí en vez de asumir un valor fijo.

### 2. Preparar el servidor

```bash
ssh root@<IP-pública-del-VPS>

# Firewall básico
apt update && apt install -y ufw
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Memoria de intercambio (swap)
# El plan tiene 2 GB de RAM y prácticamente sin swap; el build de Maven y los
# límites combinados de los contenedores pueden agotar la RAM sin esto.
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
free -h   # confirma que el swap de 2G aparece activo

# Docker Engine + Compose plugin
curl -fsSL https://get.docker.com | sh
```

### 3. Copiar el código al servidor

Opción A — clonar desde GitHub (recomendado si el repo es accesible desde el
servidor):

```bash
mkdir -p /opt/oxipur
git clone https://github.com/gtsserrano/OXIPUR-ORIENTE-S.R.L. /opt/oxipur
cd /opt/oxipur
```

Opción B — subir el tarball de release ya generado (`oxipur-v1.1.5.release.tar.gz`)
desde tu máquina:

```powershell
scp "oxipur-v1.1.5.release.tar.gz" root@<IP-del-VPS>:/opt/oxipur.tar.gz
```

```bash
mkdir -p /opt/oxipur
tar -xzf /opt/oxipur.tar.gz -C /opt/oxipur
cd /opt/oxipur
```

### 4. Configurar secretos de producción

```bash
cp deploy/.env.production.example .env.production
openssl rand -hex 32   # ejecútalo tres veces y pega cada valor donde corresponda
nano .env.production
```

Completa `.env.production` con:

- `APP_DOMAIN=oxipur.net`
- `ACME_EMAIL=` un correo real que administres (Let's Encrypt lo usa para avisos)
- `DB_PASSWORD`, `DB_ROOT_PASSWORD`, `JWT_SECRET`: cada uno con un valor distinto
  de `openssl rand -hex 32`

Después asegura los permisos:

```bash
chown root:root .env.production
chmod 600 .env.production
```

### 5. Levantar los contenedores

```bash
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build
docker compose --env-file .env.production -f docker-compose.production.yml ps
```

La primera vez, Caddy solicita el certificado HTTPS automáticamente en cuanto
detecta que el DNS ya apunta al servidor; puede tardar uno o dos minutos.
Revisa el progreso con:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml logs -f caddy
```

Cuando termine, `https://oxipur.net` debe responder con la interfaz.

### 6. Activar las copias de seguridad automáticas

```bash
cp deploy/systemd/oxipur-backup.service /etc/systemd/system/
cp deploy/systemd/oxipur-backup.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now oxipur-backup.timer
systemctl list-timers oxipur-backup.timer
```

### 7. Actualizaciones futuras

```bash
cd /opt/oxipur
git pull
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build
```
