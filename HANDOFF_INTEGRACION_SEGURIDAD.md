# 🔖 HANDOFF — Integración de Seguridad y Eliminación de Mocks (ROOM911)

* **Fecha de corte:** 2026-08-31 (segunda sesión)
* **Estado del repo:** Sección 2 (frontend) COMPLETA y `pnpm build` ✅ verificado. Sección 3 (backend menor) COMPLETA en código, pero **`./mvnw compile` y `./mvnw test` NO verificados aún** (la ejecución se canceló). Sin commitear.

---

## ✅ 1. Backend seguridad (sesión anterior — estable)

- JWT real: `security/JwtService.java` (HS256, claims `sub`+`rol`), `security/JwtAuthenticationFilter.java`, `POST /api/auth/login` (`AuthController` + `AuthServiceImpl` contra tabla `administradores`).
- `SecurityConfig`: stateless; públicos solo `/api/auth/login` y `/api/acceso/**`. `@EnableMethodSecurity`.
- Roles (`@PreAuthorize`): escrituras empleados/departamentos/visitantes/historial/intentos/PDF → `SUPER_ADMIN, ADMIN_ACCESOS`; administradores crear/actualizar → `SUPER_ADMIN, ADMIN_SISTEMAS`; eliminar administrador → `SUPER_ADMIN`; dashboard GET → cualquier autenticado.
- `Administrador` con campo `rol` (AdminUser eliminado). Login 401 genérico anti-enumeración.
- Dashboard: `/api/dashboard/{resumen,accesos-semana,departamentos,ultimos-accesos}`.
- `DataInitializer`: seed desde `ROOM911_SEED_PASSWORD` (o genera y loguea). Usuarios: `superadmin`(SUPER_ADMIN), `j.reyes`(ADMIN_ACCESOS), `a.sanchez`(ADMIN_SISTEMAS).

## ✅ 2. Frontend — HECHO en esta sesión (build verde)

1. **`services/authService.ts`:** reescrito → `POST /auth/login`; guarda `{username, nombre, correo, rol}`; sin mock admin/admin123 ni defaults inventados. Helpers: `puedeGestionarPersonal()` (SUPER_ADMIN|ADMIN_ACCESOS), `puedeGestionarAdministradores()` (SUPER_ADMIN|ADMIN_SISTEMAS), `esSuperAdmin()`.
2. **`pages/Login.tsx`:** sin credenciales pre-rellenadas ni bloque demo; muestra `mensaje` del backend (ej. "Credenciales inválidas").
3. **`services/api.ts`:** en 401 (excepto login) limpia storage y redirige a `/login`.
4. **`services/adminService.ts`:** solo `/administradores`; contrato `{nombre, apellido, correo, usuario, contrasena?, rol}`; divide nombre completo en nombre+apellido; `contrasena` solo se envía en update si hay valor; `eliminar` = DELETE real; **ya no existe `cambiarEstado`** (backend no tiene endpoint de activo).
5. **`pages/Administradores.tsx`:** gating por rol (crear/editar → puedeGestionar; eliminar → esSuperAdmin); toggle de estado reemplazado por **DELETE real** con ConfirmDialog destructivo; botón/power → icono Trash2; imports limpios.
6. **`services/dashboardService.ts`:** 4 endpoints reales con `Promise.all`; mapea `AccesosSemanaDTO {dia,concedidos,denegados}`, `DashboardResumenDTO {empleados,empleadosConPermiso,accesosHoy,denegadosHoy,enPlanta}`, `DepartamentoResumenDTO {departamento,cantidad}` (calcula %), `AccessAttemptDTO` (ultimos-accesos; usa `documento` como empleadoId, `departamento` como puerta). Errores se propagan.
7. **`services/empleadoService.ts`:** sin mocks. `cambiarEstado` ahora hace GET + PUT completo (el PUT de empleados exige DTO completo por validación `@NotBlank`). Rutas usan `dbId` (PK) cuando existe (`idNumerico()`).
8. **`services/accesoService.ts`:** sin mocks ni fallbacks; historial SOLO `/intento-acceso` (y `/intento-acceso/empleado/{id}` para detalle); nuevo `descargarPdf(empleadoId)` (blob de `/intento-acceso/pdf/{id}`).
9. **`pages/EmpleadoCsvDrawer.tsx`:** REESCRITO — parser CSV real (nombre,apellido,documento,correo,cargo), selector de departamento destino, preview con validación, importa con `POST /empleados/importar/{departamentoId}` (FormData). Sin filas demo.
10. **`pages/Empleados.tsx` / `EmpleadoDetalle.tsx` / `EmpleadoFormDrawer.tsx`:** gating `puedeGestionarPersonal()` (botones crear/editar/power/PDF-toggle); FormDrawer envía `departamentoId` numérico resuelto del nombre; toasts de error con `mensaje` del backend; botón "Informe PDF" conectado a endpoint real.
11. **`src/data/mockData.ts` BORRADO** (directorio `src/data` eliminado). Cero referencias MOCK_* en el repo frontend.
12. **`pages/Departamentos.tsx`:** campo **descripción** agregado al form (textarea, máx 255, se envía en create/update — antes mandaba el valor viejo); gating por rol en Nueva Área/Editar/Power; empty state; toasts de error.
13. **`services/departamentoService.ts`:** mapea `empleadosCount` del backend (ya no hardcodea 0).
14. **`routes/AppRoutes.tsx`:** `React.lazy` + `Suspense` por página; nueva guardia `AdminRoute` (redirect a /dashboard si no es SUPER_ADMIN/ADMIN_SISTEMAS). **`pnpm build` ✅**: bundle principal bajó de ~867 kB a ~243 kB (+ Dashboard 437 kB en chunk aparte con recharts).
15. **`components/layout/Sidebar.tsx`:** ítem "Administradores" solo para SUPER_ADMIN/ADMIN_SISTEMAS; datos de sesión reales sin fallback inventado.
16. **`types/index.ts`:** eliminado `DashboardSummary = any`.

