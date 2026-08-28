# Revisión de Historias de Usuario contra ROOM911

**Fecha de corte:** 26 de agosto de 2026  
**Documento base:** [`Historias de Usuario Room_911.md`](./Historias%20de%20Usuario%20Room_911.md)  
**Handoff de continuidad:** [`HANDOFF_REVISION_HU.md`](./HANDOFF_REVISION_HU.md)

## Resultado ejecutivo

El documento base contiene 29 HUs, pero no cubre de forma suficiente y ordenada todo lo que hoy se ve en la aplicación. Hay funciones implementadas en la interfaz que no tienen una HU clara, HUs duplicadas y funcionalidades descritas que todavía no existen o están solo simuladas.

La revisión se organiza por paquetes funcionales. El primer paquete, HU-001 a HU-007, ya fue ampliado priorizando tareas claras, con propósito y resultado comprobable; las condiciones se dejaron generales y verificables. La siguiente revisión corresponde al paquete HU-008 a HU-014.

## Convenciones

| Estado | Significado |
|---|---|
| Cubierta | La app presenta el flujo principal y existe evidencia suficiente para continuar con pruebas. |
| Parcial | Existe una parte del flujo, pero falta una regla, conexión real, persistencia o prueba. |
| No cubierta | La función no está disponible en la app revisada. |
| Duplicada | Repite el objetivo de otra HU y debe consolidarse. |
| Solo backend | Existe una API o servicio, pero no hay pantalla de usuario que lo exponga. |

## Matriz inicial de cobertura

| HU | Tema resumido | Evidencia principal en la app | Estado | Decisión para la revisión |
|---|---|---|---|---|
| HU-001 | Ingreso y cierre de sesión | `Login.tsx`, `authService.ts`, rutas protegidas | Parcial | Paquete 1 revisado; tareas ampliadas y brechas de sesión/seguridad pendientes. |
| HU-002 | Gestión de administradores | `Administradores.tsx`, `adminService.ts`, `/api/administradores` | Parcial | Revisada y ampliada; alinear rol, estado, fallback demo, persistencia y auditoría. |
| HU-003 | Gestión de departamentos | `Departamentos.tsx`, `departamentoService.ts` | Parcial | Paquete 1 revisado; tareas y condiciones ampliadas; validar contrato y persistencia. |
| HU-004 | Desactivar administrador | Acciones de estado en `Administradores.tsx` | Parcial | Paquete 1 revisado; tareas ampliadas; verificar persistencia y regla en servidor. |
| HU-005 | Recuperar contraseña | No hay pantalla ni servicio de recuperación | No cubierta | Paquete 1 revisado; tareas ampliadas; crear o confirmar implementación independiente. |
| HU-006 | Bloqueo por intentos fallidos | No hay contador ni bloqueo en frontend/backend | No cubierta | Paquete 1 revisado; tareas ampliadas; definir política y reglas medibles. |
| HU-007 | Cierre por inactividad | No hay temporizador ni advertencia | No cubierta | Paquete 1 revisado; tareas ampliadas; definir política de sesión segura. |
| HU-008 | Importar empleados por CSV | `EmpleadoCsvDrawer.tsx` y endpoint de importación | Parcial | La pantalla usa filas de muestra y no envía el archivo real. |
| HU-009 | Editar empleado | `EmpleadoFormDrawer.tsx`, `empleadoService.ts` | Parcial | Validar actualización real, errores y auditoría. |
| HU-010 | Autorizar acceso de empleado | Estado de acceso en empleados y servicio de acceso | Parcial | Unificar con reglas de zonas y permisos. |
| HU-011 | Autorizar acceso | Mismo objetivo que HU-010 | Duplicada | Consolidar en HU-010. |
| HU-012 | Buscar empleados | Búsqueda en `Empleados.tsx` | Cubierta | Confirmar criterios de campos y prueba de resultados vacíos. |
| HU-013 | Filtrar por departamento | Filtro en `Empleados.tsx` | Cubierta | Mantener como criterio de consulta o historia pequeña. |
| HU-014 | Evitar empleados duplicados | Validaciones backend de documento/correo; importación incompleta | Parcial | Probar registro individual y carga masiva. |
| HU-015 | Exportar listado de empleados | No hay exportación del listado general | No cubierta | Crear HU si el negocio la necesita. |
| HU-016 | Gestión de departamentos | Mismo objetivo que HU-003 | Duplicada | Consolidar en HU-003. |
| HU-017 | Cambiar contraseña | No hay pantalla ni endpoint identificado | No cubierta | Crear HU independiente. |
| HU-018 | Recuperar contraseña | Repite HU-005 | Duplicada | Consolidar en HU-005. |
| HU-019 | Estadísticas de accesos | `Dashboard.tsx`, `dashboardService.ts` | Parcial | Verificar definiciones de cada indicador y período. |
| HU-020 | Auditoría administrativa | API `/api/auditoria`, sin pantalla ni conexión automática completa | Solo backend | Definir consulta de auditoría y eventos obligatorios. |
| HU-021 | Configuración general | Existe entidad `Configuracion`, sin flujo visible de usuario | No cubierta | Crear HU solo si forma parte del producto aprobado. |
| HU-022 | Credencial digital | Ruta `/credencial/:codigoQr`, `CredencialDigital.tsx`, QR | Parcial | Verificar generación, identidad y vigencia de la credencial. |
| HU-023 | Validar acceso con QR | `/api/acceso/qr`, `accesoService.ts`, simulador | Parcial | El simulador aplica reglas locales y no siempre usa el resultado del API. |
| HU-024 | Mostrar resultado de validación | Estados concedido, denegado y falla de sensor en simulador | Parcial | Separar resultado de negocio, error de sensor y registro real. |
| HU-025 | Estado de punto de acceso en tiempo real | Puntos y estado “en línea” definidos en `SimuladorAcceso.tsx` | Parcial/demo | No hay lectura real de sensores ni catálogo persistido de puertas. |
| HU-026 | Registrar intentos de acceso | `AccessServiceImpl`, `AccessAttemptController`, historial | Parcial | Las denegaciones locales y eventos del simulador no siempre llegan al backend. |
| HU-027 | Indicadores del sistema | KPIs, gráficos y estado de sensores en `Dashboard.tsx` | Parcial | Validar origen, cálculo y actualización de cada indicador. |
| HU-028 | Autenticarse en el sistema | Repite HU-001 | Duplicada | Consolidar en HU-001. |
| HU-029 | Exportar historial en PDF | Exportación/impresión desde `HistorialAccesos.tsx` | Parcial | Verificar filtros aplicados, seguridad y formato formal del reporte. |

