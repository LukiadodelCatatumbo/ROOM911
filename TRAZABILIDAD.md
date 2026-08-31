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

---

### 📚 Fase 5: Revisión trazable de Historias de Usuario contra la aplicación
* **Fecha:** 2026-08-26
* **Objetivo:** Comparar el documento de historias con la aplicación real, iniciar la actualización por HU-001 y dejar continuidad para revisar cada HU sin perder contexto.

#### Cambios realizados:
1. Se confirmó que el repositorio no contiene archivo `.mc`; el documento funcional disponible es [`Historias de Usuario Room_911.md`](./Historias%20de%20Usuario%20Room_911.md).
2. Se actualizó HU-001 con lenguaje de negocio, alcance separado, criterios de aceptación, estado actual, brechas y tareas pendientes.
3. Se creó [`REVISION_HISTORIAS_USUARIO.md`](./REVISION_HISTORIAS_USUARIO.md) con la matriz de 29 HUs, duplicados, cobertura inicial y candidatas de nuevas historias.
4. Se creó [`HANDOFF_REVISION_HU.md`](./HANDOFF_REVISION_HU.md), cuyo siguiente punto de trabajo es HU-002.
5. No se modificó código fuente en esta fase; los hallazgos de seguridad y contrato quedaron documentados para su posterior decisión e implementación.

---

### 📚 Fase 6: Ampliación funcional de HU-001
* **Fecha:** 2026-08-26
* **Objetivo:** Incorporar suficiente contexto funcional para que una persona de negocio pueda entender, revisar y probar la HU-001 sin depender de la implementación técnica.

#### Cambios realizados:
1. Se agregaron precondiciones y el flujo principal de autenticación y cierre de sesión.
2. Se ampliaron los criterios de aceptación a 13 escenarios con formato Dado/Cuando/Entonces, resultado esperado y estado frente a la app.
3. Se detallaron 13 tareas con entregable y forma de comprobación.
4. Se agregaron reglas de negocio, calidad, seguridad y límites de alcance.
5. Se actualizó el handoff para indicar que HU-001 está en versión 1.1 y que la siguiente HU sigue siendo HU-002.

### 📚 Fase 7: Ampliación funcional de HU-002
* **Fecha:** 2026-08-26
* **Objetivo:** Mejorar la definición funcional de la gestión de administradores sin modificar HU-001, haciendo que cada condición y tarea pueda entenderse y verificarse desde negocio.

#### Cambios realizados:
1. Se amplió el requerimiento de HU-002 para incluir registro, consulta, edición, roles, estados, búsqueda, filtros, paginación y persistencia.
2. Se reescribieron las diez condiciones con contexto, acción y resultado esperado en formato Dado/Cuando/Entonces.
3. Se reescribieron las dieciséis tareas con una descripción breve del entregable o comportamiento que debe comprobarse.
4. Se agregó el estado frente a la aplicación y la evidencia E-06, incluyendo las brechas del contrato de rol, la persistencia de estado y los fallbacks demo.
5. Se actualizó el handoff y la matriz para continuar con HU-003.

### 📚 Fase 8: Mejora del paquete HU-001 a HU-007
* **Fecha:** 2026-08-26
* **Objetivo:** Mejorar prioritariamente la redacción de las tareas y mantener condiciones funcionales claras y generales en las primeras siete historias, incluyendo HU-001.

#### Cambios realizados:
1. Se actualizaron las tareas de HU-001, pasando de nombres breves a descripciones con propósito, alcance y resultado comprobable.
2. Se conservaron las evidencias, brechas y criterios de seguridad de HU-001, actualizando su versión documental a 1.2.
3. Se ampliaron las tareas de HU-003 a HU-007 para explicar qué debe construirse, validarse, persistirse o probarse.
4. Se ajustaron las condiciones de HU-003 a HU-007 para expresar escenarios generales, claros y verificables.
5. Se mantuvo HU-001 como historia funcional vigente y se dejó intacto únicamente su bloque histórico original.
6. Se actualizó el handoff y la matriz para continuar con el paquete HU-008 a HU-014.

