# 📜 Guía de Trazabilidad y Registro de Cambios — ROOM911

> [!NOTE]
> **Aviso de Fuente de Verdad:** Este documento es una guía histórica y de trazabilidad de los cambios realizados en el proyecto. **La única fuente de verdad definitiva es el código fuente actual del repositorio.**

---

## 📅 Registro de Fases y Modificaciones

### 🛡️ Fase 1: Seguridad Crítica, Variables de Entorno y Manejo de Excepciones
* **Fecha:** 2026-08-25
* **Objetivo:** Mitigar vulnerabilidades de seguridad, evitar exposición de credenciales, corregir manejo de excepciones y normar el flujo de trabajo para agentes.

#### Cambios Realizados:
1. **Archivo de Gobernanza [`AGENTS.md`](./AGENTS.md):**
   - Creado en la raíz del proyecto.
   - Establece la regla estricta de uso exclusivo de `pnpm` (prohibición de `npm`, `yarn`, `npx`).
   - Prohíbe malas prácticas de terminal (`cat << EOF`).
   - Define el uso apropiado de herramientas nativas de edición e inspección.
   - Fija la regla de Cero Hardcoding y Cero Mocks Silenciosos.

2. **Cifrado de Contraseñas ([`AdministradorServiceImpl.java`](./backend_911/backend/src/main/java/com/room911/service/impl/AdministradorServiceImpl.java)):**
   - Integración de `BCryptPasswordEncoder` para encriptar contraseñas en los métodos `guardar()` y `actualizar()`.

3. **Manejo Global de Excepciones ([`GlobalExceptionHandler.java`](./backend_911/backend/src/main/java/com/room911/exception/GlobalExceptionHandler.java)):**
   - Agregado soporte para `MethodArgumentNotValidException` retornando HTTP 400 Bad Request con el detalle de campos inválidos.
   - Mapeo dinámico de `RuntimeException` a códigos HTTP 404 (no encontrado), 409 (conflicto/duplicado) y 401 (no autorizado) en lugar del 404 fijo anterior.
   - Manejador general de excepciones retornando HTTP 500.

4. **Variables de Entorno y Portabilidad:**
   - Creado [`.env.example`](./.env.example) global y específicos en backend y frontend.
   - Actualizado [`application.properties`](./backend_911/backend/src/main/resources/application.properties) con `${DB_HOST:localhost}`, `${DB_PORT:5432}`, `${DB_NAME:reto_room_911}`, etc.

---

### 🔄 Fase 2: Alineación de Contratos API (Frontend <-> Backend)
* **Fecha:** 2026-08-25
* **Objetivo:** Resolver discrepancias entre DTOs de Spring Boot e interfaces TypeScript en los servicios de React para eliminar caídas a mocks silenciosos.

#### Modificaciones en Contratos:
1. **`Empleado` ([`empleadoService.ts`](./room911-frontend/src/services/empleadoService.ts)):**
   - Petición POST/PUT mapeada con los nombres exactos de `EmpleadoDTO`: `correo` (en vez de `email`), `documento` (en vez de `documentoIdentidad`), `accesoPermitido` (en vez de `acceso`).
   - Mapeo de respuesta sincronizado con `EmpleadoResponseDTO` (`nombreDepartamento`, `fechaCreacion`, etc.).
2. **`Dashboard` ([`dashboardService.ts`](./room911-frontend/src/services/dashboardService.ts)):**
   - Sincronización de campos con `DashboardResumenDTO` (`empleados`, `departamentos`, `accesosHoy`, `denegadosHoy`).
   - Mapeo de `obtenerAccesosSemana` (`dia`, `cantidad`).
3. **`Acceso` ([`accesoService.ts`](./room911-frontend/src/services/accesoService.ts)):**
   - Sincronización de petición y respuesta con `AccessResponseDTO` (`permitido`, `mensaje`, `nombreEmpleado`, `documento`, `departamento`).
   - Conexión del historial con `/api/intento-acceso` para reflejar registros de validación reales.
4. **`Departamentos` ([`departamentoService.ts`](./room911-frontend/src/services/departamentoService.ts)):**
   - Mapeo estricto contra `DepartamentoDTO` y `DepartamentoResponseDTO`.
5. **`Administradores` ([`adminService.ts`](./room911-frontend/src/services/adminService.ts)):**
   - Mapeo contra `/api/administradores` soportando CRUD completo (`guardar`, `actualizar`, `eliminar`, `listar`).

6. **Limpieza de Archivos y Carpetas Obsoletas:**
   - Eliminada la carpeta redundante `Revamp panel administrativo(1)/` (export inicial de Figma).
   - Eliminado `room911-frontend/vite.config.js` (duplicado obsoleto frente a `vite.config.ts`).
   - Eliminado `room911-frontend/package-lock.json` en estricto apego al estándar exclusivo de `pnpm` (`pnpm-lock.yaml`).

