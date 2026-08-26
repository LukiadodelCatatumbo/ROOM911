# 🏢 ROOM911 — Sistema de Control de Acceso y Gestión de Personal

ROOM911 es una plataforma integral de **Control de Acceso Físico, Gestión de Personal y Auditoría** para entornos industriales y farmacéuticos.

---

## 🚀 Inicio Rápido

### 📋 Prerrequisitos
* **Java:** JDK 17 o superior
* **Node.js:** v18.0.0 o superior
* **Gestor de Paquetes Frontend:** `pnpm` (obligatorio: `npm install -g pnpm` o `corepack enable`)
* **Base de Datos:** PostgreSQL 14+

---

## ⚙️ 1. Configuración de Base de Datos

Crea la base de datos en tu instancia local de PostgreSQL:

```sql
CREATE DATABASE reto_room_911;
```

---

## ☕ 2. Ejecutar el Backend (Spring Boot 3)

1. Navega al directorio del backend:
   ```bash
   cd backend_911/backend
   ```
2. (Opcional) Configura tus credenciales en `.env` o en `src/main/resources/application.properties`:
   ```properties
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=reto_room_911
   DB_USERNAME=postgres
   DB_PASSWORD=tu_contraseña
   ```
3. Compila y ejecuta la aplicación:
   ```bash
   ./mvnw spring-boot:run
   ```
   La API REST estará disponible en `http://localhost:8080/api`.

---

## ⚛️ 3. Ejecutar el Frontend (React + Vite)

1. Navega al directorio del frontend:
   ```bash
   cd room911-frontend
   ```
2. Instala las dependencias utilizando **exclusivamente `pnpm`**:
   ```bash
   pnpm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   pnpm dev
   ```
   La interfaz web estará disponible en `http://localhost:5173`.

---

## 📜 Documentación Adicional
* [AGENTS.md](./AGENTS.md): Reglas, estándares de código y directrices para agentes de IA y desarrolladores.
* [TRAZABILIDAD.md](./TRAZABILIDAD.md): Historial de refactorizaciones, auditorías y cambios de arquitectura.
