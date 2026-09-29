# 📘 Guía: continuar ROOM911 en otro computador (vía GitHub)

> Actualizada con los arreglos hasta el commit `0152ffa`: simulador con veredicto del servidor,
> entidad `puntos_acceso`, endpoint público de colaboradores y dominio `date_time` (solo BD local).

---

## 0. En este equipo — dejar todo subido

```bash
git status                 # debe quedar limpio al terminar
git add -A
git commit -m "feat: <descripción>"
git push origin main
```

Remoto: `git@github.com:LukiadodelCatatumbo/ROOM911.git` (SSH), rama `main`.
**`.env` NO se sube** (está en `.gitignore`: lleva contraseñas y `JWT_SECRET`). Llévalo al otro equipo por otro medio (paso 2) o recréalo.

---

## 1. En el otro computador — requisitos

| Herramienta | Versión | Nota |
|---|---|---|
| Git | reciente | para clonar |
| **JDK 17** (no solo JRE) | 17.x | `./mvnw` necesita `javac` (`javac -version`). En Fedora instala el paquete `-devel`, no solo `headless` |
| Docker + Docker Compose | reciente | vía recomendada |
| Node.js | 20+ | para el frontend |
| **pnpm** | 9+ | `corepack enable`. **Nunca npm/yarn/npx** (regla del proyecto, ver `AGENTS.md`) |

```bash
sudo apt install -y git docker.io docker-compose-v2 openjdk-17-jdk   # Ubuntu/Debian ejemplo
sudo usermod -aG docker $USER   # reingresa a sesión para usar docker sin sudo
corepack enable && corepack prepare pnpm@latest --activate
```

Para GitHub en el nuevo equipo: genera una clave con `ssh-keygen` y regístrala en GitHub → Settings → SSH and GPG keys, o usa HTTPS con Personal Access Token.

---

## 2. Clonar y crear el `.env`

```bash
git clone git@github.com:LukiadodelCatatumbo/ROOM911.git
cd ROOM911
cp .env.example .env
```

Edita `.env` (obligatorio):

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=reto_room_911
DB_USERNAME=postgres
DB_PASSWORD=<tu contraseña de Postgres>
DB_HOST_PORT=5432

# Obligatorios (32+ caracteres aleatorios cada uno) o el backend no levanta
JWT_SECRET=<secreto-largo-aleatorio>
# API key de la superficie pública /api/acceso (lectores y simulador)
ACCESO_API_KEY=<apikey-larga-aleatoria-distinta-del-secret>

# Contraseña conocida para los admins sembrados (superadmin, j.reyes, a.sanchez).
# Si se deja vacía, se genera una aleatoria y sale UNA vez en el log del backend.
ROOM911_SEED_PASSWORD=<contraseña-inicial-admin>
ROOM911_SYNC_SEED_PASSWORD=false

# Caja verde de demo en el login (opcional; si se dejan vacías no se muestra)
VITE_DEMO_USERNAME=superadmin
VITE_DEMO_PASSWORD=<la misma de ROOM911_SEED_PASSWORD>
```

> `DB_PASSWORD` debe coincidir con `POSTGRES_PASSWORD` del servicio `db` en `docker-compose.yml`.
> En desarrollo local con `pnpm dev`, las variables `VITE_*` se leen de `room911-frontend/.env` o del entorno del shell.

---

## 3. Levantar la aplicación

### Opción A — Docker (recomendado, todo en uno)

```bash
docker compose up -d --build
```

- Frontend: http://localhost:5173
- API: http://localhost:8080/api
- PostgreSQL: solo `localhost:5432` (pgAdmin/DBeaver; si el puerto está ocupado, define `DB_HOST_PORT`).

### Opción B — Manual

```bash
docker compose up -d db        # solo Postgres

cd backend_911/backend         # terminal 1 (con JDK 17 activo)
export JWT_SECRET=<secreto-largo-aleatorio>
export ACCESO_API_KEY=<apikey-larga-aleatoria>
./mvnw spring-boot:run