### 🛡️ Fase 9: Seguridad JWT real, roles por endpoint y bootstrap sin hardcoding (backend)
* **Fecha:** 2026-08-31
* **Objetivo:** Reemplazar el `permitAll()` global por autenticación JWT con roles diferenciados, unificar el sistema de usuarios en `Administrador` y eliminar credenciales hardcodeadas. Detalle completo y trabajo pendiente en [`HANDOFF_INTEGRACION_SEGURIDAD.md`](./HANDOFF_INTEGRACION_SEGURIDAD.md).

#### Cambios realizados:
1. **JWT stateless:** nuevos `security/JwtService.java`, `security/JwtAuthenticationFilter.java`; `SecurityConfig` reescrito (solo públicos `/api/auth/login` y `/api/acceso/**`; resto requiere token). Secret y expiración por `JWT_SECRET`/`JWT_EXPIRATION_MS`.
2. **Login unificado:** nuevos `AuthController` (`POST /api/auth/login`) y `AuthServiceImpl` sobre la entidad `Administrador` (con BCrypt). Se ELIMINÓ el sistema paralelo `AdminUser` (entity, controller, DTO, service, repository). Respuesta con `token`, `rol`, `correo`. Error único genérico 401 (anti-enumeración de usuarios).
3. **Roles:** `Administrador.rol` (`SUPER_ADMIN`/`ADMIN_ACCESOS`/`ADMIN_SISTEMAS`, validado en service). `@PreAuthorize` en escrituras de empleados, departamentos, visitantes, historial, intentos, PDF, administradores y auditoría.
4. **Manejo de errores:** `GlobalExceptionHandler` con 400 (`IllegalArgumentException`), 401 (`BadCredentials`/`Authentication`), 403 (`AccessDenied`) y 500 sin filtrar mensajes internos.
5. **Dashboard real:** `DashboardResumenDTO` ampliado (`empleadosConPermiso`, `enPlanta`), `AccesosSemanaDTO` con `concedidos`/`denegados`, nuevos endpoints `/dashboard/departamentos` y `/dashboard/ultimos-accesos`. Eliminado `@CrossOrigin("*")`.
6. **Bootstrap sin hardcoding:** `DataInitializer` toma la contraseña de `ROOM911_SEED_PASSWORD` (o genera una aleatoria y la registra en el log); roles asignados a los tres administradores sembrados. `.env.example` y `docker-compose.yml` actualizados (backend exige `JWT_SECRET`).

#### Estado y pendiente:
* Backend compila (`./mvnw compile` ✅). **El frontend aún NO está adaptado** (sigue con mocks y login viejo `/admin/login`) — ver handoff, sección 2, para el orden de trabajo.
* Pendiente backend menor: `empleadosCount` en `DepartamentoResponseDTO`, `CorsConfig` por variable de entorno, evitar doble registro del filtro JWT, tests de seguridad, README.

---

### 🧹 Fase 10: Frontend sin mocks, backend menor y verificación integral de la integración de seguridad
* **Fecha:** 2026-08-31
* **Objetivo:** Completar la integración de seguridad punta a punta: eliminar todo mock del frontend, cerrar los ajustes menores del backend, ejecutar la suite de tests por primera vez y verificar E2E (Docker + login + dashboard). Detalle de la sesión anterior en [`HANDOFF_INTEGRACION_SEGURIDAD.md`](./HANDOFF_INTEGRACION_SEGURIDAD.md).

#### Cambios realizados:

1. **Frontend sin mocks (`pnpm build` ✅):**
   - `services/authService.ts` reescrito contra `POST /auth/login`; helpers `puedeGestionarPersonal()`, `puedeGestionarAdministradores()`, `esSuperAdmin()`. Sin credenciales demo.
   - `pages/Login.tsx` sin campos pre-rellenados; muestra el `mensaje` real del backend.
   - `services/api.ts` limpia sesión y redirige a `/login` ante 401 (excepto en el propio login).
   - `services/adminService.ts` solo contra `/administradores`; `contrasena` opcional en update; eliminar = DELETE real (sin toggle de estado).
   - `pages/Administradores.tsx` con gating por rol (eliminar solo SUPER_ADMIN, ConfirmDialog destructivo).
   - `services/dashboardService.ts` contra los 4 endpoints reales de `/dashboard`; errores propagados.
   - `services/empleadoService.ts` sin mocks; `cambiarEstado` = GET + PUT completo; rutas por PK (`dbId`).
   - `services/accesoService.ts` historial solo `/intento-acceso`; nuevo `descargarPdf()`.
   - `pages/EmpleadoCsvDrawer.tsx` reescrito: parser CSV real + `POST /empleados/importar/{departamentoId}` (FormData).
   - `pages/Departamentos.tsx` envía `descripcion` real; `services/departamentoService.ts` mapea `empleadosCount` del backend.
   - `routes/AppRoutes.tsx` con `React.lazy` + guardia `AdminRoute`; `Sidebar.tsx` con sesión real e ítem Administradores por rol.
   - **`src/data/mockData.ts` eliminado** — cero referencias a mocks en el repo frontend.

