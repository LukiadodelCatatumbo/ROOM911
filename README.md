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
- **PostgreSQL:** `localhost:5433` (puerto interno de Docker: `5432`)

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

No subas el archivo `.env` al repositorio. Las variables de conexión, puertos y URL de la API están documentadas en `.env.example`. Si necesitas otro puerto para PostgreSQL, cambia `DB_HOST_PORT`.

## 🛠️ Ejecución manual (alternativa)

### Base de datos

Crea la base de datos en tu instancia local de PostgreSQL:

```sql
CREATE DATABASE reto_room_911;
```

### Backend (Spring Boot 3)

```bash
cd backend_911/backend
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