cd room911-frontend            # terminal 2
pnpm install
pnpm dev
```

Al arrancar, Hibernate crea las tablas y `DataInitializer` siembra (solo si están vacías):
6 departamentos, **11 puntos de acceso** (`puntos_acceso` con franjas horarias),
admins (clave de `ROOM911_SEED_PASSWORD`) y 8 empleados + intentos de ejemplo.

Después, aplica una sola vez los scripts de migración (idempotentes, en orden):

```bash
docker compose exec -T db psql -U postgres -d reto_room_911 < db/v2_arreglos_seguros.sql
docker compose exec -T db psql -U postgres -d reto_room_911 < db/v3_renombrado_columnas_fecha.sql
```

> **Importante:** ejecutar v2 y v3 **antes** de arrancar el backend sobre una BD pre-Fase-20.
> Si el backend arranca primero, `ddl-auto=update` crea las columnas `date_time_*` nuevas y
> vacías junto a las `fecha_*` viejas, duplicando el esquema en silencio (los reportes por
> fecha parecerían vacíos sin ningún error). El script v3 también normaliza/backfillea el
> `rol` de administradores para el enum `Rol` (Fase 21).

> **Nota Fase 20:** una BD fresca creada por Hibernate ya nace con columnas `date_time_*`.
> Los nombres de columnas son `date_time_*`; el TIPO sigue siendo `timestamp without time
> zone` (en PostgreSQL no existe el tipo `datetime` de MySQL). Solo necesitas estos scripts
> si traes una BD creada antes de la Fase 20.

---

## 4. Verificación

1. Login en http://localhost:5173 con `superadmin` + tu `ROOM911_SEED_PASSWORD`.
2. **Simulador** (`Acceder al Simulador de Puertas`, funciona **sin login**): el selector trae los
   colaboradores reales vía `GET /api/acceso/colaboradores`; el veredicto (punto, horario America/Bogota,
   zona) lo emite el servidor. Prueba un punto de otra zona → debe denegar.
3. Chequeos rápidos:

```bash
curl -s http://localhost:8080/api/acceso/colaboradores | head -c 200
curl -s -X POST http://localhost:8080/api/acceso \
  -H 'Content-Type: application/json' \
  -d '{"documento":"7080901020","puerta":"DOOR-PROD-01"}'
```

---

## 5. Datos: lo que SÍ viaja y lo que NO

- **Viaja en git:** todo el código, seeds, índices, el catálogo de puntos y los scripts de migración (`db/`).
- **NO viaja:** `.env`, ni el contenido vivo de tu BD (empleados creados, intentos, auditoría).
  - BD fresca = seeds (empleados demo, horarios base) y columnas ya nacen como `date_time_*`
    (el tipo de datos es `timestamp without time zone`; en PostgreSQL no existe `datetime`).
  - Si quieres los datos idénticos a otra máquina, migra con dump:

```bash
# En el equipo origen
pg_dump -h localhost -U postgres -d reto_room_911 -F c -f room911_datos.dump
# En el destino (con la BD creada y vacía)
pg_restore -h localhost -U postgres -d reto_room_911 room911_datos.dump
```

- Si olvidas la clave de un admin local: `CREATE EXTENSION IF NOT EXISTS pgcrypto;`
  y `UPDATE administradores SET contrasena = crypt('<nueva>', gen_salt('bf',10)) WHERE usuario='superadmin';`

---

## 6. Ciclo diario y reglas

```bash
git pull origin main      # al empezar
# ... trabajas ...
git add -A && git commit -m "feat: <descripción>" && git push origin main
```

Reglas (`AGENTS.md`): solo `pnpm`; cero hardcoding (todo por `.env` + `.env.example`);
antes de cerrar una tarea deben pasar `./mvnw compile` (backend) y `pnpm build` (frontend).
