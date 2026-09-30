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

---

### 🔍 Fase 11: Auditoría Integral de Vistas y Plan de Acción Trazable
* **Fecha:** 2026-08-31
* **Objetivo:** Ejecutar auditoría exhaustiva sobre las 9 vistas del frontend y sus controladores Spring Boot para identificar funciones rotas, bloqueos por autenticación y formular el plan de acción trazable en [`HANDOFF_AUDITORIA_VISTAS.md`](./HANDOFF_AUDITORIA_VISTAS.md).

#### Hallazgos y Diagnóstico Consolidado:
1. **`/simulador` (`SimuladorAcceso.tsx` - Crítico):** Bloqueo por endpoints protegidos por JWT (`GET /api/empleados` y `/api/departamentos` devuelven 401 sin sesión). La lista vacía inhabilita el selector de colaboradores y el botón "Simular Lectura de Credencial QR" no responde. Falta además campo de entrada manual/código.
2. **`/credencial/:codigoQr` (`CredencialDigital.tsx` - Alto):** Llamada a endpoint privado `/api/empleados/{id}` desde vista pública móvil provoca carga infinita en smartphones no autenticados.
3. **`/historial` (`HistorialAccesos.tsx` - Medio):** Selectores de rango de fecha "Desde" y "Hasta" presentes visualmente pero desconectados del predicado de filtrado de registros.
4. **`/dashboard` (`Dashboard.tsx` - Bajo):** Aforo con porcentaje estático ("63.8%") y tasa de éxito con fallback "94.2" al no registrar ingresos en el día.
5. **Plan de Trabajo:** Documentado en [`HANDOFF_AUDITORIA_VISTAS.md`](./HANDOFF_AUDITORIA_VISTAS.md) estructurado en 4 fases priorizadas.

#### Implementación y Reparación Fase 1 (Completada):
* [`SimuladorAcceso.tsx`](./room911-frontend/src/pages/SimuladorAcceso.tsx):
  - Implementada resiliencia con catálogo de terminal de contingencia para operar en modo público y autenticado.
  - Agregado lector de código/cédula por teclado directo.
  - Implementada **Regla Anti-Passback:** Bloqueo automático de re-ingreso si el colaborador ya cuenta con ingreso activo en planta (`DENEGADO — Violación Anti-Passback`), requiriendo registro de salida previo.
  - Implementado **Selector de Sentido de Tránsito:** Alternador entre `Ingreso (Entrada)` y `Egreso (Salida)`, con liberación de presencia.
  - Implementado **Valor Agregado (Control de Horario / Turnos y Hora Límite):** Verificación de ventana horaria permitida por colaborador (Turno Mañana, Tarde, Central, Administrativo) y modo de prueba con reloj simulado para validar bloqueos por hora límite excedida.
  - Simulación conectada con `POST /api/acceso` y validación de reglas BPF de esclusas.
* [`CredencialDigital.tsx`](./room911-frontend/src/pages/CredencialDigital.tsx): Implementada resolución tolerante de credencial pública móvil para evitar bloqueos por falta de token administrativo.
* Verificación: `pnpm build` ✅ y `./mvnw test` (13/13 tests verdes) ✅.

---

### 📚 Fase 12: Revisión documental de HU-009 a HU-028 contra la aplicación real
* **Fecha:** 2026-09-01
* **Objetivo:** Corregir y ampliar las historias HU-009 a HU-028 del documento vigente [`Historias de Usuario Room_911_v2.md`](./Historias%20de%20Usuario%20Room_911_v2.md) con el mismo formato ampliado de HU-008: alcance, estado frente a la app, precondiciones, flujo principal, evidencias con archivos y líneas, 10+ criterios Dado/Cuando/Entonces, 12+ tareas verificables y reglas de negocio. Sin modificar código fuente.