## ✅ 3. Backend menor — HECHO en esta sesión (SIN VERIFICAR)

- **`DepartamentoResponseDTO`:** + `empleadosCount` (Long). `DepartamentoMapper.toDTO(departamento, empleadosCount)`. `DepartamentoServiceImpl` inyecta `EmpleadoRepository` y usa `countByDepartamentoIdAndActivoTrue` en todos los toDTO (guardar/listar/buscar/actualizar).
- **`CorsConfig.java`:** orígenes desde `@Value("${cors.allowed-origins}")` (separados por coma). Sin hardcode.
- **Filtro JWT sin doble registro:** quitado `@Component` de `JwtAuthenticationFilter`; registrado como `@Bean` en `SecurityConfig` (constructor recibe `JwtService`).
- **`AdministradorDTO.contrasena` opcional** (sin `@NotBlank`); `AdministradorServiceImpl.guardar` valida presencia al crear (IllegalArgumentException→400); `actualizar` ya solo cambia contraseña si viene no vacía.
- **`pom.xml`:** + `spring-security-test` (scope test).
- **Tests nuevos (NO ejecutados aún):**
  - `src/test/java/com/room911/security/JwtServiceTest.java` — token válido (sub/rol), alterado, otro secret, basura.
  - `src/test/java/com/room911/controller/AuthControllerTest.java` — login OK 200+token, credenciales inválidas 401 genérico, campos vacíos 400. Usa `@WebMvcTest` + `@Import(SecurityConfig, JwtService)` + `@MockitoBean` AuthService (Spring Boot 3.5 / MockitoBean, NO `@MockBean`).
  - `src/test/java/com/room911/controller/RoleSecurityTest.java` — dashboard sin token 401 / con rol 200; POST administradores con ADMIN_ACCESOS 403 / SUPER_ADMIN 201; DELETE administradores con ADMIN_SISTEMAS 403 / SUPER_ADMIN 204.

## ⚠️ 4. PENDIENTE (siguiente chat)

1. **Verificar backend:** `cd backend_911/backend && ./mvnw compile` y `./mvnw test`. Corregir lo que falle (los tests son nuevos, primera ejecución pendiente). Posibles ajustes: si `@WebMvcTest` no levanta `BCryptPasswordEncoder`/contexto, revisar los `@TestConfiguration` incluidos.
2. **Verificación E2E** (sección 5 de abajo): docker db + backend + login curl + `pnpm dev`, smoke de pantallas.
3. **README.md:** documentar `/api/auth/login`, roles y variables nuevas (`JWT_SECRET`, `ROOM911_SEED_PASSWORD`, `CORS_ALLOWED_ORIGINS`, `VITE_API_URL`).
4. **Commit de la fase completa** (backend seguridad + frontend + backend menor + tests) y **actualizar TRAZABILIDAD.md**.
5. Deuda menor conocida: `SimuladorAcceso.tsx` decide el resultado en el cliente y registra en el backend después (no es mock de datos, pero la lógica de autorización real vive en `/api/acceso`); `CredencialDigital` usa ruta demo `/credencial/EMP-0042` en el Sidebar.

## 🧪 5. Cómo verificar

```bash
# BD
docker compose up -d db
# Backend (definir JWT_SECRET y ROOM911_SEED_PASSWORD en .env)
cd backend_911/backend && JWT_SECRET=... ROOM911_SEED_PASSWORD=... ./mvnw spring-boot:run
# Login de prueba
curl -X POST localhost:8080/api/auth/login -H 'Content-Type: application/json' \
  -d '{"username":"superadmin","password":"<SEED_PASSWORD>"}'
# Con token: Authorization: Bearer <token> → GET /api/dashboard/resumen, /api/departamentos (ver empleadosCount)
# Frontend
cd room911-frontend && pnpm install && pnpm dev
```

## 📌 6. Decisiones tomadas (no revertir sin consultar)

- Un solo sistema de usuarios: `Administrador` con `rol` (AdminUser eliminado).
- `/api/acceso/**` público (lectores/simulador sin sesión). Login siempre 401 genérico.
- Contraseña semilla NUNCA en código; por env o generada+logueada.
- Frontend sin `cambiarEstado` de administradores: eliminar administrador = DELETE real (solo SUPER_ADMIN). El "activo" de Administrador no tiene endpoint de toggle.
- `cambiarEstado` de empleados = GET + PUT completo (el PUT exige DTO completo).
- CSV de importación: 5 columnas `nombre,apellido,documento,correo,cargo` + departamento destino en la URL.
