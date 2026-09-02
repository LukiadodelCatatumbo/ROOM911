# 📋 HANDOFF — Auditoría Integral de Vistas y Plan de Acción Trazable (ROOM911)

* **Fecha de auditoría:** 2026-08-31
* **Alcance:** Auditoría funcional, técnica, de seguridad y contratos API de las 9 vistas del frontend React y sus controladores Spring Boot asociados.
* **Objetivo:** Identificar funciones rotas, inconsistencias de contrato, problemas de accesibilidad/UX y definir un plan de acción priorizado y trazable.

---

## 🧭 1. Resumen Ejecutivo del Diagnóstico

Se realizó un escaneo exhaustivo de todas las vistas, componentes de interfaz, servicios Axios y endpoints del backend.

| Vista / Ruta | Estado Funcional | Nivel de Riesgo | Problema Principal Identificado |
| :--- | :---: | :---: | :--- |
| **`/simulador`** | ❌ **Rota / Inoperativa** | **Crítico** | Endpoint de empleados protegido por JWT causa 401; lista vacía bloquea la simulación y selector de empleados. |
| **`/credencial/:codigoQr`** | ⚠️ **Parcialmente Rota** | **Alto** | Ruta pública que invoca endpoint privado (`/api/empleados/{id}`); queda en loop de carga si no hay sesión admin. |
| **`/historial`** | ⚠️ **Incompleta** | **Medio** | Filtros de fecha ("Desde" / "Hasta") presentes en UI pero desconectados de la lógica de filtrado. |
| **`/dashboard`** | 🟡 **Funcional con Deuda** | **Bajo** | Métricas calculadas con porcentajes estáticos ("63.8%") en aforo cuando la capacidad real es dinámica. |
| **`/empleados`** | ✅ **Funcional** | **Bajo** | Filtros, búsqueda, soft delete y paginación operativos; requiere homogeneizar `dbId` vs `id`. |
| **`/empleados/:id`** | ✅ **Funcional** | **Bajo** | Ficha de empleado y PDF conectados; historial individual paginado correctamente. |
| **`/departamentos`** | ✅ **Funcional** | **Bajo** | CRUD, soft delete (DELETE/PATCH), aforo y conteo de personal sincronizados. |
| **`/administradores`** | ✅ **Funcional** | **Bajo** | Gating por rol (SUPER_ADMIN/ADMIN_SISTEMAS), DELETE real y validación de contraseña robustos. |
| **`/login`** | ✅ **Funcional** | **Bajo** | JWT real, anti-enumeración 401 y redirección correcta. |

---

## 🔍 2. Hallazgos Detallados por Vista

### 🔴 Vista 1: `/simulador` (`SimuladorAcceso.tsx`)
* **Causa Raíz de Funciones Rotas:**
  1. **Bloqueo por Autenticación:** La ruta `/simulador` es pública en el frontend, pero su inicialización (`useEffect`) consume `empleadoService.listarTodos()` y `departamentoService.listarTodos()`. Ambos endpoints requieren token JWT en Spring Security (`anyRequest().authenticated()`). Al acceder sin sesión, retornan HTTP 401 Unauthorized.
  2. **Colapso del Flujo:** El bloque `catch` no manejaba contingencia, dejando el arreglo `employees = []`. En consecuencia:
     - El selector de colaborador queda en blanco.
     - `selectedEmployee` es `undefined`.
     - El botón *"Simular Lectura de Credencial QR"* ejecuta `if (!selectedEmployee && !forceOutcome) return;`, quedando **completamente inerte** al clic.
     - La matriz de compatibilidad de accesos queda oculta.
  3. **Desalineación Lógica Frontend vs. Backend:** La validación de acceso evalúa condiciones puramente en JavaScript local y solo después emite una petición `POST /acceso` para guardar el log, en lugar de consultar la regla centralizada del backend.
  4. **Falta de Entrada Manual / Escáner:** No existe un campo para ingresar manualmente un documento, código QR o token para emular el paso de una tarjeta o credencial móvil.

---

### 🟠 Vista 2: `/credencial/:codigoQr` (`CredencialDigital.tsx`)
* **Causa Raíz:**
  1. Diseñada como credencial móvil pública para trabajadores, pero llama a `empleadoService.buscarPorId(codigoQr)` -> `GET /api/empleados/{id}`.
  2. Al no tener token administrativo en un smartphone, la petición devuelve 401 y la credencial nunca renderiza (se congela en *"Cargando credencial digital..."*).
  3. El endpoint del backend espera un `Long id` numérico, fallando con 400 Bad Request si el QR contiene un código alfanumérico (`EMP-0042` o documento de identidad).

---

### 🟡 Vista 3: `/historial` (`HistorialAccesos.tsx`)
* **Hallazgos:**
  1. **Filtro de Fechas Fantasma:** Los inputs de fecha `dateFrom` y `dateTo` existen en el estado local pero la función `filteredLogs` solo evalúa `search` y `resultadoFilter`, ignorando el rango de fechas.
  2. **Opción 'ERROR_SENSOR':** El filtro incluye "Fallas de Sensor", pero en base de datos solo existen `exito: true` (`CONCEDIDO`) y `exito: false` (`DENEGADO`).

---

### 🟢 Vista 4: `/dashboard` (`Dashboard.tsx`)
* **Hallazgos:**
  1. La tarjeta de "Aforo en Planta" muestra un porcentaje hardcodeado `style={{ width: "63.8%" }}` y texto `"63.8% capacidad"`, en lugar de calcular la ocupación real basada en la sumatoria de capacidades de departamentos.
  2. La tasa de éxito muestra `"94.2"` fijo si el total de accesos del día es 0.

---

## 🎯 3. Plan de Acción Trazable (Fases de Ejecución)

### 📌 FASE 1: Reparación Integral de `/simulador` y `/credencial` (Completada ✅)
- [x] **1.1 Resiliencia y Datos de Terminal en `/simulador` (`SimuladorAcceso.tsx`):**
  - Carga de empleados de base de terminal si no hay sesión admin o si la API está en modo público.
  - Habilitado campo de escaneo manual (lector de código de barras/QR/cédula por teclado).
  - Conexión de la simulación directa con endpoint público `POST /api/acceso` y validación de reglas BPF por área.
- [x] **1.2 Soporte de Credencial Pública (`CredencialDigital.tsx`):**
  - Resolución tolerante de credencial digital móvil para evitar congelamiento de pantalla en smartphones no autenticados.

---

### 📌 FASE 2: Conexión de Filtros en `/historial` (Prioridad Media)
- [ ] **2.1 Conexión del Rango de Fechas:**
  - Integrar `dateFrom` y `dateTo` en el filtro de registros en `HistorialAccesos.tsx`.
  - Asegurar coherencia en las exportaciones CSV y PDF.

---

### 📌 FASE 3: Refinamiento de Métricas en `/dashboard` (Prioridad Baja)
- [ ] **3.1 Cálculo Dinámico de Aforo:**
  - Calcular la ocupación porcentual dinámica con base en la sumatoria de aforos de los departamentos.
- [ ] **3.2 Manejo de Indicador Vacío en Tasa de Éxito:**
  - Sustituir `"94.2"` hardcodeado por cálculo exacto.

---

### 📌 FASE 4: Verificación de Calidad y No Regresión
- [ ] `./mvnw compile` y `./mvnw test` en backend.
- [ ] `pnpm build` en frontend.
- [ ] Validación cruzada de todas las vistas.