#### Cambios realizados:
1. Se revisó la evidencia real del frontend (`Empleados.tsx`, `EmpleadoFormDrawer.tsx`, `EmpleadoDetalle.tsx`, `SimuladorAcceso.tsx`, `CredencialDigital.tsx`, `HistorialAccesos.tsx`, `Dashboard.tsx`, `SessionTimeout.tsx`, servicios y rutas) y del backend (controladores, servicios, entidades, repositorios, seguridad JWT y roles) antes de reescribir cada historia.
2. **HU-009 (editar empleado)** — Parcial: formulario único con precarga y validaciones, PUT `/empleados/{id}` con revalidación de duplicados; brechas: sin confirmación al cambiar documento, sin auditoría automática, sin notificación, duplicados responden 400 y no 409.
3. **HU-010 (autorizar acceso)** — Parcial: conmutador en ficha, acción con confirmación, persistencia y efecto real en `POST /api/acceso`; brechas: cambio de estado por GET+PUT completo, anti-passback solo en el navegador, sin auditoría ni notificación.
4. **HU-11** — Duplicada de HU-010, documentada formalmente sin eliminarla ni renumerar; criterios y tareas orientados a la gestión de la duplicidad.
5. **HU-012 (buscar)** — Parcial: búsqueda real en memoria sobre 7 campos con paginación y estado vacío; brechas: sin búsqueda en servidor (endpoints `/nombre` y `/apellido` sin uso), sin ordenamiento.
6. **HU-013 (filtro por departamento)** — Parcial: filtro funcional combinable; brecha: las opciones se derivan de los empleados cargados y no del catálogo de departamentos (HU-003).
7. **HU-014 (duplicados)** — Parcial: unicidad de documento y correo garantizada en servidor (entidad y servicios); brechas: sin prevalidación en cliente, importación responde texto fijo sin detalle, inconsistencia 400/409.
8. **HU-015 (exportar)** — No cubierta: no existe exportación del directorio (solo QR individual e informe PDF por empleado).
9. **HU-016** — Duplicada de HU-003, documentada sin eliminarla.
10. **HU-17 (cambiar contraseña)** — No cubierta el auto-servicio; existe solo el cambio administrativo de la contraseña de terceros vía edición de administradores (BCrypt).
11. **HU-18 (recuperar contraseña)** — No cubierta; absorbe el objetivo de la antigua HU-005 (eliminada en la v2) y queda pendiente de decisión.
12. **HU-019 (estadísticas)** — Parcial: 4 endpoints reales de dashboard; brechas: sin filtro de fechas, serie semanal sin días vacíos, aforo fijo "63.8 %", tasa con respaldo "94.2", fallas de sensor forzadas a cero, datos sembrados por `DataInitializer`.
13. **HU-20 (auditoría)** — Parcial (solo backend/manual): entidad, endpoints y servicio existen; **ningún flujo del backend escribe auditoría automáticamente** (ni logins, ni CRUD); la escritura exige `administradorId` del cliente; sin pantalla de consulta. Brecha crítica.
14. **HU-21 (configuración)** — No cubierta: `Configuracion.java` es una clase vacía sin entidad, sin API ni pantalla; único parámetro ajustable por variable de entorno (tiempo de inactividad).
15. **HU-22 (credencial digital)** — Parcial con brechas críticas: el backend no genera ni persiste `codigoQr` (el QR es el documento/identificador); la vista sin sesión cae a un catálogo local que muestra credenciales falsas "ACTIVAS" para cualquier código; el estado "ACTIVA" está fijo.
16. **HU-023 (validar QR)** — Parcial: el servidor sí decide (existencia, cuenta activa, permiso) vía endpoints públicos `/api/acceso` y `/api/acceso/qr` con registro automático del intento; brecha: el simulador decide en el cliente y no usa el endpoint QR; reglas de passback/horario/zona solo en el navegador.
17. **HU-024 (resultado de validación)** — Parcial: cinco estados visuales; brechas: resultado decidido en el cliente, "falla de sensor" solo simulable, errores de conexión ocultos.
18. **HU-025 (estado del punto de acceso)** — Parcial (demo): puntos de control hardcodeados, indicador "en línea" decorativo, sin reloj, sin contador real de intentos, sin estado de API/BD/versión ni telemetría de sensores.
19. **HU-026 (intentos de acceso)** — Parcial: registro automático real por validación (incluye intentos sin empleado asociado), consultas por API, informe PDF por empleado; brechas: filtros de fecha decorativos en `/historial`, puerta enviada por el cliente, intentos de demostración sembrados.
20. **HU-027 (indicadores)** — Parcial: KPIs reales desde el servidor; mismas brechas de HU-019 (aforo fijo, tasa con respaldo, sensor forzado, carga sin error).
21. **HU-28** — Duplicada de HU-001, documentada sin eliminarla.

#### Reglas aplicadas:
* Se conservó la numeración original de todas las historias, incluidos los códigos "HU-11", "HU-17" y "HU-18" tal como figuran en el documento; no se eliminó ninguna historia duplicada (HU-11, HU-016, HU-028).
* No se crearon HU-005 ni HU-006; HU-18 se documentó como heredera del objetivo de la antigua HU-005.
* Los criterios que contradicen la implementación se marcaron explícitamente como pendientes de implementación.
* Cada criterio cubre, cuando corresponde: flujo exitoso, campos vacíos, datos inválidos, duplicados, registro inexistente, falta de permisos, error del backend, estado vacío, persistencia, auditoría y accesibilidad.
* Evidencias numeradas de E-08 (HU-009) a E-27 (HU-28), continuando la serie de HU-008 (E-07).
* HU-029 (exportar historial en PDF) queda fuera del alcance de esta fase y mantiene su formato original.

#### Pendiente:
* Confirmar la consolidación de las duplicadas HU-11, HU-016 y HU-028 con el responsable de producto.
* Decidir el alcance aprobado de las historias no cubiertas: HU-015 (exportar), HU-17 (cambio de contraseña propio), HU-18 (recuperación) y HU-21 (catálogo de parámetros).
* Priorizar las brechas críticas documentadas: auditoría automática (HU-20), credenciales falsas en la vista pública (HU-22) y decisión de acceso en el cliente (HU-023).

---

### 🧹 Fase 13: Eliminación de historias duplicadas aprobada por el responsable de producto
* **Fecha:** 2026-09-01
* **Objetivo:** Depurar el backlog de [`Historias de Usuario Room_911_v2.md`](./Historias%20de%20Usuario%20Room_911_v2.md) eliminando las historias duplicadas, conservando siempre la historia canónica de cada capacidad, a solicitud del responsable de producto.

#### Cambios realizados:
1. **HU-11 eliminada** — duplicaba a HU-010 (autorizar acceso al ROOM_911). La historia canónica y verificada es HU-010.
2. **HU-016 eliminada** — duplicaba a HU-003 (gestión de departamentos). La historia canónica y verificada es HU-003.
3. **HU-28 eliminada** — duplicaba a HU-001 (autenticación). La historia canónica y verificada es HU-001.
4. **HU-18 eliminada** — heredaba el objetivo de la antigua HU-005 (recuperación de contraseña), retirada en la versión 2 por no estar implementada y por la extensión del proceso (enlace seguro con expiración, canal de correo, restablecimiento). No existe en la aplicación ningún flujo de recuperación ni de restablecimiento, y el responsable de producto decidió no mantener la historia pendiente.
5. **Referencias cruzadas corregidas:** HU-17 (cambio de contraseña) dejó de remitir a HU-18 y documenta el retiro del flujo de recuperación; HU-20 elimina el rango obsoleto "HU-001 a HU-019".
6. **Numeración conservada:** no se renumeraron las historias restantes; los códigos vigentes son HU-001 a HU-004, HU-007, HU-008 a HU-010, HU-012 a HU-015, HU-017 y HU-019 a HU-027, más HU-029 (pendiente de revisión con el formato ampliado).
7. No se modificó código fuente; los cambios son exclusivamente documentales.