---

### 🛡️ Fase 3: Robustecimiento Backend, OpenCSV y Manejo Defensivo
* **Fecha:** 2026-08-25
* **Objetivo:** Eliminar riesgos de NullPointerException, migrar logging a SLF4J y reemplazar parser manual de CSV por OpenCSV.

#### Cambios Realizados:
1. **Protección contra `NullPointerException`:**
   - [`AccessServiceImpl.java`](./backend_911/backend/src/main/java/com/room911/service/impl/AccessServiceImpl.java): Comprobación null-safe de `empleado.getDepartamento()`.
   - [`PdfServiceImpl.java`](./backend_911/backend/src/main/java/com/room911/service/impl/PdfServiceImpl.java): Comprobación null-safe al obtener nombre de departamento para el reporte PDF.
2. **Implementación de OpenCSV y Validación de Duplicados ([`EmpleadoServiceImpl.java`](./backend_911/backend/src/main/java/com/room911/service/impl/EmpleadoServiceImpl.java)):**
   - Sustituido el split manual por `com.opencsv.CSVReader`.
   - Agregada validación de duplicidad tanto para `documento` como para `correo` antes de persistir registros importados.
3. **Logging Estructurado con SLF4J:**
   - Reemplazados todos los `System.out.println` por `@Slf4j` (`log.info`, `log.warn`, `log.error`, `log.debug`) en la capa de servicios.
4. **Verificación Integral:**
   - `./mvnw compile`: `BUILD SUCCESS`.
   - `pnpm build`: Empaquetado exitoso sin errores de TypeScript.

---

### 🎨 Fase 4: Optimización UI/UX, Seguridad de Formularios y Simulador BPF
* **Fecha:** 2026-08-25
* **Objetivo:** Refactorizar el simulador de accesos para enlazar puertas con departamentos, agregar búsqueda/filtros en administradores, rediseñar cards de KPI y robustecer la validación y complejidad en todos los formularios.

#### Cambios Realizados:
1. **Consola y Simulador de Acceso Físico ([`SimuladorAcceso.tsx`](./room911-frontend/src/pages/SimuladorAcceso.tsx)):**
   - Vinculación lógica formal entre **Puntos de Control / Esclusas** y sus respectivos **Departamentos y Niveles de Restricción** (`BAJA`, `MEDIA`, `ALTA`, `CRITICA_ESTERIL`).
   - Matriz de evaluación previa en tiempo real mostrando compatibilidad departamental del colaborador vs. la esclusa antes del escaneo.
   - Reubicación del *Registro de Pruebas Recientes* en un contenedor de ancho completo (`w-full`) con estado vacío permanente y scroll interno acotado (`max-h-[220px] overflow-y-auto`) para evitar scroll-down descontrolado de página.
2. **Gestión de Administradores ([`Administradores.tsx`](./room911-frontend/src/pages/Administradores.tsx)):**
   - Agregado buscador en tiempo real, selector de filtro por rol (`SUPER_ADMIN`, `ADMIN_ACCESOS`, `ADMIN_SISTEMAS`), filtro por estado (Activo/Inactivo) y paginación reactiva.
   - Formulario con campos de confirmación obligatorios para Correo Electrónico y Contraseña.
   - Medidor de fortaleza de contraseña interactivo con checklist en tiempo real (mínimo 8 caracteres, mayúscula, minúscula, números y caracteres especiales).
3. **Métricas y KPI Cards en Dashboard ([`Dashboard.tsx`](./room911-frontend/src/pages/Dashboard.tsx)):**
   - Rediseño de las 4 tarjetas KPI con jerarquía tipográfica `mono` de alto contraste, micro-barras de progreso y adaptabilidad responsiva limpia en móvil, tablet y escritorio.
   - Ajuste del indicador de salud de sensores para reflejar 100% de operatividad en verde cuando no existen fallas de hardware.
4. **Validaciones en Formularios de Personal y Áreas:**
   - [`EmpleadoFormDrawer.tsx`](./room911-frontend/src/pages/EmpleadoFormDrawer.tsx): Límites `maxLength` estrictos en correo (80) y cargo (50).
   - [`Departamentos.tsx`](./room911-frontend/src/pages/Departamentos.tsx): Sanitización y límite numérico estricto en aforo/capacidad máxima (1 a 500 personas, máx 3 dígitos).
5. **Gobernanza y Control de Archivos:**
   - Adición de regla 5 en [`AGENTS.md`](./AGENTS.md) sobre diseño responsivo, scroll interno y estados vacíos.
   - Creación del [`.gitignore`](./.gitignore) raíz para proteger el repositorio de artefactos de compilación (`node_modules`, `target`, `dist`, `.env`).
