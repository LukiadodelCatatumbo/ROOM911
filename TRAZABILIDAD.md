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