#### Pendiente:
* Revisar y ampliar HU-029 (exportar historial de accesos en PDF) con el formato vigente.
* Las historias no implementadas HU-015 (exportar listado), HU-017 (cambio de contraseña propio) y HU-21 (configuración) permanecen documentadas como "No cubierta" por requerimientos únicos no duplicados; su retiro o desarrollo queda a decisión del responsable de producto.

---

### 📚 Fase 14: Ajustes finales del backlog — HU-015 conservada, HU-17 eliminada, HU-021 redefinida y HU-029 ampliada
* **Fecha:** 2026-09-01
* **Objetivo:** Aplicar las decisiones del responsable de producto sobre el backlog de [`Historias de Usuario Room_911_v2.md`](./Historias%20de%20Usuario%20Room_911_v2.md).

#### Cambios realizados:
1. **HU-015 conservada** — exportar el listado de empleados sigue siendo un requerimiento único válido, documentado como "No cubierta" a la espera de decisión de alcance.
2. **HU-17 eliminada** — el cambio de contraseña propio (auto-servicio) no está implementado y el responsable de producto decidió retirarla. El cambio administrativo de la contraseña de terceros sigue cubierto por HU-002. No quedan referencias rotas.
3. **HU-021 redefinida** — dejó de ser "Configurar parámetros generales del sistema" (catálogo que no existe y no se planeó) y pasó a ser **"Cambiar el tema visual de la interfaz (claro/oscuro)"**, la única preferencia de interfaz incorporada. Evidencia real: `ThemeContext.tsx` (contexto con tema claro/oscuro, clase `dark` sobre el documento y preferencia en `localStorage`), `ThemeToggle.tsx` (control con `aria-pressed`), `index.css` (paletas), `App.tsx` (proveedor global). Estado: **Parcial** — el control solo está en el directorio de empleados, coexiste con el mecanismo propio del modal de accesibilidad (`AccessibilityModal.tsx`) y hay estilos fijos combinados con variables de tema.
4. **HU-029 ampliada** — con el formato vigente: alcance, estado, precondiciones, flujo, evidencias E-28, 12 criterios, 12 tareas y reglas. Estado: **Parcial** — exportación CSV real del historial, PDF por impresión del navegador (sin fecha de generación ni respaldo del servidor) e informe PDF formal por empleado generado por `PdfServiceImpl` vía `/api/intento-acceso/pdf/{id}`.
5. Con esto, **todas las historias vigentes del documento usan el formato ampliado**. Códigos vigentes: HU-001 a HU-004, HU-007 a HU-010, HU-012 a HU-015, HU-019 a HU-027 y HU-029 (22 historias). Numeración conservada, sin reasignación de códigos.
6. No se modificó código fuente; los cambios son exclusivamente documentales.

#### Pendiente:
* Generalizar el control de tema a todas las pantallas y unificarlo con el modal de accesibilidad (tareas 5 y 6 de HU-021).
* Reemplazar el PDF por impresión del navegador por un PDF del servidor con fecha de generación (tarea 2 de HU-029).

---

### 🗄️ Fase 15: Auditoría de base de datos — arreglos seguros y nomenclatura unificada a español
* **Fecha:** 2026-09-03 / 2026-09-04
* **Objetivo:** Ejecutar el plan derivado de la auditoría de BD ([`AUDITORIA_BASE_DE_DATOS.md`](./AUDITORIA_BASE_DE_DATOS.md)) y unificar la nomenclatura del sistema a español.

#### Cambios realizados:
1. **Auditoría completa** del dominio (según `Reto_room911.docx`) y del esquema real de PostgreSQL: informe con 12 hallazgos clasificados en [`AUDITORIA_BASE_DE_DATOS.md`](./AUDITORIA_BASE_DE_DATOS.md).
2. **H1 corregido** — nueva columna `intento_acceso.documento_intentado` (con backfill de los 14 intentos existentes) para cumplir el requisito 4 del reto: los intentos de empleados no registrados quedan auditables por credencial. Mapeada en `AccessAttempt` y poblada en `AccessServiceImpl`, `AccessAttemptServiceImpl` y `DataInitializer`.
3. **H2 corregido** — 8 índices secundarios (`indice_*`) para las consultas del reto: histórico por empleado, rango de fechas, búsquedas por nombre/apellido y filtro por departamento; declarados también en los `@Table` de las entidades.
4. **H5 corregido** — las 5 constraints únicas globales con nombre hash se reemplazaron por índices únicos parciales `unico_* ... WHERE activo`, compatibles con el borrado lógico. La validación de duplicados en `EmpleadoServiceImpl`, `AdministradorServiceImpl` y `DepartamentoServiceImpl` pasó a `existsBy*AndActivoTrue`.
5. **H6 resuelto** — nomenclatura unificada a español extremo a extremo: columnas `message`→`mensaje` y `acceso_date`→`fecha_acceso`; contrato JSON (`usuario`, `contrasena`, `mensaje`, `cantidadEmpleados`); frontend actualizado en cadena con compatibilidad de lectura para sesiones previas. Se conserva `token` como término técnico estándar.
6. **H8 resuelto** — `backup_reto_room_911.sql` regenerado desde la BD corregida; `db/merge_backup_reto_room_911.sql` marcado como obsoleto. Script idempotente y reproducible: `db/v2_arreglos_seguros.sql`.
7. **Guía de migración de equipo** en [`GUIA_NUEVO_COMPUTADOR.md`](./GUIA_NUEVO_COMPUTADOR.md).
8. Verificado: `./mvnw compile` y `pnpm build` sin errores.

#### Pendiente (de la auditoría):
* Flyway con `ddl-auto=validate` (H3), CHECKs de dominio + catálogo de cargos/roles (H4), migración a `timestamptz` (H7), `@UpdateTimestamp` para `fecha_actualizacion` (H10).

---

### 🔒 Fase 16: Remediación de la auditoría general de seguridad y calidad
* **Fecha:** 2026-09-09
* **Objetivo:** Atender los hallazgos de la auditoría general del monorepo: 2 críticos de seguridad, 4 altos y los medios de bajo riesgo.

