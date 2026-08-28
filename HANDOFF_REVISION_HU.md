# Handoff — Revisión trazable de Historias de Usuario ROOM911

**Corte:** 26-08-2026  
**Punto actual:** Paquete 1 (HU-001 a HU-007) revisado y ampliado
**Siguiente punto:** Paquete 2 (HU-008 a HU-014)
**Estado general:** Revisión en curso

## Objetivo del trabajo

Comparar las historias del documento con lo que realmente puede hacer la aplicación, corregir el contenido de forma progresiva y detectar las historias que hacen falta. El documento debe poder leerlo una persona de negocio sin depender de conocimiento técnico.

## Qué se hizo en esta sesión

1. Se confirmó que no existe un archivo `.mc` en el repositorio. El archivo de historias disponible es `Historias de Usuario Room_911.md`.
2. Se inventariaron 29 HUs del documento base.
3. Se revisaron rutas, pantallas, servicios frontend, controladores y servicios backend.
4. Se actualizó y amplió HU-001 con precondiciones, flujo principal, 13 criterios de aceptación, tareas verificables, reglas de negocio, estado frente a la app y brechas.
5. Se creó la matriz completa en `REVISION_HISTORIAS_USUARIO.md`.
6. Se identificaron duplicados y nueve candidatas de nuevas HUs, pendientes de aprobación.
7. No se modificó el código de la aplicación en esta etapa; los hallazgos son documentales y de alineación.
8. Se amplió HU-002 con un requerimiento más completo, diez condiciones verificables y tareas descritas con entregable y resultado esperado.
9. Se documentaron en HU-002 las brechas entre la interfaz de administradores y los contratos reales del frontend y backend.
10. Se mejoraron las tareas de HU-001 a HU-007 para expresar propósito, alcance y resultado comprobable en un máximo de una idea funcional por tarea.
11. Se ajustaron las condiciones de HU-003 a HU-007 para mantener escenarios generales, claros y verificables sin sobrecargarlos con detalles técnicos.

## Decisiones que quedan vigentes

- La revisión se realizará por paquetes de HUs, conservando el orden funcional y cerrando cada paquete antes de iniciar el siguiente.
- HU-005/HU-018, HU-006, HU-007 y HU-017 no se mezclan dentro de HU-001; representan seguridad y recuperación de cuenta.
- HU-011, HU-016, HU-018 y HU-028 se consideran duplicadas hasta que el responsable de producto indique lo contrario.
- Los fallbacks demo y las filas de ejemplo se registran como brechas, no como funcionalidades reales.
- “Parcial” significa que hay una parte observable, pero no se puede declarar cumplimiento completo.

## Hallazgos críticos de HU-001 para seguimiento

- La pantalla de login tiene valores demo prellenados y un fallback local cuando falla el backend.
- El backend de login revisado devuelve resultado de autenticación, pero no evidencia la emisión de un token JWT.
- La configuración de seguridad permite todas las solicitudes; la protección de rutas existente solo ocurre en el navegador.
- No se encontró recuperación de contraseña, bloqueo por intentos, cierre por inactividad ni registro automático de login/cierre.
- El cierre manual sí elimina los datos de sesión del navegador y redirige a login.
- La HU-001 quedó en versión 1.1; la versión 1.0 se conserva como antecedente de revisión.

## Hallazgos de HU-002 para seguimiento

- La pantalla permite crear y editar cuentas, buscar por nombre, usuario, correo o identificador, filtrar por rol y estado, paginar y activar o inactivar cuentas.
- El formulario valida nombre de usuario, nombre, correo, confirmación de correo y contraseña; la contraseña nueva cumple reglas de longitud y complejidad.
- `adminService.ts` consulta `/administradores`, pero conserva fallback a `/admin` y a `MOCK_ADMINS`, por lo que una falla del servicio puede mostrarse como información de demostración.
- El DTO backend de `Administrador` maneja nombre, apellido, correo, usuario y contraseña, pero no rol; además, `actualizar()` no persiste el campo `activo` y `eliminar()` realiza borrado físico.
- La interfaz impide que el Super Administrador se desactive a sí mismo, pero esta regla debe validarse también en el servidor.
- No se encontró conexión automática completa de las operaciones de HU-002 con la auditoría.

## Próximo paso operativo: Paquete 2 (HU-008 a HU-014)

Antes de editar HU-008, comprobar:

- Qué estructura, columnas obligatorias, separadores y codificación debe aceptar la importación CSV.
- Si la pantalla envía el archivo real al backend y muestra filas aceptadas, rechazadas y motivos.
- Cómo se validan duplicados, campos vacíos, caracteres inválidos y empleados ya registrados.
- Si la carga parcial o fallida conserva la integridad de los registros existentes.
- Qué relación debe existir entre importación, edición, autorización, búsqueda y filtros de empleados.
- Qué acciones deben generar auditoría y qué mensaje debe ver la persona usuaria.

Al cerrar cada HU, actualizar en este orden: documento base, matriz de revisión, este handoff y `TRAZABILIDAD.md`.

## Evidencia de continuidad

- Documento funcional: [`Historias de Usuario Room_911.md`](./Historias%20de%20Usuario%20Room_911.md)
- Matriz comparativa: [`REVISION_HISTORIAS_USUARIO.md`](./REVISION_HISTORIAS_USUARIO.md)
- Registro histórico: [`TRAZABILIDAD.md`](./TRAZABILIDAD.md)
- Rutas frontend: `room911-frontend/src/routes/AppRoutes.tsx`
- Pantalla de inicio: `room911-frontend/src/pages/Login.tsx`
- Servicio de sesión: `room911-frontend/src/services/authService.ts`

Las evidencias de HU-001 están identificadas como E-01 a E-05 y la evidencia de HU-002 como E-06 en el documento funcional. Para el siguiente paquete, continuar la numeración desde E-07 al documentar HU-008.

## Criterio de cierre del handoff

El handoff se mantiene abierto hasta revisar todas las HUs existentes, aprobar o descartar las candidatas y dejar una relación clara entre cada capacidad observable, su HU y sus pruebas.