2. **Backend menor:**
   - `DepartamentoResponseDTO.empleadosCount` calculado con `countByDepartamentoIdAndActivoTrue` en todos los flujos del service.
   - `CorsConfig` lee `cors.allowed-origins` (sin orígenes hardcodeados).
   - `JwtAuthenticationFilter` sin `@Component`; registrado como `@Bean` en `SecurityConfig` (sin doble registro).
   - `AdministradorDTO.contrasena` opcional: obligatoria al crear, solo se actualiza si viene con valor.

3. **Tests verificados por primera vez (`./mvnw test` ✅ 13/13):**
   - Nuevos `JwtServiceTest`, `AuthControllerTest` (`@WebMvcTest` + `@MockitoBean`, Spring Boot 3.5) y `RoleSecurityTest` (401 sin token, 403 por rol, 201/204 según rol).
   - Eliminado `BackendApplicationTests` (stub generado que exige una PostgreSQL live; sin BD de pruebas en el proyecto, no podía ejecutarse nunca). La verificación de contexto completo queda cubierta por el E2E.

4. **Verificación E2E (Docker, ✅):**
   - Reiniciado el esquema dev obsoleto (contenía tablas del sistema `AdminUser` eliminado y administradores sin columna `rol`); `DataInitializer` resembró todo con `ROOM911_SEED_PASSWORD`.
   - `POST /api/auth/login`: 200 + token con `superadmin`; 401 genérico con credenciales inválidas; 401 sin token en `/api/dashboard/resumen`.
   - Con token: `/api/dashboard/resumen` con datos reales y `/api/departamentos` con `empleadosCount` distinto de 0.
   - Gating verificado: `j.reyes` (ADMIN_ACCESOS) consulta dashboard (200) pero `POST /api/administradores` responde 403.
   - Smoke GUI con `pnpm dev`: login redirige a `/dashboard`, panel con datos reales y tarjetas de departamentos mostrando el personal asignado real.

5. **Documentación:**
   - `README.md`: nuevas secciones de autenticación (`POST /api/auth/login`), roles y variables de seguridad (`JWT_SECRET`, `ROOM911_SEED_PASSWORD`, `CORS_ALLOWED_ORIGINS`, `VITE_API_URL`).

#### Deuda conocida (no bloqueante):
* `SimuladorAcceso.tsx` decide el resultado en el cliente y luego registra en el backend (la autorización real vive en `/api/acceso`); `CredencialDigital` usa la ruta demo `/credencial/EMP-0042`.

#### Adenda (2026-08-31, gestión de BD de desarrollo):
* Detectados dos PostgreSQL en el entorno: el contenedor Docker de compose (BD real de la app) y un clúster nativo en el host ocupando `localhost:5432` con datos obsoletos (tablas `admin_users`, `credenciales`, 9 departamentos viejos), que inducía a error al inspeccionar con pgAdmin.
* `docker-compose.yml` vuelve a publicar la BD del contenedor **solo en `127.0.0.1`** (puerto `DB_HOST_PORT`, por defecto 5432) para administrarla con pgAdmin/DBeaver; a diferencia del revertido, el bind queda restringido a localhost y es ajustable por `.env` si el puerto está ocupado.
* El clúster nativo debe deshabilitarse en el host (`sudo systemctl disable --now postgresql@16-main postgresql@18-main`) para liberar el 5432; el contenido viejo queda fuera de servicio junto con el servicio.