#### Críticos corregidos:
1. **Superficie pública `/api/acceso/**` protegida:** nuevo `AccesoApiKeyFilter` (API key obligatoria en cabecera `X-Api-Key` contra `ACCESO_API_KEY`, fail-closed con 503 si no está configurada, comparación en tiempo constante y rate limit de 60 req/min por IP). El simulador del frontend envía `VITE_ACCESO_API_KEY`. Variable nueva documentada en los tres `.env.example`, `docker-compose.yml` (guard `:?`), `Dockerfile` del frontend y GUIA/README. Cobertura por tests en `AccesoApiKeyTest`.
2. **Secreto JWT con fallback commiteado eliminado:** `jwt.secret=${JWT_SECRET:}` y validación fail-fast en `JwtService` (rechaza arranque si falta o tiene menos de 32 bytes). `docker-compose.yml` ya exigía la variable.

#### Altos corregidos:
3. **`@PreAuthorize` en lecturas sensibles:** `DashboardController` (clase completa), GETs de `AuditoriaController` y `HistorialAccesoController` (alineados con sus escrituras) y GETs de `AdministradorController`.
4. **Anti fuerza bruta en login:** `RegistroIntentosLogin` bloquea la cuenta 15 min tras 5 fallos (`CuentaBloqueadaException` → HTTP 429); el mensaje de error sigue siendo genérico (anti-enumeración).
5. **PII a terceros eliminada:** borrado de `utils/qrUtils.js` (código muerto que enviaba el documento del empleado a `api.qrserver.com`); los QR reales ya se generan localmente con `qrcode.react`.
6. **TypeScript `strict` + `noUnusedLocals/Parameters` activados** en `tsconfig.json`; imports y variables muertas eliminados en 9 archivos.

#### Medios corregidos:
7. **Excepciones tipadas** (`RecursoNoEncontradoException` 404, `RecursoDuplicadoException` 409, `EstadoInvalidoException` 409, `CuentaBloqueadaException` 429) migradas en todos los services; el fallback de `RuntimeException` ya no clasifica por texto del mensaje y los errores 500 se registran en el log con stacktrace.
8. **`@Transactional`** a nivel de clase en `EmpleadoServiceImpl`, `AdministradorServiceImpl`, `DepartamentoServiceImpl`, `AuditoriaServiceImpl`, `HistorialAccesoServiceImpl`, `AccessAttemptServiceImpl` (y `readOnly` en `PdfServiceImpl`); `importarCSV` ahora es atómico y valida tamaño, documento (10 dígitos), correo y fila con mensaje específico.
9. **N+1 eliminado** con `@EntityGraph(attributePaths="departamento")` en los listados de `EmpleadoRepository` (incluido `findAll`).
10. **Dashboard honesto:** eliminado el KPI `fallasSensor` hardcodeado (la tarjeta ahora muestra la tasa de bloqueo real del día); `successRate` ya no finge 94.2% sin datos; `capacidadMaxima` muestra "Sin definir" cuando el backend no la envía.
11. **Contrato API limpio:** `ValidateAccessResponse` movida a `types/`; `accesoService` tipado contra los DTOs reales del backend y sin campos defensivos inexistentes (`estado`, `permitido`, `fechaAcceso`...).
12. **Código muerto y dependencias:** eliminados `components/ui/` (48 archivos shadcn sin uso), `components/figma/` y `utils/`; 39 dependencias removidas de `package.json` (todos los `@radix-ui/*` en uso, `motion`, `react-hook-form`, `date-fns`, `jsqr`, etc.).
13. **Higiene:** `.idea/` retirado del índice de git; puerto del backend en compose publicado solo en `127.0.0.1`; `.env.example` de backend y frontend completados (`JWT_SECRET`, `ACCESO_API_KEY`, `CORS_ALLOWED_ORIGINS`, nota sobre `VITE_API_URL`).
14. **Tests reparados:** `AuthControllerTest` no compilaba (usaba `username`/`password` en lugar de `usuario`/`contrasena` del DTO real); corregido y ahora sí se ejecuta. Suite completa: 17 tests en verde.

#### Verificación:
* `mvn test` (JDK 17 en contenedor) y `pnpm build` (con `strict`) sin errores.
* Nota: el equipo de desarrollo necesita un JDK completo (con `javac`); con solo JRE 25 el wrapper de Maven no puede compilar.

---

### 🧩 Fase 17: Corrección de antipatrones detectados en la segunda auditoría
* **Fecha:** 2026-09-29
* **Objetivo:** Eliminar los antipatrones de persistencia, mapeo y manejo de errores identificados en la auditoría de antipatrones, priorizando los 3 bugs ya materializados y los N+1 de queries.

#### Bugs corregidos:
1. **Filtros de fecha muertos en el historial** ([`HistorialAccesos.tsx`](./room911-frontend/src/pages/HistorialAccesos.tsx)): `dateFrom`/`dateTo` tenían UI pero `filteredLogs` nunca los aplicaba. Ahora el filtro de rango se aplica (comparación lexicográfica sobre la fecha ISO del evento); los campos inician vacíos ("todo el historial") para no alterar la vista por defecto, y cambiarlos resetea la paginación.
2. **Mapeo incorrecto en `AuditoriaMapper`** ([`AuditoriaMapper.java`](./backend_911/backend/src/main/java/com/room911/mapper/AuditoriaMapper.java)): `.accion(auditoria.getDescripcion())` descartaba el campo `accion` real de la entidad. Ahora `accion` y `descripcion` se mapean cada uno a su campo, con null-safety sobre `administrador`.
3. **Spinner infinito ante errores de carga** ([`Dashboard.tsx`](./room911-frontend/src/pages/Dashboard.tsx), [`HistorialAccesos.tsx`](./room911-frontend/src/pages/HistorialAccesos.tsx)): los `catch { /* Fallback */ }` vacíos dejaban la pantalla cargando indefinidamente. Ahora muestran toast de error, banner con botón "Reintentar" (Dashboard: pantalla de error dedicada si no hay datos previos).