## Funciones observadas sin una HU funcional clara

Estas funciones deben convertirse en criterios de aceptación o nuevas HUs después de la revisión del backlog:

- Directorio de empleados: alta, detalle, edición, activación/desactivación, paginación y credencial QR.
- Historial global: búsqueda, filtros por resultado, paginación y exportación CSV.
- Historial por empleado: pestaña de eventos y consulta individual.
- Puntos de control: reglas por departamento, nivel de restricción y error de sensor.
- Visitantes: existen endpoints de backend (`/api/visitantes`), pero no hay pantalla ni servicio frontend.
- Roles y permisos: la interfaz muestra roles, pero el backend revisado no evidencia autorización por rol.

## Nuevas HUs candidatas, sin aprobar todavía

| Candidata | Objetivo de negocio |
|---|---|
| HU-N01 | Gestionar visitantes autorizados y su vigencia de acceso. |
| HU-N02 | Administrar roles y permisos por tipo de administrador. |
| HU-N03 | Mantener una sesión segura, con vencimiento y respuesta coherente del servidor. |
| HU-N04 | Recuperar y cambiar la contraseña de forma segura. |
| HU-N05 | Bloquear temporalmente una cuenta después de intentos fallidos. |
| HU-N06 | Cerrar sesiones administrativas por inactividad. |
| HU-N07 | Importar empleados desde CSV real, con previsualización y reporte de filas aceptadas/rechazadas. |
| HU-N08 | Exportar el directorio de empleados. |
| HU-N09 | Administrar puntos de control y su estado operativo. |

Estas candidatas no se agregan todavía como HUs oficiales; requieren confirmación del alcance del producto.

## Reglas de trazabilidad para las siguientes revisiones

Cada HU debe conservar: código único, objetivo en lenguaje sencillo, alcance, criterios de aceptación, estado frente a la app, evidencia de código o pantalla, brechas, tareas y registro de versión. Una función se considerará cubierta solo después de comprobar interfaz, servicio/API y resultado observable.

Para cada hallazgo se debe registrar también la ruta del archivo y la línea aproximada revisada. La evidencia de HU-001 está identificada como E-01 a E-05 y la de HU-002 como E-06 dentro del documento funcional.
