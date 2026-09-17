# Cómo publicar el sistema en internet (oxipur.net)

Esta guía explica, paso a paso y sin tecnicismos, cómo poner el sistema OXIPUR
a funcionar en `https://oxipur.net` para que cualquiera pueda entrar desde su
navegador. Está pensada para seguirse tal cual, copiando y pegando cada
comando en el orden indicado.

**Lo que vamos a hacer, en resumen:** tienes una computadora alquilada (el
VPS de Namecheap) que está encendida las 24 horas en un centro de datos.
Vamos a: 1) decirle a internet que el nombre `oxipur.net` corresponde a esa
computadora, 2) instalarle ahí una copia del sistema, y 3) encenderlo.

Datos de tu servidor (del panel "VPS Control" de Namecheap):

- Dirección de la computadora en internet (IP): `162.0.213.34`
- Verifica siempre este número en el panel antes de empezar, por si cambió.

---

## Paso 1 — Conectar el nombre oxipur.net con tu computadora

Esto es como anotar en la guía telefónica de internet "oxipur.net vive en la
dirección 162.0.213.34".

1. Entra a [namecheap.com](https://www.namecheap.com) e inicia sesión.
2. Ve a **Domain List** y busca `oxipur.net`, luego haz clic en **Manage**.
3. Abre la pestaña **Advanced DNS**.
4. Busca la sección de registros (**Host Records**) y borra cualquier fila
   que diga `URL Redirect` en el host `@` o `www` si existe (es una página de
   "parking" que Namecheap deja por defecto).
5. Agrega dos filas nuevas con **Add New Record**:

   - Tipo: `A Record` — Host: `@` — Valor: `162.0.213.34`
   - Tipo: `A Record` — Host: `www` — Valor: `162.0.213.34`

6. Guarda con el ícono de check verde.

Este cambio no es instantáneo: puede tardar entre unos minutos y un par de
horas en "avisarle" a todo internet. No hace falta que te quedes esperando;
puedes seguir con el paso 2 mientras tanto, pero el sitio no será visible
hasta que esto termine de propagarse.

---

## Paso 2 — Entrar a tu computadora remota

Para trabajar en el VPS necesitas conectarte a él de forma remota y segura
(esto se llama "SSH", como abrir una ventana de control a distancia).

Abre una terminal en tu propia computadora (PowerShell) y escribe:

```powershell
ssh root@162.0.213.34
```

Te pedirá una contraseña o confirmación la primera vez — usa la que te dio
Namecheap al comprar el VPS (revisa el correo de bienvenida o el panel VPS
Control, suele tener un botón para restablecer la contraseña de `root` si no
la tienes a mano).

Si conecta bien, verás que el texto de la terminal cambia y ahora dice algo
como `root@server1:~#` — eso significa que ya estás "dentro" de la
computadora remota. Todos los comandos siguientes (hasta que se indique lo
contrario) se escriben ahí, no en tu computadora.

---

## Paso 3 — Preparar la computadora remota

Estos comandos hacen tres cosas: cierran todas las puertas de entrada excepto
las necesarias (seguridad), le dan más "memoria de respaldo" a la
computadora para que no se quede sin recursos al instalar todo, e instalan el
programa que arma y enciende el sistema automáticamente (Docker).

Copia y pega este bloque completo:

```bash
apt update && apt install -y ufw

ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

curl -fsSL https://get.docker.com | sh
```

Puede tardar un par de minutos. Al final no debería mostrar ningún mensaje en
rojo que diga "error" o "failed".

---

## Paso 4 — Llevar el sistema a la computadora remota

Ahora copiamos el código del sistema (lo que está en este proyecto) hacia el
servidor. La forma más simple es traerlo directamente desde donde está
guardado en GitHub:

```bash
mkdir -p /opt/oxipur
git clone https://github.com/gtsserrano/OXIPUR-ORIENTE-S.R.L. /opt/oxipur
cd /opt/oxipur
```

Si el repositorio es privado y pide usuario/contraseña y falla, avísame y
usamos la otra opción (subir el archivo comprimido `.tar.gz` directamente
desde tu computadora).

---

## Paso 5 — Crear las claves secretas del sistema

El sistema necesita unas "contraseñas internas" propias del servidor (para
proteger la base de datos y el acceso). No son las contraseñas de las
personas que usan el sistema, son claves técnicas que solo usan las piezas
del sistema entre sí.

```bash
cp deploy/.env.production.example .env.production
openssl rand -hex 32
openssl rand -hex 32
openssl rand -hex 32
```

Ese último comando lo ejecutaste tres veces a propósito: cada vez te da un
código largo distinto. Cópialos (aparecen en pantalla, selecciónalos con el
mouse) y ahora abre el archivo de configuración:

```bash
nano .env.production
```

Se abre un editor de texto simple dentro de la terminal. Completa cada línea
así:

- `APP_DOMAIN=oxipur.net` (déjalo tal cual)
- `ACME_EMAIL=` — pon un correo real tuyo (se usa solo para avisos del
  certificado de seguridad, nunca es público)
- `DB_PASSWORD=` — pega el primer código largo que generaste
- `DB_ROOT_PASSWORD=` — pega el segundo código largo (debe ser distinto al
  anterior)
- `JWT_SECRET=` — pega el tercer código largo

Para guardar en ese editor: `Ctrl+O`, luego `Enter`, y para salir `Ctrl+X`.

Por último, protege ese archivo para que nadie más pueda leerlo:

```bash
chown root:root .env.production
chmod 600 .env.production
```

---

## Paso 6 — Encender el sistema

Este es el comando que arma todas las piezas (base de datos, la aplicación,
la página web y el candado de seguridad HTTPS) y las enciende:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build
```

La primera vez tarda varios minutos porque está construyendo todo desde
cero. Al terminar, revisa que todo esté en marcha con:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml ps
```

Deberías ver cuatro filas (`mysql`, `backend`, `frontend`, `caddy`) con la
palabra `Up` o `healthy` en su estado. Si alguna dice `Restarting` o
`Exited`, copia lo que muestra la pantalla y compártemelo.

---

## Paso 7 — Confirmar que ya está en línea

Abre en tu navegador (en tu propia computadora, no en la terminal remota):

```
https://oxipur.net
```

Debería aparecer la página del sistema con el candado de seguridad en la
barra de direcciones. Si el paso 1 (DNS) todavía no terminó de propagarse,
puede que aún no cargue — espera un poco y vuelve a intentar.

---

## Paso 8 — Activar las copias de seguridad automáticas

Esto hace que, todas las noches, el servidor guarde automáticamente una
copia de seguridad de la base de datos por si algo llegara a fallar.

```bash
cp deploy/systemd/oxipur-backup.service /etc/systemd/system/
cp deploy/systemd/oxipur-backup.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now oxipur-backup.timer
```

---

## Cómo actualizar el sistema más adelante

Cuando en el futuro se hagan mejoras al sistema y quieras publicarlas, desde
dentro de la terminal remota (Paso 2) ejecuta:

```bash
cd /opt/oxipur
git pull
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build
```

---

## Si algo sale mal

En cualquier paso, si ves un mensaje que parece un error (normalmente en
rojo, o que dice "error", "failed", "denied"), no sigas adelante: copia el
mensaje completo y compártemelo para revisarlo juntos.