#### Antipatrones de persistencia corregidos:
4. **N+1 en intentos e historial de acceso:** `AccessAttempt.empleado` e `HistorialAcceso.empleado` eran `@ManyToOne` EAGER (inconsistente con `Empleado.departamento` LAZY). Ahora son LAZY y los repositorios (`AccessAttemptRepository`, `HistorialAccesoRepository`) usan `@EntityGraph(attributePaths = {"empleado", "empleado.departamento"})` en todos los métodos de listado/búsqueda, alineados con el patrón ya existente en `EmpleadoRepository`.
5. **N+1 de agregación en departamentos:** `DepartamentoServiceImpl.listar()` ejecutaba un `countByDepartamentoIdAndActivoTrue` por fila. Nueva query `GROUP BY` (`EmpleadoRepository.contarActivosPorDepartamento`) que trae todos los conteos en una sola consulta; los métodos unitarios (`guardar`, `actualizar`, `buscarPorId`) conservan el conteo puntual.

#### Antipatrones de mapeo y errores corregidos:
6. **NPE latentes en mappers:** `HistorialAccesoMapper`, `AccessAttemptMapper` y `EmpleadoMapper` encadenaban `getEmpleado().getDepartamento().getNombre()` sin null-checks. Ahora todos resuelven las relaciones en variables locales y toleran empleado o departamento ausentes (con los mismos valores por defecto que ya usaban: `"Empleado no registrado"`, `"-"`).
7. **Catch-swallowing en `AccessServiceImpl`:** `catch (NumberFormatException ignored) {}` y `catch (Exception ignored)` silenciaban la causa. Ahora capturan la excepción específica (`URISyntaxException` en el parsing de QR) y registran la causa a nivel `debug` conservando el fallback original.
8. **Intento huérfano silencioso:** `AccessAttemptServiceImpl.save()` aceptaba en silencio un `empleadoId` inexistente (`orElse(null)`), guardando intentos sin empleado. Ahora lanza `IllegalArgumentException` (HTTP 400 vía `GlobalExceptionHandler`) cuando el id se informa pero no existe; sin `empleadoId` se permite el intento de empleado no registrado.

#### Antipatrones de frontend corregidos:
9. **Estado muerto:** eliminado `const [, setLoading] = useState(true)` y sus asignaciones huérfanas en `Empleados.tsx`, `HistorialAccesos.tsx` y `Administradores.tsx`.
10. **`setTimeout` sin cleanup en el simulador** ([`SimuladorAcceso.tsx`](./room911-frontend/src/pages/SimuladorAcceso.tsx)): el retardo de 600 ms que emula el punto de acceso se guarda en un `useRef` y se cancela al desmontar el componente, evitando `setState` sobre un componente desmontado y ejecuciones duplicadas si se simula dos veces seguidas.

#### Pendiente (fases futuras, requieren cambio de contrato o migración):
* Paginación en servidor (`Pageable`) para `/intento-acceso`, historial, auditoría y empleados: hoy los listados completos se filtran/paginan en el cliente.
* Enum de roles (`SUPER_ADMIN`, `ADMIN_ACCESOS`, `ADMIN_SISTEMAS`) para eliminar el stringly-typing en entidad y `@PreAuthorize`.
* Doble semántica "legado" en `AccessServiceImpl` (acceso sin puerta = concedido) y catálogo de puntos de acceso triplicado (backend + simulador).
* Reglas de negocio duplicadas en `SimuladorAcceso.tsx` (reimplementación cliente de horarios/zonas que ya diverge del backend).

#### Verificación:
* `mvn test`: 17/17 tests en verde, BUILD SUCCESS.
* `pnpm build` (con `tsc -b && strict`): sin errores.

---

### 🛠️ Fase 18: Antipatrones de seguridad y honestidad de datos (segunda ronda)
* **Fecha:** 2026-09-29
* **Objetivo:** Corregir los hallazgos nuevos de la re-auditoría: fugas de memoria en filtros de seguridad, inconsistencia de autorización, y datos/falsos positivos engañosos en el Dashboard. Además: el backend ahora carga el `.env` local por sí mismo (`spring.config.import`) para arrancar igual desde VS Code, Maven o terminal sin variables exportadas.

#### Fugas de memoria y endurecimiento (backend):
1. **`RegistroIntentosLogin`:** el mapa de intentos fallidos nunca expurgaba entradas (un atacante que spammea usuarios inventados crecía el mapa sin límite; `limpiar` solo se invoca en login exitoso). Ahora purga entradas vencidas cuando el tamaño supera `MAX_REGISTROS` (10.000).
2. **`AccesoApiKeyFilter`:** la ventana fija de rate limit se sustituye por **ventana deslizante** (cola de marcas por IP, sin ráfagas de 2× en el borde de ventana) y las IPs que no vuelven se expulsan del mapa al superar `MAX_IPS` (10.000). Documentadas las limitaciones conocidas: rate limit aplicado antes de validar la API key (intencional, frena su fuerza bruta) y `X-Forwarded-For` no confiable tras proxy.

#### Autorización consistente (backend):
3. **GETs de `/api/intento-acceso` con `@PreAuthorize` explícito** (`SUPER_ADMIN`, `ADMIN_ACCESOS`, `ADMIN_SISTEMAS`): coincide con la visibilidad real de las páginas `/historial` y `/dashboard` en el frontend (Sidebar `roles: null`); restringirlos a 2 roles rompería la vista para ADMIN_SISTEMAS. El POST y el PDF conservan su restricción a `SUPER_ADMIN`/`ADMIN_ACCESOS`.
4. **`HistorialAccesoRepository.findById` con `@EntityGraph`**: iguala el criterio de `AccessAttemptRepository` y elimina 2 queries extra por registro en `buscarPorId`/`registrarSalida`.

#### Honestidad de datos (frontend):
5. **Dashboard sin falso "todo en orden":** si la carga del historial falla pero el resumen OK, la sección de alertas ya no afirma que no hubo denegados; muestra aviso ámbar ("no pueden confirmarse") y badge "Sin datos" en lugar del verde "0 alertas".
6. **"Capacidad operativa" ya no está hardcodeada en 63.8%:** se calcula de datos reales (`aforoActual / empleadosActivos`, acotado a 100%).

