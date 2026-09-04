# 📘 Guía: continuar el proyecto ROOM911 en otro computador (vía GitHub)

> Generada el 2026-09-03 tras la auditoría de base de datos y la unificación de nomenclatura a español.

---

## 0. ANTES DE CAMBIAR DE EQUIPO — subir tu trabajo desde este computador

⚠️ **Los cambios de la auditoría aún no están en GitHub.** Ejecuta en este equipo:

```bash
cd /home/senafactory/ROOM911-1

# Revisar qué se va a subir (opcional)
git status
git diff --stat

# Subir TODO: código, auditoría, script de BD y dump regenerado
git add -A
git commit -m "feat(db): auditoria y arreglos - indices, uniques parciales, nomenclatura en espanol"
git push origin main
```

**Notas sobre lo que se sube:**
- Se incluyen los archivos nuevos: `AUDITORIA_BASE_DE_DATOS.md`, `db/v2_arreglos_seguros.sql` y el dump actualizado `backup_reto_room_911.sql`.
- Se incluyen también la eliminación de los archivos `Visitante*` (borrado que ya habías hecho) y las carpetas `carga_masiva/` y `Reto_room911.docx` (estaban sin trackear). Si **no** quieres subir el .docx o `carga_masiva/`, agrégalos a `.gitignore` antes del `git add -A`.
- **`.env` NO se sube** (está en `.gitignore` a propósito: contiene credenciales). Tienes que llevarlo al otro equipo por otro medio (paso 2).

Si GitHub pide autenticación al hacer push: usa GitHub CLI (`gh auth login`) o un *Personal Access Token* como contraseña de HTTPS.

---

## 1. En el otro computador — requisitos

| Herramienta | Versión | Nota |
|---|---|---|
| Git | cualquier reciente | para clonar |
| **JDK 17** (no solo JRE) | 17.x | `./mvnw` necesita `javac`. Verifica con `javac -version` |
| Docker + Docker Compose | reciente | vía recomendada de levantar todo |
| Node.js | 20+ | para el frontend |
| **pnpm** | 9+ | `corepack enable` o `npm install -g pnpm`. **Nunca npm/yarn** (regla del proyecto) |

En Ubuntu/Debian, por ejemplo:

```bash
sudo apt install -y git docker.io docker-compose-v2 openjdk-17-jdk
sudo usermod -aG docker $USER   # cierra y abre sesión para usar docker sin sudo
corepack enable && corepack prepare pnpm@latest --activate
```

⚠️ En Fedora (como este equipo) pasa lo mismo que aquí: si solo instalas `java-*-openjdk-headless` no habrá `javac`; instala el paquete `-devel`.

---

## 2. Clonar y recuperar el `.env`

```bash
git clone https://github.com/LukiadodelCatatumbo/ROOM911.git
cd ROOM911
```

Crea el archivo `.env` en la raíz (no viene de GitHub). Cópialo desde este equipo o recréalo con al menos:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=reto_room_911
DB_USERNAME=postgres
DB_PASSWORD=<tu contraseña de Postgres>
DB_HOST_PORT=5432

# Obligatorio para docker compose (32+ caracteres)
JWT_SECRET=<secreto-largo-aleatorio>
JWT_EXPIRATION_MS=28800000
CORS_ALLOWED_ORIGINS=http://localhost:5173

# Contraseña con la que se siembran los usuarios admin la primera vez
ROOM911_SEED_PASSWORD=<contraseña-inicial-admin>
ROOM911_SYNC_SEED_PASSWORD=false
```

**Importante:** `DB_PASSWORD` del `.env` debe coincidir con `POSTGRES_PASSWORD` que usa el servicio `db` en `docker-compose.yml` (por defecto `postgres_password`). Si usas otra, cámbiala en el compose o exporta `DB_PASSWORD` coherente.

---

## 3. Base de datos — dos opciones

### Opción A (recomendada): restaurar el dump con todos los datos

El dump del repo (`backup_reto_room_911.sql`) ya fue regenerado con el esquema corregido (índices, uniques parciales, columnas en español). Levanta solo la BD y cárgalo:

```bash
docker compose up -d db
# espera ~5 segundos a que PostgreSQL esté listo
docker compose exec -T db psql -U postgres -d reto_room_911 < backup_reto_room_911.sql
```

### Opción B: BD vacía y que Hibernate la cree

```bash
docker compose up -d --build
```

Al arrancar, el backend crea las tablas (`ddl-auto=update`) y `DataInitializer` siembra departamentos, empleados y los usuarios admin (contraseña de `ROOM911_SEED_PASSWORD`). Después aplica una sola vez los índices únicos parciales (Hibernate no sabe crearlos):

```bash
docker compose exec -T db psql -U postgres -d reto_room_911 < db/v2_arreglos_seguros.sql
```

> El script es idempotente: puedes ejecutarlo las veces que quieras sin romper nada.

---

## 4. Levantar la aplicación

### Con Docker (todo en uno)

```bash
docker compose up -d --build
```

- Frontend: http://localhost:5173
- Backend (API): http://localhost:8080

### Manual (si prefieres sin Docker para el código)

```bash
# BD (solo el servicio de Postgres)
docker compose up -d db

# Backend (terminal 1) — requiere JDK 17 activo
cd backend_911/backend
./mvnw spring-boot:run

# Frontend (terminal 2)
cd room911-frontend
pnpm install
pnpm dev
```

---

## 5. Verificación de que todo quedó bien

1. Entra a http://localhost:5173 e inicia sesión con un admin sembrado (ej. `superadmin` + la contraseña de `ROOM911_SEED_PASSWORD`).
2. En el Dashboard deberías ver métricas y los últimos accesos (los intentos están en la tabla `intento_acceso`).
3. En **Simulador de Acceso**, prueba un documento de empleado (ej. `1020304050`) y luego uno inexistente: ambos deben quedar registrados, el segundo con el documento en la columna `documento_intentado`.
4. Verificación SQL rápida (opcional):

```bash
docker compose exec db psql -U postgres -d reto_room_911 -c \
  "SELECT indexname FROM pg_indexes WHERE schemaname='public' AND (indexname LIKE 'indice_%' OR indexname LIKE 'unico_%');"
```

Deben aparecer 13 índices (8 `indice_*` + 5 `unico_*`).

---

## 6. Ciclo de trabajo diario

```bash
git pull origin main      # al empezar el día
# ... trabajas ...
git add -A && git commit -m "feat: <descripción>" && git push origin main   # al terminar
```

**Reglas del proyecto que debes respetar en cualquier equipo** (ver `AGENTS.md`):
- Solo `pnpm`, nunca `npm`/`yarn`/`npx`.
- Cero credenciales hardcodeadas: todo por `.env` (y mantener `.env.example` actualizado).
- Antes de dar por terminada una tarea: `./mvnw compile` y `pnpm build` deben pasar.
- La trazabilidad de cambios se registra en `TRAZABILIDAD.md` y el estado de la auditoría en `AUDITORIA_BASE_DE_DATOS.md` (pendientes: Flyway, CHECKs/catálogos, `timestamptz`, `@UpdateTimestamp`).
