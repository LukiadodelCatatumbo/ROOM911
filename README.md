# 🏢 ROOM911 — Sistema de Control de Acceso y Gestión de Personal

ROOM911 es una plataforma integral de **Control de Acceso Físico, Gestión de Personal y Auditoría** para entornos industriales y farmacéuticos.

---

## 🚀 Inicio rápido con Docker (recomendado)

### 📋 Prerrequisitos

Solo necesitas tener instalado **Docker Desktop** (o Docker Engine con el complemento Docker Compose).

Después de clonar el repositorio:

```bash
git clone https://github.com/LukiadodelCatatumbo/ROOM911.git
cd ROOM911
docker compose up -d --build
```

La primera ejecución construye las imágenes, crea PostgreSQL e inicializa los datos base automáticamente. La aplicación quedará disponible en:

- **Interfaz web:** http://localhost:5173
- **API REST:** http://localhost:8080/api
- **PostgreSQL:** accesible solo desde `localhost:5432` (usuario/contraseña según `.env`) para administrarla con pgAdmin/DBeaver; no queda expuesta a la red externa. Si el host ya ocupa el 5432, define `DB_HOST_PORT` en `.env`.

Comandos útiles:

```bash
# Ver el estado y los logs
docker compose ps
docker compose logs -f

# Detener los contenedores conservando la base de datos
docker compose down

# Detener y eliminar también los datos persistidos (operación destructiva)
docker compose down -v
```

### 🔐 Configuración opcional

Docker Compose usa valores de desarrollo seguros por defecto. Para personalizarlos, copia `.env.example` como `.env` en la raíz antes de levantar los servicios:

```bash
cp .env.example .env
docker compose up -d --build
```

No subas el archivo `.env` al repositorio. Las variables de conexión, puertos y URL de la API están documentadas en `.env.example`.

### 🔑 Variables de entorno de seguridad

| Variable | Dónde se usa | Descripción |
|---|---|---|
| `JWT_SECRET` | Backend | Clave HS256 para firmar los tokens JWT. **Obligatoria siempre** (32+ caracteres aleatorios): el backend no arranca sin ella y Docker Compose la exige. |
| `ACCESO_API_KEY` | Backend / Frontend | API key de la superficie pública `/api/acceso/**` (lectores físicos y simulador). **Obligatoria**: sin ella el backend responde 503 en esa ruta. El frontend la envía como cabecera `X-Api-Key` (vía `VITE_ACCESO_API_KEY`). |
| `ROOM911_SEED_PASSWORD` | Backend | Contraseña inicial de los usuarios sembrados por `DataInitializer`. Si se omite, se genera una aleatoria y se registra una sola vez en el log del backend. |
| `CORS_ALLOWED_ORIGINS` | Backend | Orígenes permitidos, separados por coma (por defecto `http://localhost:5173`). |
| `VITE_API_URL` | Frontend | URL base de la API que consume el frontend (por defecto `/api`; en desarrollo local `http://localhost:8080/api`). |

## 🔐 Autenticación y roles

La autenticación se realiza contra la tabla `administradores` mediante JWT (HS256, sin estado):

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"superadmin","password":"<ROOM911_SEED_PASSWORD>"}'
```

Respuesta exitosa (200): `{ "loginCorrecto": true, "token": "<JWT>", "username": ..., "rol": ... }`. Un fallo de credenciales responde siempre 401 genérico (`Credenciales inválidas`), sin revelar si el usuario existe. El token se envía en las demás peticiones como cabecera `Authorization: Bearer <token>`.

Todos los endpoints de escritura y consulta requieren sesión válida, salvo `POST /api/auth/login` y la superficie `/api/acceso/**` (terminales lectoras sin sesión, protegida con API key en la cabecera `X-Api-Key` y rate limit por IP). El login bloquea temporalmente la cuenta tras 5 intentos fallidos en 15 minutos. Los roles definidos son:

| Rol | Permisos principales |
|---|---|
| `SUPER_ADMIN` | Acceso total, incluido eliminar administradores (`DELETE /api/administradores/{id}`). |
| `ADMIN_ACCESOS` | Gestión de personal: crear/editar empleados, departamentos, visitantes, historial e intentos de acceso, y generar informes PDF. |
| `ADMIN_SISTEMAS` | Gestión de administradores: crear y editar usuarios (todas las escrituras sobre `/api/administradores` excepto eliminar). |

Al primer arranque con la base de datos vacía, `DataInitializer` siembra tres usuarios con la contraseña `ROOM911_SEED_PASSWORD`: `superadmin` (`SUPER_ADMIN`), `j.reyes` (`ADMIN_ACCESOS`) y `a.sanchez` (`ADMIN_SISTEMAS`).

## 🛠️ Ejecución manual (alternativa)

### Base de datos

Crea la base de datos en tu instancia local de PostgreSQL:

```sql
CREATE DATABASE reto_room_911;
```

> **BD preexistente (creada antes de la Fase 20)?** Ejecuta las migraciones en orden
> **antes** de arrancar el backend (son idempotentes):
> `psql -d reto_room_911 -f db/v2_arreglos_seguros.sql && psql -d reto_room_911 -f db/v3_renombrado_columnas_fecha.sql`.
> Una BD fresca no los necesita: Hibernate crea el esquema con columnas `date_time_*`.

### Backend (Spring Boot 3)

```bash
cd backend_911/backend
# Obligatorias: sin estas variables el backend no arranca
export JWT_SECRET=<secreto-de-al-menos-32-caracteres>
export ACCESO_API_KEY=<apikey-de-los-lectores>
./mvnw spring-boot:run
```

La API REST estará disponible en `http://localhost:8080/api`.

### Frontend (React + Vite)

```bash
cd room911-frontend
pnpm install
pnpm dev
```

La interfaz web estará disponible en `http://localhost:5173`.

---

## 📜 Documentación Adicional
* [AGENTS.md](./AGENTS.md): Reglas, estándares de código y directrices para agentes de IA y desarrolladores.
* [TRAZABILIDAD.md](./TRAZABILIDAD.md): Historial de refactorizaciones, auditorías y cambios de arquitectura.