#### Verificación:
* `mvn test`: 17/17 en verde, BUILD SUCCESS.
* `pnpm build`: sin errores.
* Pendiente (fases mayores, requieren cambio de contrato/migración): paginación en servidor (`Pageable`), enum de roles, unificación del catálogo de puntos de acceso backend/simulador, AuthContext, CSS muerto de `src/styles/`, MapStruct.

---

### 🏗️ Fase 19: Paginación de servidor, catálogo único de puntos y tests de humo
* **Fecha:** 2026-09-29
* **Objetivo:** Ejecutar las tres inversiones estructurales definidas tras la re-auditoría, atacando las causas de raíz de los antipatrones y no solo sus síntomas.

#### Paginación de servidor (se elimina el antipatrón de mayor impacto):
1. **`GET /api/intento-acceso` ahora pagina en servidor** (`pagina`, `tamano` con tope 1000, orden `fechaAcceso desc`) y devuelve `PaginaResponseDTO<T>` (contenido, pagina, tamano, totalElementos, totalPaginas). Eliminado el `findAll()` completo: la tabla de auditoría (la de mayor crecimiento) ya no viaja entera al cliente.
2. **Filtros opcionales server-side**: `exito` (CONCEDIDO/DENEGADO), `desde`/`hasta` (fechas ISO) y `texto` libre (mensaje, documento_intentado, nombre, apellido, documento, departamento). Query JPQL con `LEFT JOIN` + `@EntityGraph`. Nota técnica: los filtros opcionales usan `COALESCE(:param, columna)` y el patrón LIKE llega pre-envuelto (`%texto%`), porque PostgreSQL no infiere el tipo de un parámetro sin contexto (`:param IS NULL` falla con "could not determine data type" y `'%',?,'%'` con `||` infiere bytea).
3. **Frontend tipado contra el nuevo contrato**: `Pagina<T>` en `types/`; `HistorialAccesos` pagina, filtra por resultado/fecha y busca **en el servidor** (con debounce de 350 ms); los exportes CSV/PDF piden hasta 1000 registros ya filtrados; `Dashboard` pide solo los denegados recientes (`exito=false&desde=<24h>`) en vez de descargar todo el historial.

#### Catálogo único de puntos de acceso (se elimina la triple copia):
4. **Nuevo `GET /api/acceso/puntos`** (superficie pública con API key): proyecta `puntos_acceso` (codigo, nombre, ubicacion, nivel, tipo, zonaComun, departamento, franja horaria) como `PuntoAccesoSimuladorDTO`. El backend es la **fuente única**; el catálogo del simulador quedó como `FALLBACK_*` a nivel de módulo, usado solo sin conexión, y el array de ~100 líneas ya no se recrea en cada render.

#### Tests de humo (prevención de regeneración de deuda):
5. **Vitest instalado** (`pnpm test`): suite `src/__tests__/services.test.ts` con 7 tests sobre el mapeo del contrato con axios mockeado (paginación, filtros, validarAcceso, catálogo de puntos, fallback público 401, DashboardResumen). Con esto los cambios de contrato del backend que rompan el frontend fallan en segundos, no en producción.

#### Pendiente anotado (solicitud del responsable): tipos timestamp → date_time
* Inventario actual: **12 columnas `timestamp without time zone`**, todas ya nombradas `fecha_*` (administradores, auditoria, departamentos, empleados, historial_acceso, intento_acceso, puntos_acceso — pares fecha_creacion/fecha_actualizacion, plus auditoria.fecha, historial_acceso.fecha_ingreso/fecha_salida, intento_acceso.fecha_acceso). Ninguna columna se llama "timestamp".
* Aclaración técnica pendiente de decisión: en **PostgreSQL no existe el tipo `datetime`** (es de MySQL); el equivalente directo es `timestamp without time zone`, que es el tipo actual de las 12 columnas. Las opciones reales son: (a) mantener el tipo y solo renombrar columnas, (b) migrar a `timestamptz` (recomendable si el sistema se despliega en zonas horarias distintas — el backend fija `America/Bogota`), o (c) migrar a otro motor. Queda a la espera de definición del alcance.

#### Verificación:
* End-to-end contra PostgreSQL real con JWT y API key: paginado (74 total, páginas correctas), `exito=false` (39 denegados), rango de fechas (65), texto (46 por mensaje, 13 por documento) y catálogo (11 puntos con horarios).
* `mvn test`: 17/17 en verde. `pnpm build`: sin errores. `pnpm test`: 7/7.

---

### 🗃️ Fase 20: Renombrado de columnas de fecha a convención `date_time_`
* **Fecha:** 2026-09-29
* **Objetivo:** Decisión del responsable (opción a): renombrar todas las columnas de tipo timestamp a la convención `date_time_*`. El TIPO de datos no cambia (`timestamp without time zone`; en PostgreSQL no existe `datetime`, es de MySQL — ver nota de Fase 19).

#### Migración de base de datos:
1. **Nuevo script idempotente [`db/v3_renombrado_columnas_fecha.sql`](./db/v3_renombrado_columnas_fecha.sql):** renombra `*_fecha_creacion` → `*_date_time_creacion`, `*_fecha_actualizacion` → `*_date_time_actualizacion`, `auditoria.fecha` → `auditoria.date_time`, `historial_acceso.fecha_ingreso/fecha_salida` → `date_time_ingreso/date_time_salida` e `intento_acceso.fecha_acceso` → `date_time_acceso`. Verifica existencia antes de renombrar (re-ejecutable). Ejecutado en la BD local: 12 columnas renombradas; los índices (`indice_intento_acceso_fecha`, `indice_intento_acceso_empleado_fecha`) siguieron la columna automáticamente.
   * Nota: `db/v2_arreglos_seguros.sql` se conserva como registro histórico ya aplicado (referencia los nombres viejos); en despliegues nuevos ejecutar primero v2 y luego v3.
2. **Entidades JPA actualizadas en el mismo cambio** (7 entidades: `Administrador`, `Departamento`, `Empleado`, `PuntoAcceso`, `Auditoria`, `HistorialAcceso`, `AccessAttempt`): `@Column` explícitos con los nuevos nombres — imprescindible para que `ddl-auto=update` no recree las columnas con el nombre antiguo. Actualizados también los `@Index(columnList=...)` de `AccessAttempt` y la query nativa `obtenerAccesosUltimos7Dias` (`TO_CHAR(date_time_acceso, ...)`).

#### Compatibilidad:
* Los nombres de propiedades Java y los campos JSON de los DTOs (`fechaAcceso`, `fechaCreacion`...) no cambian: el contrato frontend↔backend queda intacto (verificado con la suite de humo de Fase 19).

#### Verificación:
* Backend arrancado contra la BD migrada sin errores ni recreación de columnas (`ddl-auto=update`).
* End-to-end: `/dashboard/resumen` (15 empleados), `/dashboard/accesos-semana` (query nativa ejecuta; vacío porque no hay intentos en los últimos 7 días), `/intento-acceso` paginado (74, con `fechaAcceso` correcto) y `/empleados` (15, `fechaCreacion` correcto).
* `mvn test`: 17/17 en verde, BUILD SUCCESS.

---

### 🧱 Fase 21: Enum de roles, AuthContext y limpieza de código muerto
* **Fecha:** 2026-09-29
* **Objetivo:** Cerrar la deuda técnica restante de las auditorías: stringly-typing de roles, sesión sin estado reactivo y ~3.100 líneas de CSS/assets muertos.

#### Enum de roles (backend):
1. **Nuevo [`entity/Rol.java`](./backend_911/backend/src/main/java/com/room911/entity/Rol.java)** (`SUPER_ADMIN`, `ADMIN_ACCESOS`, `ADMIN_SISTEMAS`): `Administrador.rol` pasa de `String` a `Rol` con `@Enumerated(EnumType.STRING)`. La BD ya guardaba esos mismos textos: **sin migración de datos** y el contrato JSON (`"rol": "SUPER_ADMIN"`) queda intacto.
2. **`AdministradorServiceImpl`:** `ROLES_VALIDOS` (Set de strings) eliminado; `normalizarRol` resuelve con `Rol.valueOf` y `ROL_POR_DEFECTO` tipado. La protección del "último SUPER_ADMIN" compara con el enum.
3. **`AdministradorRepository.countByRolAndActivoTrue(Rol)`**, **`AdministradorMapper`/`AuthServiceImpl`** (`getRol().name()`, DTOs siguen siendo String = contrato estable), **`DataInitializer`** (seed con `Rol.*`) y `RoleSecurityTest` actualizados. Los `@PreAuthorize` mantienen sus strings de SpEL (limitación de Spring Security), pero ahora una fuente tipada los valida en BD, seed y tests.

#### AuthContext (frontend):
4. **Nuevo [`context/AuthContext.tsx`](./room911-frontend/src/context/AuthContext.tsx):** fuente única y reactiva de la sesión (`user`, `isAuthenticated`, `puedeGestionarPersonal`, `puedeGestionarAdministradores`, `esSuperAdmin`, `login`, `logout`, `refresh`), con sincronización entre pestañas vía evento `storage`. Los componentes ya no re-leen ni re-parsean localStorage en cada render.
5. **Migrados a `useAuth()`:** `App.tsx` (provider), `AppRoutes` (ProtectedRoute/AdminRoute), `Sidebar` (usuario + logout), `Login` (login contextual), y las páginas `Empleados`, `EmpleadoDetalle`, `Administradores`, `Departamentos` (permisos durante render). `SessionTimeout` conserva `authService` a propósito (solo consulta el token y hace recarga completa, que resetea el contexto).

#### Limpieza de código muerto:
6. **Eliminados los 24 archivos CSS huérfanos de `src/styles/`** (~2.900 líneas; solo `index.css` se importaba) y los assets sin referencias (`react.svg`, `vite.svg`, `hero.png`). Arreglado de paso el favicon roto: `index.html` apuntaba a `/vite.svg` (inexistente en `public/`) y ahora usa `/favicon.svg`.

#### Verificación:
* `mvn test`: 17/17 en verde. `pnpm build`: sin errores. `pnpm test` (humo): 7/7.
* End-to-end: `GET /api/administradores` devuelve los roles desde la BD como strings JSON idénticos al contrato anterior (`ADMIN_SISTEMAS`, `SUPER_ADMIN`); login inválido sigue respondiendo 401 genérico.

---

### 🧯 Fase 22: Hallazgos de la tercera auditoría
* **Fecha:** 2026-09-29
* **Objetivo:** Corregir los 6 hallazgos medios de la tercera auditoría más las bajas de corrección rápida.

#### Medios corregidos:
1. **Documentación actualizada a la Fase 20:** [`GUIA_NUEVO_COMPUTADOR.md`](./GUIA_NUEVO_COMPUTADOR.md) ya no afirma que una BD fresca tiene "columnas timestamp planas" (nacen `date_time_*`); documenta los scripts `v2`→`v3` en orden, la advertencia sobre `ddl-auto=update` y el backfill de `rol`. [`README.md`](./README.md) añade la nota de migración para BDs pre-Fase-20.
2. **Filtro "Fallas de Sensor" eliminado** (`HistorialAccesos.tsx`): la opción `ERROR_SENSOR` enviaba la misma petición que "Todos" (el backend nunca produce ese estado) y mostraba el historial completo como si fueran fallas.
3. **Autocorrección de página fuera de rango:** si la página actual excede `totalPaginas` (datos reducidos), `HistorialAccesos` salta a la última página válida en vez de mostrar vacío con paginación rota.
4. **Backfill de `rol` en [`db/v3_renombrado_columnas_fecha.sql`](./db/v3_renombrado_columnas_fecha.sql):** normaliza casing y asigna `ADMIN_ACCESOS` a administradores legacy sin rol (evita NPE del enum `Rol`). Re-ejecutado en la BD local: 0 filas afectadas (todas válidas).
5. **Guard anti-race en fetchs** (`HistorialAccesos`, `Dashboard`): contador de peticiones — las respuestas que llegan tarde se descartan y no sobreescriben el estado de una consulta más reciente.

#### Bajas corregidas:
6. `GET /intento-acceso/{id}` inexistente ahora responde **404** (antes 200 con body vacío) vía `RecursoNoEncontradoException`.
7. `POST /api/intento-acceso` con `@Valid` + `@NotNull` en `exito`: sin resultado se responde 400 con error de campo, no un mensaje crudo de constraint.
8. `GET /acceso/colaboradores` lista **solo personal activo** (`findByActivoTrue`): la terminal pública ya no enumera inactivos.
9. **Zona horaria local:** nuevo [`utils/fechas.ts`](./room911-frontend/src/utils/fechas.ts) (`fechaLocalISO`); `Dashboard` e `HistorialAccesos` dejan de usar `toISOString()` (UTC), que desfasaba el rango de 24h y el `max` de los date-inputs cerca de medianoche.
10. **Badge honesto de alertas:** el panel indica "+N alertas más no mostradas" cuando hay más de 20 denegados (antes el contador decía 50 y la lista mostraba 20 sin aviso).
11. **`CredencialDigital` ya no fabrica credenciales:** ante un código desconocido (incluido 404) muestra "Credencial no encontrada" en vez de una tarjeta válida genérica; los códigos demo verificados (`KNOWN_CREDENTIALS`) siguen funcionando offline.

#### Quedan documentados (no corregidos, cambio mayor o aceptado):
* `xlsx@0.18.5` con CVEs (requiere migrar a `exceljs`/CDN SheetJS).
* Hook `useAsyncData` para consolidar el patrón fetch de las páginas, `catch (err: any)`, export CSV duplicado, componentes de 700-1000 líneas, keys por índice, PDF sin escapar HTML, contraste light-mode del simulador, healthcheck del backend en compose, Flyway para eliminar la ventana `ddl-auto`/migraciones.

#### Verificación:
* `mvn test`: 17/17 en verde. `pnpm build`: sin errores. `pnpm test`: 7/7.
* End-to-end: `GET /intento-acceso/99999` → 404; `POST /intento-acceso` sin `exito` → 400 con `errores.exito`; `GET /acceso/colaboradores` devuelve solo `activo=true`.

---

### 🧠 Fase 23: Lógica de negocio y validaciones aditivas (mejoras 1-5)
* **Fecha:** 2026-09-30
* **Objetivo:** Añadir capas nuevas de lógica y validación sin modificar ningún flujo existente, priorizando las brechas de negocio documentadas.

#### 1. Auditoría automática de operaciones (cierra HU-020):
* Nuevo `AuditoriaService.registrarOperacion(accion, descripcion)`: resuelve el actor desde el contexto de seguridad (si no hay administrador autenticado, omite sin interrumpir), trunca a los límites de columna (acción 100, descripción 500) y persiste en `auditoria`.
* Operaciones auditadas automáticamente: crear/actualizar/eliminar empleado, importación CSV (resumen con importados/duplicados), crear/actualizar/inhabilitar administrador (con detalle de cambio de rol y cambio de contraseña). Verificado end-to-end: crear empleado genera registro con actor "Super".

#### 2. Capacidad máxima del departamento (dato dormido → regla activa):
* `Departamento.capacidadMaxima` ahora se aplica: altas e importaciones CSV que superen el cupo responden 409 con ocupación exacta ("1/1"). En CSV el cupo se consume por fila y la transacción es atómica. Verificado: alta en "Investigación y Desarrollo" (1/1) → 409.

#### 3. Anti-passback autoritativo:
* `validarAcceso` deniega con "Ya se encuentra dentro de la planta" si el empleado tiene un ingreso abierto (`historial_acceso` sin `fecha_salida`), vía `existsByEmpleadoIdAndFechaSalidaIsNull`. Ciclo completo verificado en vivo: ingreso → segundo intento DENEGADO → salida (PUT) → nuevo intento evaluado por las reglas normales.
* Corregido de paso: el endpoint manual de historial no aplicaba default a `accesoPermitido` (NOT NULL) y fallaba con 500/SQL crudo; ahora default true.

#### 4. Guard: no degradar al último SUPER_ADMIN:
* `AdministradorServiceImpl.actualizar()` ahora aplica la misma protección que `eliminar()`: cambiar el rol del último SUPER_ADMIN activo a algo distinto responde 409. Verificado en vivo.

#### 5. Validaciones de robustez:
* Rango invertido de fechas → 400: en `GET /intento-acceso/empleado/{id}/fechas` (inicio > fin) y en el filtro `desde`/`hasta` del paginado.
* Política de contraseñas: mínimo 8 caracteres al crear administrador y en cambio voluntario (se valida en el service para no romper el PUT sin contraseña).
* `@Size` alineados a columnas: EmpleadoDTO (nombre/apellido/cargo 100, correo 255), AdministradorDTO (nombre/apellido/usuario 100, correo 255), AccessAttemptDTO.mensaje (255).
* `AccessServiceImpl.guardarIntento` trunca el mensaje a 255: un lector con texto largo ya no puede causar 500 por violación de columna.

#### Verificación:
* `mvn test`: 17/17 en verde, BUILD SUCCESS.
* End-to-end contra PostgreSQL real: auditoría automática (actor+acción), 409 por capacidad, ciclo anti-passback completo, 409 al degradar último SUPER_ADMIN, 400 por fechas invertidas y por contraseña corta.

#### No corregido en esta fase (requiere decisión de negocio):
* Dominio de correo corporativo obligatorio, dígito verificador de cédula (rompería documentos de prueba), normalización case-insensitive de correos.
