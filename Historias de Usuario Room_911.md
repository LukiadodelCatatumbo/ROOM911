# Historias de Usuario — ROOM911

> **Revisión incremental:** este documento se contrasta con la aplicación por paquetes. El primer paquete, HU-001 a HU-007, tiene tareas ampliadas con propósito y resultado comprobable, y condiciones redactadas de forma clara y general. La matriz completa está en [`REVISION_HISTORIAS_USUARIO.md`](./REVISION_HISTORIAS_USUARIO.md) y la continuidad de trabajo en [`HANDOFF_REVISION_HU.md`](./HANDOFF_REVISION_HU.md).

## HU-001 — Autenticación y cierre de sesión del administrador

| Campo | Definición |
|---|---|
| Código | HU-001 |
| Módulo | Acceso administrativo |
| Actor | Administrador del sistema |
| Prioridad | Crítica |
| Estado de revisión | En revisión; implementación parcial |
| HUs relacionadas | HU-005, HU-006, HU-007 y HU-017 |

### Historia

Como administrador del sistema ROOM911, necesito ingresar con mis credenciales y cerrar mi sesión para consultar y administrar la información a la que tengo permiso.

### Alcance

Esta HU cubre el ingreso con usuario y contraseña, la validación de campos, el acceso al panel administrativo y el cierre manual de sesión. Recuperar o cambiar la contraseña, bloquear una cuenta por intentos fallidos y cerrar por inactividad se revisan por separado.

### Precondiciones

- El administrador debe tener una cuenta registrada.
- La cuenta debe tener un estado definido: activa o inactiva.
- El servicio de autenticación debe estar disponible para validar las credenciales.
- Las pantallas administrativas deben requerir una sesión válida antes de mostrar información protegida.

### Flujo principal

1. La persona abre la pantalla de inicio de sesión.
2. Escribe su usuario o correo corporativo y su contraseña.
3. Selecciona **Ingresar al Sistema**.
4. El sistema valida la información contra la cuenta registrada.
5. Si la cuenta es válida y está activa, el sistema inicia la sesión y muestra el panel principal.
6. La persona consulta las opciones que corresponden a su rol.
7. Cuando termina, selecciona **Cerrar sesión** y el sistema finaliza el acceso.

### Criterios de aceptación frente a la app

| ID | Dado | Cuando | Entonces | Estado actual |
|---|---|---|---|---|
| CA-01 | La persona no tiene una sesión iniciada. | Abre la dirección de acceso de ROOM911. | El sistema muestra una pantalla clara con la identidad de ROOM911, un campo para usuario o correo, un campo de contraseña y un botón para ingresar. Ninguna contraseña aparece visible. | **Cubierto** en la interfaz. |
| CA-02 | La pantalla de acceso está abierta y uno o los dos campos están vacíos. | La persona selecciona **Ingresar al Sistema**. | El sistema no realiza la solicitud, mantiene la pantalla abierta y explica que debe completar cada dato obligatorio. | **Cubierto** en la interfaz. |
| CA-03 | La persona está diligenciando el formulario. | Escribe o corrige el usuario y la contraseña. | El sistema permite editar ambos valores, conserva la contraseña oculta y permite enviar el formulario con el teclado. | **Parcial**: el formulario funciona; falta una prueba formal de accesibilidad. |
| CA-04 | Existe una cuenta activa y la persona conoce sus credenciales correctas. | Envía el usuario y la contraseña. | El sistema valida los datos, informa que el ingreso fue exitoso y dirige al Dashboard sin pedir las credenciales otra vez. | **Parcial**: existe la llamada y la redirección, pero la respuesta backend no evidencia un token JWT. |
| CA-05 | El usuario o correo no está registrado. | Intenta ingresar. | El sistema rechaza el acceso y muestra un mensaje general que no revela si el usuario existe o no. | **Parcial**: el backend rechaza la operación; el frontend presenta un mensaje unificado y tiene fallback demo. |
| CA-06 | La cuenta existe, pero la contraseña no coincide. | Intenta ingresar. | El sistema rechaza el acceso, no crea una sesión y muestra un mensaje comprensible para que revise sus datos. | **Parcial**: el backend comprueba la contraseña y la interfaz muestra error; falta eliminar el fallback de demostración. |
| CA-07 | La cuenta existe, pero está marcada como inactiva. | Intenta ingresar con sus credenciales. | El sistema rechaza el acceso, no crea sesión y explica que la cuenta está inactiva; no debe permitir entrar al Dashboard. | **Parcial**: el backend valida el estado, pero falta verificar el flujo completo con la sesión real. |
| CA-08 | El servicio de autenticación no responde o devuelve un error. | La persona intenta ingresar. | El sistema informa que no fue posible validar el acceso, conserva la pantalla y permite reintentar sin mostrar detalles técnicos. | **Parcial**: se muestra un error, pero el fallback demo puede ocultar la causa real. |
| CA-09 | La autenticación fue exitosa. | La persona intenta abrir Dashboard, empleados, departamentos, historial o administradores. | El sistema permite consultar únicamente esas áreas cuando la sesión es válida y no expone el contenido protegido antes de autenticarse. | **Pendiente**: la protección de rutas existe en el navegador, pero el backend permite cualquier solicitud. |
| CA-10 | No existe sesión o la sesión ya no es válida. | La persona intenta abrir directamente una pantalla administrativa. | El sistema la devuelve a la pantalla de inicio y no permite consultar ni modificar información. | **Parcial**: existe redirección frontend; falta protección efectiva del servidor. |
| CA-11 | Existe una sesión activa. | La persona selecciona **Cerrar sesión** desde el menú lateral. | El sistema elimina los datos de sesión, vuelve al login y muestra que la sesión terminó. | **Parcial**: se eliminan los datos locales y se redirige; falta confirmación visual y validación contra el servidor. |
| CA-12 | La persona acaba de cerrar sesión. | Usa el botón atrás del navegador o intenta abrir una ruta protegida. | El sistema no recupera el acceso con la información anterior y solicita autenticarse nuevamente. | **Parcial**: la ruta comprueba el almacenamiento local; falta comprobar la invalidez del token en backend. |
| CA-13 | El inicio o cierre de sesión debe quedar trazado. | Se completa cualquiera de esas acciones. | El sistema registra quién realizó la acción, fecha, hora, resultado y motivo cuando corresponda. | **Sin evidencia** de conexión automática; coordinar con HU-020. |

### Fuera del alcance de esta HU

La recuperación o cambio de contraseña, el bloqueo después de intentos fallidos, el cierre por inactividad y la administración de roles se mantienen como historias separadas para que cada una tenga sus propias reglas y pruebas.

### Evidencia trazable

| Evidencia | Ubicación | Qué demuestra |
|---|---|---|
| E-01 | [`Login.tsx:7`](./room911-frontend/src/pages/Login.tsx:7) | Formulario de ingreso, validación de campos y mensaje de error. |
| E-02 | [`authService.ts:14`](./room911-frontend/src/services/authService.ts:14) | Llamada de login, almacenamiento local y fallback demo. |
| E-03 | [`AppRoutes.tsx:14`](./room911-frontend/src/routes/AppRoutes.tsx:14) | Protección de rutas desde el navegador. |
| E-04 | [`AdminUserServiceImpl.java:47`](./backend_911/backend/src/main/java/com/room911/service/impl/AdminUserServiceImpl.java:47) | Validación de usuario activo y contraseña en el backend. |
| E-05 | [`SecurityConfig.java:18`](./backend_911/backend/src/main/java/com/room911/config/SecurityConfig.java:18) | Configuración actual que permite cualquier solicitud. |

### Tareas y resultado que debe comprobarse

| ID | Tarea | Qué debe quedar listo | Estado actual |
|---|---|---|---|
| T-01 | Definir el recorrido completo de autenticación y cierre. | Documentar las pantallas, decisiones y respuestas que observa la persona desde el ingreso hasta el cierre de sesión. | **Realizado** en esta HU. |
| T-02 | Diseñar la interfaz de inicio de sesión para ROOM911. | Presentar identidad del sistema, campos de usuario y contraseña, botón de ingreso, mensajes claros y navegación accesible. | **Parcial**: existe la pantalla; falta prueba formal. |
| T-03 | Validar los datos del formulario antes de enviarlos. | Identificar campos obligatorios o inválidos, explicar la corrección y evitar solicitudes innecesarias al servidor. | **Cubierto** en la interfaz. |
| T-04 | Integrar el formulario con el servicio de autenticación. | Enviar las credenciales con el contrato acordado y procesar de forma diferenciada las respuestas exitosas y fallidas. | **Parcial**: existe la llamada; el contrato de respuesta debe corregirse. |
| T-05 | Validar la cuenta administrativa en el servidor. | Comprobar existencia, contraseña y estado activo sin exponer credenciales ni información sensible de la cuenta. | **Parcial**: existe validación y cifrado; falta cerrar el flujo completo. |
| T-06 | Generar y conservar una sesión administrativa segura. | Emitir una credencial verificable, con vencimiento y datos mínimos para identificar a la persona y su rol. | **Pendiente**: no se evidencia emisión de JWT. |
| T-07 | Proteger las operaciones administrativas según la sesión. | Validar la credencial y los permisos en el servidor antes de permitir consultas o modificaciones de información protegida. | **Pendiente**: la configuración actual permite cualquier solicitud. |
| T-08 | Gestionar el estado de espera durante el ingreso. | Mostrar progreso o desactivar el envío mientras se valida la cuenta para evitar solicitudes repetidas. | **Cubierto** en la interfaz; falta prueba formal. |
| T-09 | Gestionar los errores de autenticación sin ocultar fallas. | Mostrar mensajes útiles, permitir reintentar y evitar que un error del backend se convierta en datos de demostración. | **Pendiente**: existe fallback demo. |
| T-10 | Implementar el cierre seguro de la sesión. | Retirar la información local, invalidar la sesión cuando corresponda y regresar a la pantalla de acceso. | **Parcial**: cierre local implementado. |
| T-11 | Registrar los eventos del ciclo de sesión. | Guardar inicio exitoso, rechazo y cierre con persona, fecha, hora, resultado y motivo cuando aplique. | **Pendiente**; coordinar con HU-020. |
| T-12 | Ejecutar pruebas del flujo completo de autenticación. | Comprobar datos vacíos, credenciales válidas o inválidas, cuenta inactiva, servicio no disponible, rutas protegidas y cierre. | **Pendiente**. |
| T-13 | Realizar la revisión de seguridad antes de liberar. | Confirmar que no existan credenciales demo, contraseñas expuestas, secretos en código ni endpoints administrativos sin protección. | **Pendiente**. |

### Reglas de negocio y calidad

- Una cuenta inactiva nunca puede iniciar una sesión administrativa.
- Una respuesta de error no debe revelar si el usuario existe, cuál dato fue incorrecto ni detalles internos del servidor.
- La contraseña debe viajar protegida y almacenarse cifrada; nunca debe devolverse en una respuesta.
- La sesión debe tener vencimiento y el servidor debe comprobarla en cada operación protegida.
- El formulario debe poder usarse con teclado, tener etiquetas claras y mostrar mensajes comprensibles.
- Las credenciales y datos de demostración solo pueden existir en un entorno de prueba claramente identificado.

**Versión 1.2 — 26-08-2026:** ajuste de las tareas para describir propósito, alcance y resultado comprobable. Se conserva la ampliación funcional de la versión 1.1 y la versión 1.0 como antecedente.

<!-- INICIO: contenido original HU-001 conservado únicamente como referencia histórica -->
| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-001 |  | **Nombre:** |  | Inicio de Sesion de administrador |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | N/A |  |  |  |  |  |  |
| **Módulo:** |  |  | Autenticación |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador del sistema Room\_911 |  |  |  |  |
|  |  |  | **Requiero** |  | Iniciar sesión con usuario y contraseña |  |  |  |  |
|  |  |  | **Para** |  | Acceder de forma segura a las funcionalidades administrativas del sistema |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá mostrar una pantalla de inicio de sesión compuesta por: Campo "Usuario, campo "Contraseña", botón "Iniciar sesión", enlace "Olvidé mi contraseña", mensajes de error y validación. Al autenticarse correctamente, el sistema deberá redirigir al Dashboard principal donde el administrador podrá acceder a las opciones de gestión de administradores, departamentos, empleados y accesos  |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que el administrador se encuentre registrado y activo |  |  |  |  |
|  |  |  | **Cuando:** |  | Ingrese usuario y contraseña válidos |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema permitirá el acceso al dashboard |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que el administrador ingrese con contraseña incorrecta  |  |  |  |  |
|  |  |  | **Cuando:** |  | El administrador intente iniciar sesión |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará el mensaje "Usuario o contraseña incorrectos" |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que no exista un usuario  |  |  |  |  |
|  |  |  | **Cuando:** |  | Intente acceder al sistema |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema rechazará el inicio de sesión |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que existan campos vacíos |  |  |  |  |
|  |  |  | **Cuando:** |  | Se presione el botón “Iniciar Sesión” |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema solicitara diligenciar los campos obligatorios |  |  |  |  |
| **Condicion 05** |  |  | **Dado:**  |  | Que el administrador se encuentre inactivo |  |  |  |  |
|  |  |  | **Cuando:**  |  | Intente autenticarse |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará el mensaje "Usuario inactivo" |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | Que el administrador inicie sesión exitosamente  |  |  |  |  |
|  |  |  | **Cuando:** |  | Se valide la autenticación  |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema registrará la fecha y hora de acceso |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | Que exista una sesion activa |  |  |  |  |
|  |  |  | **Cuando:** |  | El administrador seleccione “Cerrar sesión” |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema finalizará la sesión y redireccionará al Login |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | Que el administrador acceda al login |  |  |  |  |
|  |  |  | **Cuando:** |  | La página finalice la carga  |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará las opciones disponibles en la pagina |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Diseñar interfaz de inicio de sesión |  |  |  |  |  |  |
| 2 |  |  | Crear formulario de autenticación |  |  |  |  |  |  |
| 3 |  |  | Crear modelo administrador |  |  |  |  |  |  |
| 4 |  |  | Implementar validación de credenciales |  |  |  |  |  |  |
| 5 |  |  | Implementar cifrado de contraseñas  |  |  |  |  |  |  |
| 6 |  |  | Gestionar sesiones  |  |  |  |  |  |  |
| 7 |  |  | Implementar cierre de sesion |  |  |  |  |  |  |
| 8 |  |  | Registrar hora y fecha de acceso |  |  |  |  |  |  |
| 9 |  |  | Mostrar mensajes de validación  |  |  |  |  |  |  |
| 10 |  |  | Realizar pruebas unitarias |  |  |  |  |  |  |
| 11 |  |  | Realizar pruebas funcionales |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

<!-- FIN: contenido original HU-001 -->

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-002 |  | **Nombre:** |  | Gestión de administradores |  |  |  |  |
| **Complejidad:** |  |  | Alta |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-001 |  |  |  |  |  |  |
| **Módulo:** |  |  | Administración de usuarios |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador principal |  |  |  |  |
|  |  |  | **Requiero** |  | Gestionar los usuarios administradores |  |  |  |  |
|  |  |  | **Para** |  | Permitir que varias personas autorizadas administren el sistema |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá ofrecer al administrador principal una pantalla para registrar, consultar y actualizar cuentas administrativas. La vista debe incluir nombre, apellido, correo, usuario, rol y estado, además de acciones para activar o inactivar cada cuenta, búsqueda por datos identificativos y paginación del listado. Las operaciones confirmadas deberán persistir en el sistema y quedar disponibles para su consulta posterior. |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **Parcial.** La interfaz ya presenta formulario, roles, estados, búsqueda, filtros, paginación y acciones de edición/reactivación. La persistencia no está completamente alineada: el servicio usa fallback a datos de demostración y el contrato backend revisado no incluye rol; además, la actualización backend no persiste el estado activo/inactivo. |  |  |  |  |  |  |
| **Evidencia:** |  |  | E-06 [`Administradores.tsx:37`](./room911-frontend/src/pages/Administradores.tsx:37), [`adminService.ts:6`](./room911-frontend/src/services/adminService.ts:6), [`AdministradorController.java:23`](./backend_911/backend/src/main/java/com/room911/controller/AdministradorController.java:23) y [`AdministradorServiceImpl.java:21`](./backend_911/backend/src/main/java/com/room911/service/impl/AdministradorServiceImpl.java:21). |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que el administrador principal tenga permiso de gestión y diligencie nombre, apellido, correo, usuario, contraseña y rol con datos válidos. |  |  |  |  |
|  |  |  | **Cuando:** |  | Seleccione **Guardar** para crear la cuenta. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema registrará la cuenta, la dejará activa, mostrará una confirmación y la incorporará al listado sin exigir una nueva carga manual. |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que ya exista una cuenta con el mismo correo electrónico, sin importar mayúsculas o minúsculas. |  |  |  |  |
|  |  |  | **Cuando:** |  | El administrador intente guardar una nueva cuenta con ese correo. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema rechazará la operación, conservará la información diligenciada y señalará que el correo ya está asociado a otra cuenta. |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que ya exista una cuenta con el mismo nombre de usuario. |  |  |  |  |
|  |  |  | **Cuando:** |  | Se intente registrar otra cuenta reutilizando ese usuario. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema impedirá el registro y mostrará un mensaje específico que permita corregir el nombre de usuario sin perder los demás datos. |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que uno o más campos obligatorios estén vacíos o tengan un formato inválido, como un correo no válido. |  |  |  |  |
|  |  |  | **Cuando:** |  | Se envíe el formulario de creación o edición. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema no enviará datos incompletos, marcará cada campo que debe corregirse y explicará la validación con un mensaje comprensible. |  |  |  |  |
| **Condicion 05** |  |  | **Dado:** |  | Que la cuenta administrativa exista y aparezca en el listado. |  |  |  |  |
|  |  |  | **Cuando:** |  | Se seleccione **Editar** en el registro correspondiente. |  |  |  |  |
|  |  |  | **Entonces:**  |  | El sistema abrirá el formulario con nombre, apellido, correo, usuario, rol y estado actuales; la contraseña no se mostrará y solo podrá reemplazarse de forma explícita. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | Que el administrador haya editado datos permitidos y estos cumplan las validaciones del formulario. |  |  |  |  |
|  |  |  | **Cuando:** |  | Seleccione **Guardar cambios**. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema actualizará la cuenta, conservará los cambios después de recargar la pantalla, mostrará una confirmación y mantendrá los datos sensibles protegidos. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | Que exista una cuenta activa distinta de la cuenta del administrador que ejecuta la acción. |  |  |  |  |
|  |  |  | **Cuando:** |  | Seleccione **Inactivar** y confirme la operación en el diálogo de seguridad. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema cambiará la cuenta a **Inactiva**, actualizará el indicador del listado y bloqueará nuevos accesos de esa cuenta. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | Que exista una cuenta administrativa inactiva y el ejecutor tenga permiso para reactivarla. |  |  |  |  |
|  |  |  | **Cuando:** |  | Seleccione **Activar** y confirme la operación. |  |  |  |  |
|  |  |  | **Entonces:**  |  | El sistema cambiará la cuenta a **Activa**, reflejará el nuevo estado al consultar el listado y permitirá su autenticación según las reglas de HU-001. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | Que el administrador principal ingrese al módulo con una sesión y permisos válidos. |  |  |  |  |
|  |  |  | **Cuando:** |  | Se cargue la pantalla o se aplique una búsqueda, filtro o cambio de página. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema consultará la información disponible y mostrará nombre, correo, usuario, rol, estado y acciones; si no hay coincidencias, presentará un estado vacío informativo. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | Que se cree, edite, active o inactive una cuenta administrativa. |  |  |  |  |
|  |  |  | **Cuando:** |  | La operación finalice correctamente o sea rechazada. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema registrará en auditoría el actor, la fecha, la hora, la acción, el resultado y el identificador de la cuenta afectada, de acuerdo con HU-020. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Definir la entidad de administrador con nombre, apellido, correo, usuario, rol, estado, fechas y credencial protegida para representar una cuenta completa. |  |  |  |  |  |  |
| 2 |  |  | Implementar las operaciones de registro, consulta y actualización de administradores, incluyendo respuestas claras para éxito, duplicados, permisos y errores de servicio. |  |  |  |  |  |  |
| 3 |  |  | Diseñar el formulario de registro con campos obligatorios, selección de rol, confirmación de correo y contraseña, validaciones visibles y estado inicial activo. |  |  |  |  |  |  |
| 4 |  |  | Diseñar el formulario de edición para precargar los datos permitidos, conservar la contraseña oculta y permitir actualizar solo la información autorizada. |  |  |  |  |  |  |
| 5 |  |  | Validar que el nombre de usuario y el correo sean únicos antes de guardar, tanto en la interfaz como en el servidor, evitando registros duplicados. |  |  |  |  |  |  |
| 6 |  |  | Implementar el estado activo o inactivo de cada cuenta y mostrarlo con una etiqueta comprensible en el listado y en las acciones disponibles. |  |  |  |  |  |  |
| 7 |  |  | Construir el listado de administradores con nombre, usuario, correo, rol, estado y acciones de edición, activación o inactivación por registro. |  |  |  |  |  |  |
| 8 |  |  | Implementar búsqueda por nombre, usuario, correo o identificador para localizar una cuenta y reiniciar la paginación cuando cambien los criterios. |  |  |  |  |  |  |
| 9 |  |  | Implementar paginación del listado, indicando la cantidad de resultados y conservando un estado vacío informativo cuando no existan coincidencias. |  |  |  |  |  |  |
| 10 |  |  | Implementar la activación de una cuenta inactiva mediante confirmación, persistir el cambio y actualizar inmediatamente el estado visible. |  |  |  |  |  |  |
| 11 |  |  | Implementar la inactivación de una cuenta activa mediante confirmación, impedir la auto-inactivación y bloquear el acceso posterior de la cuenta afectada. |  |  |  |  |  |  |
| 12 |  |  | Actualizar la información editada en el backend, devolver los campos acordados y comprobar que los cambios permanezcan después de recargar el módulo. |  |  |  |  |  |  |
| 13 |  |  | Registrar en auditoría cada creación, edición, activación, inactivación o rechazo, incluyendo actor, fecha, hora, resultado y cuenta involucrada. |  |  |  |  |  |  |
| 14 |  |  | Mostrar confirmaciones específicas después de crear, editar, activar o reactivar una cuenta, indicando qué administrador fue afectado. |  |  |  |  |  |  |
| 15 |  |  | Mostrar mensajes de error junto al campo o acción correspondiente, sin borrar datos válidos ni ocultar fallas reales del backend con información de demostración. |  |  |  |  |  |  |
| 16 |  |  | Ejecutar pruebas funcionales de creación, duplicados, validaciones, edición, búsqueda, filtros, paginación, permisos, estados y persistencia después de recargar. |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 26-08-2026 |  |  | Ampliación de requerimiento, condiciones y tareas con criterios verificables y alineación con la aplicación. |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-003 |  | **Nombre:** |  | Gestión de departamentos |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-02 |  |  |  |  |  |  |
| **Módulo:** |  |  | Administración |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Administrar departamentos de producción |  |  |  |  |
|  |  |  | **Para** |  | Organizar los empleados según su área de trabajo |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá mostrar una pantalla con: Registro de departamentos,  consulta de departamentos, edición de departamentos, listado de departamentos, cantidad de empleados asociados.búsqueda por nombre. Los departamentos registrados estarán disponibles en el registro de empleados |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | Que el administrador ingrese la información obligatoria de un departamento. |  |  |  |  |
|  |  |  | **Cuando:** |  | Guarde el formulario con datos válidos. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema registrará el departamento y lo mostrará disponible para futuras consultas y asignaciones. |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que ya exista un departamento con el mismo nombre. |  |  |  |  |
|  |  |  | **Cuando:** |  | El administrador intente registrarlo nuevamente. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema rechazará el duplicado y explicará qué dato debe corregirse. |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que falte información obligatoria o exista un valor inválido, como una capacidad fuera del rango permitido. |  |  |  |  |
|  |  |  | **Cuando:** |  | Se envíe el formulario. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema impedirá el guardado y señalará los campos que deben corregirse. |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que el departamento exista en el listado. |  |  |  |  |
|  |  |  | **Cuando:** |  | El administrador seleccione **Editar**. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema abrirá el formulario con la información actual para realizar cambios controlados. |  |  |  |  |
| **Condicion 05** |  |  | **Dado:** |  | Que el administrador modifique datos válidos de un departamento existente. |  |  |  |  |
|  |  |  | **Cuando:** |  | Confirme el guardado de los cambios. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema actualizará la información, conservará la relación con sus empleados y mostrará una confirmación. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | Que el departamento tenga o no tenga empleados asociados. |  |  |  |  |
|  |  |  | **Cuando:** |  | El administrador consulte su detalle. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará el departamento, su capacidad y la cantidad o listado de empleados relacionados. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | Que existan varios departamentos registrados. |  |  |  |  |
|  |  |  | **Cuando:** |  | Se realice una búsqueda por nombre. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará únicamente los departamentos que coincidan con el criterio ingresado. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | Que la búsqueda o consulta no encuentre departamentos. |  |  |  |  |
|  |  |  | **Cuando:** |  | Finalice la consulta. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema presentará un estado vacío claro e indicará que no hay coincidencias disponibles. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Definir la entidad departamento con nombre, descripción, capacidad y datos de control para representar cada área de trabajo. |  |  |  |  |  |  |
| 2 |  |  | Crear la estructura de almacenamiento con campos obligatorios, límites de capacidad y reglas que eviten departamentos duplicados. |  |  |  |  |  |  |
| 3 |  |  | Implementar las operaciones de registro, consulta, edición y validación de departamentos con respuestas comprensibles para la persona usuaria. |  |  |  |  |  |  |
| 4 |  |  | Diseñar el formulario de registro para capturar la información del departamento y validar los datos antes de enviarlos. |  |  |  |  |  |  |
| 5 |  |  | Diseñar el formulario de edición para mostrar la información actual y permitir cambios sin perder las relaciones existentes. |  |  |  |  |  |  |
| 6 |  |  | Construir el listado con nombre, capacidad, cantidad de empleados, búsqueda y acciones disponibles para cada departamento. |  |  |  |  |  |  |
| 7 |  |  | Implementar la búsqueda por nombre y actualizar los resultados mostrando un estado vacío cuando no haya coincidencias. |  |  |  |  |  |  |
| 8 |  |  | Relacionar cada departamento con los empleados para que pueda seleccionarse durante el registro o edición del personal. |  |  |  |  |  |  |
| 9 |  |  | Implementar la consulta de empleados asociados y mostrar la cantidad o detalle disponible desde el departamento seleccionado. |  |  |  |  |  |  |
| 10 |  |  | Validar la eliminación o modificación de un departamento cuando tenga empleados asociados, protegiendo la integridad de la información. |  |  |  |  |  |  |
| 11 |  |  | Registrar en auditoría las creaciones, ediciones, eliminaciones rechazadas y demás cambios relevantes del catálogo de departamentos. |  |  |  |  |  |  |
| 12 |  |  | Mostrar confirmaciones después de guardar o actualizar, indicando el departamento afectado y el resultado de la operación. |  |  |  |  |  |  |
| 13 |  |  | Mostrar mensajes de error junto al campo o acción correspondiente, conservando los datos válidos para facilitar la corrección. |  |  |  |  |  |  |
| 14 |  |  | Ejecutar pruebas funcionales de registro, duplicados, validaciones, edición, búsqueda, relaciones, eliminación y consulta sin resultados. |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 26-08-2026 |  |  | Ampliación de tareas y condiciones con resultados funcionales claros. |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-004 |  | **Nombre:** |  | Desactivar administrador |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-002 |  |  |  |  |  |  |
| **Módulo:** |  |  | Administracion de usuarios |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Desactivar una cuenta administrativa |  |  |  |  |
|  |  |  | **Para** |  | Impedir que usuarios no autorizados continúen accediendo al sistema |  |  |  |  |
| **Requerimiento:** |  |  | La interfaz mostrará: Tabla de administradores con estado (Activo/Inactivo), botón “Desactivar” en cada registro, ventana emergente de confirmación, mensajes de validación y confirmación |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que exista una cuenta administrativa activa en el listado. |  |  |  |  |
|  |  |  | **Cuando:** |  | El administrador seleccione **Desactivar**. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema solicitará confirmación y explicará el efecto de dejar la cuenta inactiva. |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que el administrador confirme la desactivación. |  |  |  |  |
|  |  |  | **Cuando:** |  | Presione **Aceptar** en el diálogo. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema marcará la cuenta como inactiva, actualizará el listado y mostrará una confirmación. |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que la cuenta se encuentre inactiva. |  |  |  |  |
|  |  |  | **Cuando:** |  | La persona intente autenticarse con sus credenciales. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema rechazará el acceso e informará de forma general que la cuenta no está habilitada. |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que la desactivación se haya completado correctamente. |  |  |  |  |
|  |  |  | **Cuando:** |  | Se consulte nuevamente el listado de administradores. |  |  |  |  |
|  |  |  | **Entonces:** |  | La cuenta aparecerá con estado **Inactivo** y conservará su registro para fines de consulta y auditoría. |  |  |  |  |
| **Condicion 05** |  |  | **Dado:** |  | Que la persona no tenga permisos suficientes para administrar cuentas. |  |  |  |  |
|  |  |  | **Cuando:** |  | Intente desactivar un administrador. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema rechazará la acción, no cambiará el estado y mostrará un mensaje de acceso denegado. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | Que una cuenta sea desactivada por una persona autorizada. |  |  |  |  |
|  |  |  | **Cuando:** |  | La operación finalice. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema registrará quién ejecutó la acción, cuándo ocurrió, qué cuenta afectó y cuál fue el resultado. |  |  |  |  |
| **Tareas** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Incorporar el estado activo o inactivo a la cuenta y definir cómo se representa para consulta y autenticación. |  |  |  |  |  |  |
| 2 |  |  | Agregar la acción **Desactivar** al registro de una cuenta activa, mostrando solo las opciones permitidas por su estado. |  |  |  |  |  |  |
| 3 |  |  | Diseñar una confirmación que explique la consecuencia de desactivar la cuenta y permita cancelar sin aplicar cambios. |  |  |  |  |  |  |
| 4 |  |  | Actualizar y persistir el estado de la cuenta para que el cambio se mantenga al consultar o recargar el listado. |  |  |  |  |  |  |
| 5 |  |  | Impedir la autenticación de cuentas inactivas desde el servidor y devolver una respuesta segura y comprensible. |  |  |  |  |  |  |
| 6 |  |  | Mostrar el estado actualizado en el listado y diferenciar visualmente cuentas activas e inactivas. |  |  |  |  |  |  |
| 7 |  |  | Registrar la desactivación con persona ejecutora, cuenta afectada, fecha, hora, resultado y motivo cuando corresponda. |  |  |  |  |  |  |
| 8 |  |  | Mostrar una confirmación posterior que indique que la cuenta quedó inactiva y que ya no puede iniciar sesión. |  |  |  |  |  |  |
| 9 |  |  | Mostrar errores de permisos, cuenta inexistente, sesión inválida o falla del servicio sin modificar información parcialmente. |  |  |  |  |  |  |
| 10 |  |  | Validar que la cuenta exista, que esté activa y que no corresponda a una operación prohibida sobre la cuenta propia. |  |  |  |  |  |  |
| 11 |  |  | Ejecutar pruebas funcionales de confirmación, cancelación, desactivación, autenticación posterior, permisos, persistencia y auditoría. |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 26-08-2026 |  |  | Ampliación de tareas y condiciones con resultados funcionales claros. |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-005 |  | **Nombre:** |  | Recuperación de contraseña de administrador |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-001 |  |  |  |  |  |  |
| **Módulo:** |  |  | Autenticación |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador  |  |  |  |  |
|  |  |  | **Requiero** |  | Recuperar mi contraseña en caso de olvido |  |  |  |  |
|  |  |  | **Para** |  | Poder acceder nuevamente al sistema sin perder mi cuenta |  |  |  |  |
| **Requerimiento:** |  |  | La interfaz mostrará: Enlace “Olvidé mi contraseña”, formulario para ingresar correo electrónico, mensajes de validación, confirmación de envío de correo con enlace seguro |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que el administrador no pueda ingresar y cuente con un correo registrado. |  |  |  |  |
|  |  |  | **Cuando:** |  | Seleccione **Olvidé mi contraseña** y solicite la recuperación. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema procesará la solicitud y enviará instrucciones mediante un enlace temporal, sin revelar datos de la cuenta. |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que el enlace de recuperación haya expirado o no sea válido. |  |  |  |  |
|  |  |  | **Cuando:** |  | El administrador intente abrirlo. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema rechazará la solicitud, mostrará un mensaje general y ofrecerá iniciar una nueva recuperación. |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que el enlace sea válido y la nueva contraseña cumpla la política definida. |  |  |  |  |
|  |  |  | **Cuando:** |  | El administrador confirme el cambio. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema actualizará la credencial de forma cifrada, invalidará el enlace y confirmará la recuperación. |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que la nueva contraseña sea débil, esté incompleta o no coincida con su confirmación. |  |  |  |  |
|  |  |  | **Cuando:** |  | Se intente guardar. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema impedirá el cambio y explicará de forma clara qué requisito debe corregirse. |  |  |  |  |
| **Condicion 05** |  |  | **Dado:** |  | Que la recuperación haya finalizado correctamente. |  |  |  |  |
|  |  |  | **Cuando:** |  | Se guarde la nueva contraseña. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema registrará el resultado y la fecha de la operación sin almacenar la contraseña en la auditoría. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | Que el correo ingresado no corresponda a una cuenta registrada. |  |  |  |  |
|  |  |  | **Cuando:** |  | Se solicite la recuperación. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará una respuesta general que no permita confirmar si el correo existe o no. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | Que el enlace ya haya sido utilizado para cambiar la contraseña. |  |  |  |  |
|  |  |  | **Cuando:** |  | Se intente reutilizarlo. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema rechazará el intento y solicitará generar un nuevo enlace de recuperación. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Diseñar la pantalla de recuperación con correo, instrucciones, estados de carga, confirmación y mensajes de error comprensibles. |  |  |  |  |  |  |
| 2 |  |  | Validar el correo y responder de forma uniforme para no revelar si existe una cuenta asociada. |  |  |  |  |  |  |
| 3 |  |  | Generar un enlace o token temporal, único y no predecible para iniciar el restablecimiento. |  |  |  |  |  |  |
| 4 |  |  | Definir la vigencia y el uso único del enlace, rechazando tokens vencidos, inválidos o reutilizados. |  |  |  |  |  |  |
| 5 |  |  | Validar la nueva contraseña y su confirmación según las reglas de seguridad establecidas. |  |  |  |  |  |  |
| 6 |  |  | Actualizar la credencial en la base de datos utilizando cifrado y sin exponer la contraseña original o nueva. |  |  |  |  |  |  |
| 7 |  |  | Registrar la solicitud y el resultado en auditoría, excluyendo enlaces, tokens y contraseñas del registro. |  |  |  |  |  |  |
| 8 |  |  | Mostrar mensajes de confirmación y error que orienten al administrador sin revelar información sensible. |  |  |  |  |  |  |
| 9 |  |  | Configurar la notificación de recuperación exitosa y recomendar iniciar sesión nuevamente con la nueva credencial. |  |  |  |  |  |  |
| 10 |  |  | Ejecutar pruebas funcionales de solicitud, correo no registrado, enlace vencido, enlace usado, contraseña inválida y recuperación exitosa. |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 26-08-2026 |  |  | Ampliación de tareas y condiciones con resultados funcionales claros. |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-006 |  | **Nombre:** |  | Bloqueo automático por intentos fallidos |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-001 |  |  |  |  |  |  |
| **Módulo:** |  |  | Autenticacion |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador  |  |  |  |  |
|  |  |  | **Requiero** |  | Bloquear cuentas tras múltiples intentos fallidos |  |  |  |  |
|  |  |  | **Para** |  | Proteger el sistema contra accesos indebidos |  |  |  |  |
| **Requerimiento:** |  |  | La interfaz mostrará: Mensaje de error tras intentos fallidos, notificación de bloqueo temporal, opción de recuperación de contraseña |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que una cuenta acumule varios intentos de autenticación fallidos dentro del período definido. |  |  |  |  |
|  |  |  | **Cuando:** |  | Se alcance el límite configurado. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema bloqueará temporalmente la cuenta y registrará el evento. |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que la cuenta se encuentre bloqueada. |  |  |  |  |
|  |  |  | **Cuando:** |  | La persona intente autenticarse, incluso con credenciales correctas. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema rechazará el acceso y mostrará un mensaje general con la condición de bloqueo y, si aplica, su duración. |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que la política permita recuperar o solicitar el desbloqueo de una cuenta bloqueada. |  |  |  |  |
|  |  |  | **Cuando:** |  | La persona ingrese el dato de contacto requerido. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema procesará la solicitud mediante un mecanismo seguro y no revelará información de la cuenta. |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que una persona o proceso no tenga autorización para desbloquear cuentas manualmente. |  |  |  |  |
|  |  |  | **Cuando:** |  | Intente ejecutar el desbloqueo. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema rechazará la acción, mantendrá el bloqueo y mostrará un mensaje de acceso denegado. |  |  |  |  |
| Condición 05 |  |  | **Dado:** |  | Que haya finalizado el tiempo de bloqueo y la cuenta no tenga otra restricción. |  |  |  |  |
|  |  |  | **Cuando:** |  | La persona intente iniciar sesión nuevamente. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema restablecerá el acceso únicamente si las credenciales son válidas y dejará constancia del desbloqueo. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Implementar el contador de intentos fallidos por cuenta, controlando el período de acumulación y reiniciándolo según la política definida. |  |  |  |  |  |  |
| 2 |  |  | Configurar el bloqueo temporal cuando se alcance el límite, evitando que el acceso pueda reintentarse durante la restricción. |  |  |  |  |  |  |
| 3 |  |  | Mostrar mensajes generales de error que orienten a la persona sin indicar datos que faciliten descubrir una cuenta. |  |  |  |  |  |  |
| 4 |  |  | Informar de forma clara que la cuenta está bloqueada y comunicar las alternativas disponibles para recuperar el acceso. |  |  |  |  |  |  |
| 5 |  |  | Registrar intentos fallidos, bloqueos y desbloqueos con fecha, hora, cuenta, resultado y origen disponible para auditoría. |  |  |  |  |  |  |
| 6 |  |  | Integrar la recuperación o solicitud de desbloqueo con el mecanismo seguro definido para credenciales y cuentas bloqueadas. |  |  |  |  |  |  |
| 7 |  |  | Definir el tiempo de bloqueo y las reglas para contar, reiniciar y conservar los intentos fallidos. |  |  |  |  |  |  |
| 8 |  |  | Implementar el desbloqueo automático al finalizar el período, validando que no exista una causa adicional de inactividad. |  |  |  |  |  |  |
| 9 |  |  | Configurar una notificación segura cuando el desbloqueo concluya, sin incluir credenciales ni tokens reutilizables. |  |  |  |  |  |  |
| 10 |  |  | Ejecutar pruebas funcionales de conteo, límite, bloqueo, reintento, recuperación, permisos, vencimiento y registro de auditoría. |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 26-08-2026 |  |  | Ampliación de tareas y condiciones con resultados funcionales claros. |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-007 |  | **Nombre:** |  | Cierre de sesión por inactividad |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-001 |  |  |  |  |  |  |
| **Módulo:** |  |  | Autenticación |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador  |  |  |  |  |
|  |  |  | **Requiero** |  | Que el sistema cierre sesión automáticamente tras un tiempo de inactividad |  |  |  |  |
|  |  |  | **Para** |  | Proteger el acceso al sistema |  |  |  |  |
| **Requerimiento:** |  |  | La interfaz mostrará: Mensaje de advertencia antes de cerrar sesión, redirección automática al login tras cierre, registro de auditoría de cierre por inactividad |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que exista una sesión administrativa activa sin interacción durante el período de advertencia. |  |  |  |  |
|  |  |  | **Cuando:** |  | Se aproxime el tiempo máximo de inactividad. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará una advertencia clara y permitirá continuar la sesión si la persona interactúa. |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que se supere el tiempo máximo de inactividad configurado. |  |  |  |  |
|  |  |  | **Cuando:** |  | No se detecte interacción válida. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema cerrará la sesión, retirará la información local y dejará de permitir operaciones protegidas. |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que la sesión se cierre automáticamente por inactividad. |  |  |  |  |
|  |  |  | **Cuando:** |  | Finalice el proceso de cierre. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema registrará el evento con fecha, hora, usuario y motivo, sin guardar credenciales. |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que la sesión haya expirado por inactividad. |  |  |  |  |
|  |  |  | **Cuando:** |  | La persona intente consultar o modificar información protegida. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema rechazará la operación y solicitará autenticarse nuevamente. |  |  |  |  |
| **Condicion 05** |  |  | **Dado:** |  | Que exista una configuración de tiempo de inactividad autorizada. |  |  |  |  |
|  |  |  | **Cuando:** |  | Se guarde o actualice el parámetro. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema validará el valor y lo aplicará en las nuevas sesiones según la política definida. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | Que el sistema haya cerrado la sesión por inactividad. |  |  |  |  |
|  |  |  | **Cuando:** |  | La persona sea redirigida al inicio de sesión. |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema informará el motivo del cierre sin revelar datos de la sesión anterior. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Implementar el temporizador de inactividad para controlar el tiempo sin interacción y reiniciarlo con acciones válidas de la persona usuaria. |  |  |  |  |  |  |
| 2 |  |  | Diseñar la advertencia previa al cierre con tiempo restante, motivo y una acción clara para mantener la sesión activa. |  |  |  |  |  |  |
| 3 |  |  | Implementar el cierre automático cuando finalice el tiempo permitido, eliminando la información de sesión disponible en el navegador. |  |  |  |  |  |  |
| 4 |  |  | Redirigir al inicio de sesión y bloquear las rutas protegidas después de que la sesión haya expirado. |  |  |  |  |  |  |
| 5 |  |  | Registrar el cierre por inactividad con usuario, fecha, hora y motivo, sin almacenar contraseñas ni tokens. |  |  |  |  |  |  |
| 6 |  |  | Validar el tiempo configurado, sus límites y el permiso requerido antes de aplicarlo a las sesiones. |  |  |  |  |  |  |
| 7 |  |  | Permitir cancelar la advertencia mediante interacción válida y conservar la sesión solo mientras siga vigente. |  |  |  |  |  |  |
| 8 |  |  | Mostrar mensajes de cierre, sesión expirada y errores de configuración con lenguaje claro y sin detalles técnicos. |  |  |  |  |  |  |
| 9 |  |  | Ejecutar pruebas unitarias del contador, reinicio del temporizador, advertencia, expiración y limpieza de la sesión. |  |  |  |  |  |  |
| 10 |  |  | Ejecutar pruebas funcionales de inactividad, continuidad por interacción, redirección, bloqueo de rutas, auditoría y nueva autenticación. |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 26-08-2026 |  |  | Ampliación de tareas y condiciones con resultados funcionales claros. |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-008 |  | **Nombre:** |  | Registro masivo de empleados (CSV) |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-002 |  |  |  |  |  |  |
| **Módulo:** |  |  | Gestión de empleados |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Cargar masivamente empleados mediante archivo CSV |  |  |  |  |
|  |  |  | **Para** |  | Registrar varios empleados de manera rápida y eficiente |  |  |  |  |
| **Requerimiento:** |  |  | La interfaz mostrará: Botón “Importar archivo CSV”, campo para seleccionar archivo,  mensajes de validación de estructura, reporte de importación con registros exitosos y rechazados |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | que el administrador seleccione un archivo CSV correcto |  |  |  |  |
|  |  |  | **Cuando:** |  | cuando inicie la importación |  |  |  |  |
|  |  |  | **Entonces:** |  | entonces el sistema registrará todos los empleados válidos |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | que el archivo tenga registros duplicados |  |  |  |  |
|  |  |  | **Cuando:** |  | cuando se procese la información |  |  |  |  |
|  |  |  | **Entonces:** |  | entonces el sistema notificará los rechazados |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | que el archivo tenga formato incorrecto |  |  |  |  |
|  |  |  | **Cuando:** |  | cuando se intente cargar |  |  |  |  |
|  |  |  | **Entonces:** |  | entonces el sistema mostrará mensaje de error |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | que finalice la importación |  |  |  |  |
|  |  |  | **Cuando:** |  | cuando se termine el proceso |  |  |  |  |
|  |  |  | **Entonces:** |  | entonces el sistema mostrará número de registros exitosos y con errores |  |  |  |  |
| **Condicion 05** |  |  | **Dado:** |  | que se registre la importación |  |  |  |  |
|  |  |  | **Cuando:** |  | cuando se complete |  |  |  |  |
|  |  |  | **Entonces:** |  | entonces el sistema guardará la acción en auditoría |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que se intente cargar un archivo vacío |  |  |  |  |
|  |  |  | **Cuando:** |  | cuando se ejecute la acción |  |  |  |  |
|  |  |  | **Entonces:** |  | entonces el sistema mostrará “Archivo sin registros” |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que se intente cargar un archivo con caracteres inválidos |  |  |  |  |
|  |  |  | **Cuando:** |  | cuando se procese |  |  |  |  |
|  |  |  | **Entonces:** |  | entonces el sistema mostrará mensaje de error |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | Que el archivo contenga empleados ya registrados |  |  |  |  |
|  |  |  | **Cuando:** |  | Se procese la información |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema marcará esos registros como duplicados y no los importará |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | Que el archivo contenga campos obligatorios vacíos |  |  |  |  |
|  |  |  | **Cuando:** |  | Se procese la información |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema rechazará esos registros y los listará en el reporte |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | Que se complete la importación |  |  |  |  |
|  |  |  | **Cuando:** |  | Se consulte el historial |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará fecha, hora y usuario que realizó la carga |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Diseñar interfaz para importar CSV |  |  |  |  |  |  |
| 2 |  |  | Validar estructura del archivo |  |  |  |  |  |  |
| 3 |  |  | Leer contenido del archivo |  |  |  |  |  |  |
| 4 |  |  | Validar registros duplicados |  |  |  |  |  |  |
| 5 |  |  | Validar campos obligatorios |  |  |  |  |  |  |
| 6 |  |  | Registrar empleados válidos |  |  |  |  |  |  |
| 7 |  |  | Mostrar reporte de importación |  |  |  |  |  |  |
| 8 |  |  | Registrar acción en auditoría |  |  |  |  |  |  |
| 9 |  |  | Mostrar mensajes de error |  |  |  |  |  |  |
| 10 |  |  | Mostrar mensajes de éxito |  |  |  |  |  |  |
| 11 |  |  | Validar archivos vacíos |  |  |  |  |  |  |
| 12 |  |  | Validar caracteres inválidos |  |  |  |  |  |  |
| 13 |  |  | Realizar pruebas funcionales |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-009 |  | **Nombre:** |  | Editar información de empleado |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-008 |  |  |  |  |  |  |
| **Módulo:** |  |  | Gestión de empleados |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Modificar la información de un empleado registrado |  |  |  |  |
|  |  |  | **Para** |  | Mantener actualizados los datos de los empleados en el sistema |  |  |  |  |
| **Requerimiento:** |  |  | La interfaz mostrará: Tabla con listado de empleados, botón “Editar” en cada registro, formulario con datos actuales del empleado, botón “Actualizar”, mensajes de validación y confirmación |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que el empleado exista  |  |  |  |  |
|  |  |  | **Cuando:** |  | Se seleccione “Editar” |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará la información actual en el formulario |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que se modifique la información correctamente  |  |  |  |  |
|  |  |  | **Cuando:** |  | Se guarde la modificación |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema actualizará los datos del empleado |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que se intente modificar con campos vacíos |  |  |  |  |
|  |  |  | **Cuando:** |  | Se guarde la información |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará mensajes de validación |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que se intente modificar con datos duplicados |  |  |  |  |
|  |  |  | **Cuando:** |  | Se guarde la información |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema rechazará la actualización |  |  |  |  |
| **Condicion 05** |  |  | **Dado:** |  | Que se complete la modificación |  |  |  |  |
|  |  |  | **Cuando:** |  | Se guarde la información |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema registrará la acción en auditoría |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | Que se intente editar un empleado inexistente |  |  |  |  |
|  |  |  | **Cuando:** |  | Se ejecute la acción |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará “Empleado no encontrado” |  |  |  |  |
|   **Condicion 07** |  |  | **Dado:** |  | Que se intente editar sin permisos |  |  |  |  |
|  |  |  | **Cuando:** |  | Se ejecute la acción |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará “Acceso denegado” |  |  |  |  |
| **Condicion 08** |  |  | **Dado:** |  | Que se guarde la modificación |  |  |  |  |
|  |  |  | **Cuando:** |  | Se consulte el historial |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará fecha, hora y usuario que realizó la edición |  |  |  |  |
| **Condicion 09** |  |  | **Dado:** |  | Que se modifique información sensible (documento de identidad) |  |  |  |  |
|  |  |  | **Cuando:** |  | Se guarde la acción |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema solicitará confirmación adicional |  |  |  |  |
| **Condicion 10** |  |  | **Dado:** |  | Que se edite un empleado |  |  |  |  |
|  |  |  | **Cuando:** |  | Se guarde la acción |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema enviará notificación al administrador principal |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Consultar empleado existente |  |  |  |  |  |  |
| 2 |  |  | Mostrar formulario de edición con datos actuales |  |  |  |  |  |  |
| 3 |  |  | Validar campos obligatorios |  |  |  |  |  |  |
| 4 |  |  | Validar duplicados |  |  |  |  |  |  |
| 5 |  |  | Guardar cambios en base de datos |  |  |  |  |  |  |
| 6 |  |  | Registrar acción en auditoría |  |  |  |  |  |  |
| 7 |  |  | Mostrar mensajes de éxito |  |  |  |  |  |  |
| 8 |  |  | Mostrar mensajes de error |  |  |  |  |  |  |
| 9 |  |  | Validar permisos de usuario |  |  |  |  |  |  |
| 10 |  |  | Realizar pruebas funcionales |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-010 |  | **Nombre:** |  | Autorizar acceso al ROOM\_911 |  |  |  |  |
| **Complejidad:** |  |  | Alta |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-09 |  |  |  |  |  |  |
| **Módulo:** |  |  | Gestión de empleados |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador  |  |  |  |  |
|  |  |  | **Requiero** |  | Autorizar el acceso de un empleado al ROOM\_911 |  |  |  |  |
|  |  |  | **Para** |  | Permitir que solo personal autorizado ingrese al área restringida |  |  |  |  |
| **Requerimiento:** |  |  | La interfaz mostrará: Tabla de empleados con estado de autorización (Autorizado/No autorizado), botón “Autorizar acceso” en cada registro, ventana emergente de confirmación, mensajes de validación y confirmación, indicador visual del estado de acceso |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que el empleado exista en el sistema |  |  |  |  |
|  |  |  | **Cuando:** |  | Se seleccione “Autorizar acceso” |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema solicitará confirmación |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que el administrador confirme la acción |  |  |  |  |
|  |  |  | **Cuando:** |  | Presione “Aceptar” |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema cambiará el estado del empleado a “Autorizado” |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que el empleado esté autorizado |  |  |  |  |
|  |  |  | **Cuando:** |  | Intente ingresar al ROOM\_911 |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema permitirá el acceso |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que el empleado no esté autorizado  |  |  |  |  |
|  |  |  | **Cuando:** |  | Intente ingresar al ROOM\_911  |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema rechazará el acceso mostrando “Acceso denegado” |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | Que se autorice un empleado |  |  |  |  |
|  |  |  | **Cuando:** |  | Se confirme la acción |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema registrará la operación en auditoría |  |  |  |  |
| **Condicion 06** |  |  | **Dado:** |  | Que se intente autorizar un empleado inexistente |  |  |  |  |
|  |  |  | **Cuando:** |  | Se ejecute la acción |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará “Empleado no encontrado” |  |  |  |  |
| **Condicion 07** |  |  | **Dado:** |  | Que se intente autorizar sin permisos |  |  |  |  |
|  |  |  | **Cuando:** |  | Se ejecute la acción |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará “Acceso denegado” |  |  |  |  |
| **Condicion 08** |  |  | **Dado:** |  | Que se autorice un empleado |  |  |  |  |
|  |  |  | **Cuando:** |  | Se consulte el historial |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará fecha, hora y usuario que realizó la autorización |  |  |  |  |
| **Condicion 09** |  |  | **Dado:** |  | Que se intente autorizar un empleado con datos incompletos |  |  |  |  |
|  |  |  | **Cuando:** |  | Se ejecute la acción |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará mensaje de validación |  |  |  |  |
| **Condicion 10** |  |  | **Dado:** |  | Que se autorice un empleado |  |  |  |  |
|  |  |  | **Cuando:** |  | Se guarde la acción |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema enviará notificación al administrador principal |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Consultar empleado existente |  |  |  |  |  |  |
| 2 |  |  | Mostrar listado de empleados con estado de autorización |  |  |  |  |  |  |
| 3 |  |  | Crear botón “Autorizar acceso” |  |  |  |  |  |  |
| 4 |  |  | Solicitar confirmación de acción |  |  |  |  |  |  |
| 5 |  |  | Mostrar resultados |  |  |  |  |  |  |
| 6 |  |  | Mostrar mensaje de cuando no existan coincidencias |  |  |  |  |  |  |
| 7 |  |  | Hacer pruebas |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-11 |  | **Nombre:** |  | Autorizar acceso al ROOM\_911 |  |  |  |  |
| **Complejidad:** |  |  | Alta |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-010 |  |  |  |  |  |  |
| **Módulo:** |  |  | Gestión de empleados |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Autorizar el acceso de un empleado al ROOM\_911 |  |  |  |  |
|  |  |  | **Para** |  | Permitir que solo personal autorizado ingrese al área restringida |  |  |  |  |
| **Requerimiento:** |  |  | La interfaz mostrará: Tabla de empleados con estado de autorización (Autorizado/No autorizado), botón “Autorizar acceso” en cada registro, ventana emergente de confirmación, mensajes de validación y confirmación indicador visual del estado de acceso |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que el empleado exista en el sistema |  |  |  |  |
|  |  |  | **Cuando:** |  | Se seleccione “Autorizar acceso” |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema solicitará confirmación |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que el administrador confirme la acción |  |  |  |  |
|  |  |  | **Cuando:** |  | Presione “Aceptar” |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema cambiará el estado del empleado a “Autorizado” |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que el empleado esté autorizado |  |  |  |  |
|  |  |  | **Cuando:** |  | Intente ingresar al ROOM\_911 |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema permitirá el acceso |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que el empleado no esté autorizado |  |  |  |  |
|  |  |  | **Cuando:** |  | Intente ingresar al ROOM\_911 |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema rechazará el acceso mostrando “Acceso denegado” |  |  |  |  |
| **Condicion 05** |  |  | **Dado:** |  | Que se autorice un empleado |  |  |  |  |
|  |  |  | **Cuando:** |  | Se confirme la acción |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema registrará la operación en auditoría |  |  |  |  |
| **Condicion 06** |  |  | **Dado:** |  | Que se intente autorizar un empleado inexistente |  |  |  |  |
|  |  |  | **Cuando:** |  | Se ejecute la acción |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará “Empleado no encontrado” |  |  |  |  |
| **Condicion 07** |  |  | **Dado:** |  | Que se intente autorizar sin permisos |  |  |  |  |
|  |  |  | **Cuando:** |  | Se ejecute la acción |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará “Acceso denegado” |  |  |  |  |
| **Condicion 08** |  |  | **Dado:** |  | Que se autorice un empleado |  |  |  |  |
|  |  |  | **Cuando:** |  | Se consulte el historial |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará fecha, hora y usuario que realizó la autorización |  |  |  |  |
| **Condicion 09** |  |  | **Dado:** |  | Que se intente autorizar un empleado con datos incompletos |  |  |  |  |
|  |  |  | **Cuando:** |  | Se ejecute la acción |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará mensaje de validación |  |  |  |  |
| **Condicion 10** |  |  | **Dado:** |  | Que se autorice un empleado |  |  |  |  |
|  |  |  | **Cuando:** |  | Se guarde la acción |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema enviará notificación al administrador principal |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Consultar empleado existente |  |  |  |  |  |  |
| 2 |  |  | Mostrar listado de empleados con estado de autorización |  |  |  |  |  |  |
| 3 |  |  | Crear botón “Autorizar acceso” |  |  |  |  |  |  |
| 4 |  |  | Solicitar confirmación de acción |  |  |  |  |  |  |
| 5 |  |  | Actualizar estado del empleado |  |  |  |  |  |  |
| 6 |  |  | Validar permisos de usuario |  |  |  |  |  |  |
| 7 |  |  | Validar existencia del empleado |  |  |  |  |  |  |
| 8 |  |  | Registrar acción en auditoría |  |  |  |  |  |  |
| 9 |  |  | Mostrar mensajes de éxito |  |  |  |  |  |  |
| 10 |  |  | Mostrar mensajes de error |  |  |  |  |  |  |
| 11 |  |  | Configurar notificación al administrador principal |  |  |  |  |  |  |
| 12 |  |  | Realizar pruebas funcionales |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-012 |  | **Nombre:** |  | Buscar empleados |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-010 |  |  |  |  |  |  |
| **Módulo:** |  |  | Gestión de empleados |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Buscar empleados registrados en el sistema |  |  |  |  |
|  |  |  | **Para** |  | Localizar rápidamente la información de un empleado específico |  |  |  |  |
| **Requerimiento:** |  |  | La interfaz mostrará: Campo de búsqueda por nombre, identificación o departamento, botón “Buscar”, tabla de resultados con datos básicos del empleado (nombre, identificación, departamento, estado), mensajes de validación y confirmación |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que existan empleados registrados |  |  |  |  |
|  |  |  | **Cuando:** |  | Se ingrese un criterio válido en el campo de búsqueda |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará los resultados correspondientes |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que no existan coincidencias |  |  |  |  |
|  |  |  | **Cuando:** |  | Se ejecute la búsqueda |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará “No se encontraron resultados” |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que se ingrese un campo vacío |  |  |  |  |
|  |  |  | **Cuando:** |  | Se presione “Buscar” |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará mensaje de validación solicitando ingresar un criterio   |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que se realice una búsqueda |  |  |  |  |
|  |  |  | **Cuando:** |  | Se obtengan resultados |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema permitirá ordenar la tabla por nombre, identificación o departamento |  |  |  |  |
| **Condicion 05** |  |  | **Dado:** |  | Que se realice una búsqueda por estado |  |  |  |  |
|  |  |  | **Cuando:** |  | Se obtengan resultados |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema permitirá filtrar los resultados por estado (activo/inactivo) |  |  |  |  |
| **Condicion 06** |  |  | **Dado:** |  | Que se intente buscar un empleado inexistente |  |  |  |  |
|  |  |  | **Cuando:** |  | Se ejecute la búsqueda |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará mensaje “Empleado no encontrado” |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Diseñar campo de búsqueda en interfaz |  |  |  |  |  |  |
| 2 |  |  | Implementar botón “Buscar” |  |  |  |  |  |  |
| 3 |  |  | Implementar búsqueda por nombre |  |  |  |  |  |  |
| 4 |  |  | Implementar búsqueda por identificación |  |  |  |  |  |  |
| 5 |  |  | Implementar búsqueda por departamentos |  |  |  |  |  |  |
| 6 |  |  | Mostrar resultados en tabla |  |  |  |  |  |  |
| 7 |  |  | Implementar ordenamiento de resultados |  |  |  |  |  |  |
| 8 |  |  | Implementar filtros por estado |  |  |  |  |  |  |
| 9 |  |  | Mostrar cantidad de coincidencias |  |  |  |  |  |  |
| 10 |  |  | Mostrar mensajes de éxito y error |  |  |  |  |  |  |
| 11 |  |  | Realizar pruebas funcionales |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-013 |  | **Nombre:** |  | Filtrar empleados por departamento |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-012 |  |  |  |  |  |  |
| **Módulo:** |  |  | Control de accesos  |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Filtrar empleados por departamento |  |  |  |  |
|  |  |  | **Para** |  | Visualizar únicamente los empleados pertenecientes a un área específica |  |  |  |  |
| **Requerimiento:** |  |  | La interfaz mostrará: Campo desplegable con lista de departamentos, botón “Filtrar”, tabla de resultados con empleados del departamento seleccionado, mensajes de validación y confirmación |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que existan empleados registrados en varios departamentos |  |  |  |  |
|  |  |  | **Cuando:** |  | Se seleccione un departamento en el filtro |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará únicamente los empleados de ese departamento |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que se seleccione un departamento sin empleados |  |  |  |  |
|  |  |  | **Cuando:** |  | Se ejecute el filtro |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará “No se encontraron empleados” |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que se seleccione un departamento válido |  |  |  |  |
|  |  |  | **Cuando:** |  | Se ejecute el filtro |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará la cantidad total de empleados encontrados |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que se seleccione un departamento inexistente |  |  |  |  |
|  |  |  | **Cuando:** |  | Se ejecute el filtro |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará mensaje “Departamento no encontrado” |  |  |  |  |
| **Condicion 05** |  |  | **Dado:** |  | Que se seleccione un departamento |  |  |  |  |
|  |  |  | **Cuando:** |  | Se ejecute el filtro |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema permitirá ordenar la tabla por nombre, identificación o estado |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Diseñar campo desplegable de departamentos |  |  |  |  |  |  |
| 2 |  |  | Implementar botón “Filtrar” |  |  |  |  |  |  |
| 3 |  |  | Validar existencia del departamento seleccionado |  |  |  |  |  |  |
| 4 |  |  | Mostrar resultados en tabla |  |  |  |  |  |  |
| 5 |  |  | Mostrar cantidad de empleados encontrados |  |  |  |  |  |  |
| 6 |  |  | Mostrar mensajes de error y éxito |  |  |  |  |  |  |
| 7 |  |  | Implementar paginación de resultados |  |  |  |  |  |  |
| 8 |  |  | Realizar pruebas funcionales |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-014 |  | **Nombre:** |  | Validar duplicados en empleados |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-009, HU-010 |  |  |  |  |  |  |
| **Módulo:** |  |  | Gestión de empleadods |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Validar que no existan empleados duplicados en el sistema |  |  |  |  |
|  |  |  | **Para** |  | Mantener la integridad de la información y evitar registros repetidos |  |  |  |  |
| **Requerimiento:** |  |  | La interfaz mostrará: Formulario de registro de empleados con validación automática, mensajes de error en caso de duplicados, reporte de registros rechazados por duplicidad, indicador visual de campos conflictivos |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que se intente registrar un empleado con identificación ya existente |  |  |  |  |
|  |  |  | **Cuando:** |  | Se guarde el formulario |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará mensaje “Empleado ya registrado” |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que se intente registrar un empleado con correo electrónico duplicado |  |  |  |  |
|  |  |  | **Cuando:** |  | Se guarde el formulario |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema rechazará el registro y mostrará mensaje de error |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que se intente registrar un empleado con nombre y documento idénticos a otro |  |  |  |  |
|  |  |  | **Cuando:** |  | Se guarde el formulario |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema marcará el registro como duplicado |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que se intente registrar un empleado duplicado mediante carga masiva (CSV) |  |  |  |  |
|  |  |  | **Cuando:** |  | Se procese el archivo |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema listará los registros rechazados en el reporte |  |  |  |  |
| **Condicion 05** |  |  | **Dado:** |  | Que se intente registrar un empleado inexistente |  |  |  |  |
|  |  |  | **Cuando:** |  | Se guarde la información |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema permitirá el registro sin error |  |  |  |  |
| **Condición 06** |  |  | **Dado:**  |  | Que se intente registrar un empleado duplicado |  |  |  |  |
|  |  |  | **Cuando:** |  | Se consulte el historial |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará fecha, hora y usuario que intentó la acción |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Diseñar validación automática en formulario de empleados |  |  |  |  |  |  |
| 2 |  |  | Validar identificación única |  |  |  |  |  |  |
| 3 |  |  | Validar correo electrónico único |  |  |  |  |  |  |
| 4 |  |  | Mostrar mensajes de error en interfaz |  |  |  |  |  |  |
| 5 |  |  | Mostrar mensajes de éxito en registros válidos |  |  |  |  |  |  |
| 6 |  |  | Mostrar mensajes de éxito en registros válidos |  |  |  |  |  |  |
| 7 |  |  | Registrar acción en auditoría |  |  |  |  |  |  |
| 8 |  |  | Realizar pruebas funcionales |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-015 |  | **Nombre:** |  | Exportar listado de empleados |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-012 , HU-013 |  |  |  |  |  |  |
| **Módulo:** |  |  | Gestión de empleados |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Exportar el listado de empleados del sistema |  |  |  |  |
|  |  |  | **Para** |  | Generar reportes externos y compartir información de manera organizada |  |  |  |  |
| **Requerimiento:** |  |  | La interfaz mostrará: Botón “Exportar” en la pantalla de listado de empleados ,opciones de exportación (CSV, PDF, Excel), mensajes de validación y confirmación, indicador visual de progreso de exportación |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que existan empleados registrados  |  |  |  |  |
|  |  |  | **Cuando:** |  | Se seleccione “Exportar” |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema generará archivo con todos los empleados |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que se seleccione formato CSV |  |  |  |  |
|  |  |  | **Cuando:** |  | Se ejecute la exportación |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema generará archivo separado por comas |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que se seleccione formato PDF |  |  |  |  |
|  |  |  | **Cuando:** |  | Se ejecute la exportación |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema generará archivo con tabla de empleados |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que se seleccione formato Excel |  |  |  |  |
|  |  |  | **Cuando:** |  | Se ejecute la exportación |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema generará archivo con hojas organizadas |  |  |  |  |
| **Condicion 05** |  |  | **Dado:** |  | Que no existan empleados registrados |  |  |  |  |
|  |  |  | **Cuando:** |  | Se intente exportar |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará “No hay registros para exportar” |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | Que se ejecute una exportación |  |  |  |  |
|  |  |  | **Cuando:** |  | Se complete la acción |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará mensaje de éxito y permitirá descargar el archivo |  |  |  |  |
| **Condicion 07** |  |  | **Dado:** |  | Que se intente exportar sin permisos |  |  |  |  |
|  |  |  | **Cuando:** |  | Se ejecute la acción |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará “Acceso denegado” |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Diseñar botón “Exportar” en interfaz |  |  |  |  |  |  |
| 2 |  |  | Implementar opciones de exportación (CSV, PDF, Excel) |  |  |  |  |  |  |
| 3 |  |  | Validar existencia de empleados registrados |  |  |  |  |  |  |
| 4 |  |  | Generar archivo CSV con separadores correctos |  |  |  |  |  |  |
| 5 |  |  | Generar archivo PDF con tabla de empleados |  |  |  |  |  |  |
| 6 |  |  | Generar archivo Excel con hojas organizadas |  |  |  |  |  |  |
| 7 |  |  | Mostrar mensajes de éxito y error |  |  |  |  |  |  |
| 8 |  |  | Mostrar indicador visual de progreso |  |  |  |  |  |  |
| 9 |  |  | Realizar pruebas funcionales |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-016 |  | **Nombre:** |  | Gestión de departamentos |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-03 |  |  |  |  |  |  |
| **Módulo:** |  |  | Administración  |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Administrar los departamentos de producción |  |  |  |  |
|  |  |  | **Para** |  | Asignar a los empleados al área correspondiente |  |  |  |  |
| **Requerimiento:** |  |  | El sistema debe permitir registrar, consultar, modificar y administrar los departamentos utilizados para clasificar los empleados del Room\_911 |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que el administrador ingrese la información del departamento |  |  |  |  |
|  |  |  | **Cuando:** |  | Cuando realice el registro |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema almacenara correctamente el nuevo departamento  |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que exista un departamento registrado  |  |  |  |  |
|  |  |  | **Cuando:** |  | El administrador modifique su información |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema actualizará los datos |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que existan empleados asociados a un departamento |  |  |  |  |
|  |  |  | **Cuando:** |  | Se administrador consulte dicho departamento |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará todos los empleados relacionados |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que el departamento sea utilizado por empleados registrados |  |  |  |  |
|  |  |  | **Cuando:** |  | El administrador intenta eliminarlo  |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema impedirá la eliminación hasta que no  existan |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Diseñar el módulo de departamentos |  |  |  |  |  |  |
| 2 |  |  | Crear formulario de registro |  |  |  |  |  |  |
| 3 |  |  | Permitir editar departamentos |  |  |  |  |  |  |
| 4 |  |  | Validar relaciones con empleados |  |  |  |  |  |  |
| 5 |  |  | Consultar departamentos registrados  |  |  |  |  |  |  |
| 6 |  |  | Mostrar mensajes de confirmación y error |  |  |  |  |  |  |
| 7 |  |  | Realizar pruebas del módulo  |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-17 |  | **Nombre:** |  | Cambiar contraseña del administrador |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-05 |  |  |  |  |  |  |
| **Módulo:** |  |  | Administración de usuarios |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Cambiar mi contraseña |  |  |  |  |
|  |  |  | **Para** |  | Mantener la seguridad de mi cuenta y proteger el acceso al módulo ROOM\_911 |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá permitir el cambio de contraseña cuando un administrador lo necesite |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que el administrador quiera cambiar la contraseña |  |  |  |  |
|  |  |  | **Cuando:** |  | Cuando seleccione la opción “Cambiar contraseña” |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema debe solicitar la contraseña actual del administrador antes de permitir el cambio |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que se cambie la contraseña  |  |  |  |  |
|  |  |  | **Cuando:** |  | El administrador modifique su contraseña |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema debe solicitar una nueva contraseña y su respectiva confirmación |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que la contraseña nueva no sea idéntica a la confirmación  |  |  |  |  |
|  |  |  | **Cuando:** |  | Se haga el cambio de contraseña |  |  |  |  |
|  |  |  | **Entonces:** |  | La nueva contraseña y la confirmación deben coincidir para continuar con el proceso  |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que el proceso de cambiar de contraseña continue |  |  |  |  |
|  |  |  | **Cuando:** |  | La confirmación coincida con la nueva contraseña  |  |  |  |  |
|  |  |  | **Entonces:** |  | La contraseña debe cumplir con los requisitos mínimos de seguridad establecidos por el sistema  |  |  |  |  |
| **Condicion 05** |  |  | **Dado:** |  | Que la contraseña sea cambiada  |  |  |  |  |
|  |  |  | **Cuando:** |  | Se cumpla con los requisitos de seguridad  |  |  |  |  |
|  |  |  | **Entonces:** |  | La contraseña debe almacenarse de forma segura utilizando un mecanismo de cifrado |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | Guardada la contraseña |  |  |  |  |
|  |  |  | **Cuando:** |  | Se finalice el proceso  |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema debe mostrar un mensaje indicando que la contraseña fue actualizada correctamente |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Diseñar interfaz para el cambio de contraseña  |  |  |  |  |  |  |
| 2 |  |  | Validar la contraseña actual |  |  |  |  |  |  |
| 3 |  |  | Validar la nueva contraseña  |  |  |  |  |  |  |
| 4 |  |  | Validar relaciones con empleados |  |  |  |  |  |  |
| 5 |  |  | Encriptar la contraseña   |  |  |  |  |  |  |
| 6 |  |  | Actualizar la información en la base de datos |  |  |  |  |  |  |
| 7 |  |  | Mostrar mensaje de confirmación  |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

.

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-18 |  | **Nombre:** |  | Recuperar contraseña del administrador |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-05 |  |  |  |  |  |  |
| **Módulo:** |  |  | Administración de usuarios |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Recuperar la contraseña |  |  |  |  |
|  |  |  | **Para** |  | Volver a acceder al sistema cuando la olvide |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá permitir la recuperación de contraseña  |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que el administrador quiera recuperar la contraseña |  |  |  |  |
|  |  |  | **Cuando:** |  | Ingrese al apartado de “Recuperar contraseña” |  |  |  |  |
|  |  |  | **Entonces:** |  | El administrador debe ingresar el correo electrónico registrado |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que el correo está registrado  |  |  |  |  |
|  |  |  | **Cuando:** |  | El administrador ingresa el correo |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema debe verificar que el correo pertenezca a un administrador registrado |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que el administrador ingrese al apartado |  |  |  |  |
|  |  |  | **Cuando:** |  | El administrador seleccione la opción “Generar enlace” |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema debe generar un enlace seguro de recuperación |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que el proceso de cambiar de contraseña continue |  |  |  |  |
|  |  |  | **Cuando:** |  | La confirmación coincida con la nueva contraseña  |  |  |  |  |
|  |  |  | **Entonces:** |  | El enlace debe tener una fecha y hora de expiración  |  |  |  |  |
| **Condicion 05** |  |  | **Dado:** |  | Que se registre una nueva contraseña |  |  |  |  |
|  |  |  | **Cuando:** |  | Se cree una nueva contraseña  |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema debe confirmar que la contraseña fue actualizada correctamente |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Diseñar interfaz para la recuperación  |  |  |  |  |  |  |
| 2 |  |  | Validar el correo electrónico  |  |  |  |  |  |  |
| 3 |  |  | Generar enlace de recuperación |  |  |  |  |  |  |
| 4 |  |  | Enviar correo electrónico |  |  |  |  |  |  |
| 5 |  |  | Permitir registrar una nueva contraseña |  |  |  |  |  |  |
| 6 |  |  | Permitir registrar una nueva contraseña |  |  |  |  |  |  |
| 7 |  |  | Actualizarla en la base de datos |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-19 |  | **Nombre:** |  | Consultar estadísticas de accesos  |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-09, HU-10, HU-11 |  |  |  |  |  |  |
| **Módulo:** |  |  | Reportes |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Visualizar estadísticas de los accesos registrados |  |  |  |  |
|  |  |  | **Para** |  | Analizar el comportamiento del ingreso al ROOM\_911 |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá mostrar estadísticas de accesos autorizados y denegados mediante gráficos y datos resumidos |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que existan registros de acceso |  |  |  |  |
|  |  |  | **Cuando:** |  | Cuando el administrador ingrese al modulo de estadisticas |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema debe mostrar el número total de accesos autorizados |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que existan accesos autorizados y denegados |  |  |  |  |
|  |  |  | **Cuando:** |  | El administrador consulte las estadísticas |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará la cantidad de accesos autorizados y rechazados |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que el administrador seleccione un rango de fechas |  |  |  |  |
|  |  |  | **Cuando:** |  | Presione el botón “Consultar” |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema actualizará las estadísticas únicamente para el periodo seleccionado |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que existan datos suficientes |  |  |  |  |
|  |  |  | **Cuando:** |  | El administrador visualiza el reporte   |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará gráficos que representen la información de manera clara |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema debe mostrar un mensaje indicando que la contraseña fue actualizada correctamente |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Diseñar modulo de estadisticas |  |  |  |  |  |  |
| 2 |  |  | Consultar registros de acceso  |  |  |  |  |  |  |
| 3 |  |  | Calcular accesos autorizados y denegados  |  |  |  |  |  |  |
| 4 |  |  | Implementar filtros por fecha |  |  |  |  |  |  |
| 5 |  |  | Generar gráficos estadísticos |  |  |  |  |  |  |
| 6 |  |  | Mostrar indicadores generales |  |  |  |  |  |  |
| 7 |  |  | Validar consultas sin registros  |  |  |  |  |  |  |
| 8 |  |  | Hacer pruebas |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-20 |  | **Nombre:** |  | Registrar auditoría de acciones administrativas  |  |  |  |  |
| **Complejidad:** |  |  | Alta |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | Todas las historias administrativas |  |  |  |  |  |  |
| **Módulo:** |  |  | Auditoría |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Registrar todas las acciones realizadas por los administradores |  |  |  |  |
|  |  |  | **Para** |  | Llevar un control de los cambios efectuados en el sistema |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá almacenar un registro de todas las operaciones administrativas realizadas |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que un administrador inicie sesión |  |  |  |  |
|  |  |  | **Cuando:** |  | Acceda correctamente al sistema  |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema registrará la fecha, hora y usuario que inicio sesión |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que un administrador registre, edite o elimine información |  |  |  |  |
|  |  |  | **Cuando:** |  | Confirme la operación |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema almacenará la acción realizada indicando usuario, fecha y tipo de operación  |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que ocurra un intento fallido de autenticación |  |  |  |  |
|  |  |  | **Cuando:** |  | Se ingresan credenciales incorrectas |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema registrará el intento fallido con su respectiva fecha y hora |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que el administrador consulte la auditoría |  |  |  |  |
|  |  |  | **Cuando:** |  | Acceda al módulo correspondiente    |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará el historial de acciones ordenado cronológicamente  |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Crear entidad Auditoria  |  |  |  |  |  |  |
| 2 |  |  | Crear tabla de auditoría   |  |  |  |  |  |  |
| 3 |  |  | Registrar inicios y cierres de sesión  |  |  |  |  |  |  |
| 4 |  |  | Registrar operaciones CRUD |  |  |  |  |  |  |
| 5 |  |  | Registrar intentos fallidos de autenticación |  |  |  |  |  |  |
| 6 |  |  | Crear consulta del historial |  |  |  |  |  |  |
| 7 |  |  | Implementar filtros por usuario y fecha  |  |  |  |  |  |  |
| 8 |  |  | Hacer pruebas |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-21 |  | **Nombre:** |  | Configurar parámetros generales del sistema |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-01 |  |  |  |  |  |  |
| **Módulo:** |  |  | Configuración |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Configurar parámetros generales del sistema |  |  |  |  |
|  |  |  | **Para** |  | Adaptar el funcionamiento del módulo ROOM 911 según las necesidades de la organización |  |  |  |  |
| **Requerimiento:** |  |  | El sistema permitirá modificar parámetros generales relacionados con el funcionamiento del módulo administrativo  |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que el administrador tenga permisos de configuración |  |  |  |  |
|  |  |  | **Cuando:** |  | Ingrese al módulo de configuración |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará los parámetros disponibles para su modificación |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que el administrador modifique un parámetro |  |  |  |  |
|  |  |  | **Cuando:** |  | Presione el botón “Guardar” |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema almacenará la nueva configuración  |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que algun dato ingresado sea invalido |  |  |  |  |
|  |  |  | **Cuando:** |  | El administrador intente guardar los cambios  |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrara un mensaje indicando el error encontrado |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que la configuración sea actualizada correctamente  |  |  |  |  |
|  |  |  | **Cuando:** |  | Finalice el proceso de modificación  |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema notificará que los cambios fueron guardados con éxito  |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Crear módulo de configuración  |  |  |  |  |  |  |
| 2 |  |  | Crear entidad de parámetros del sistema |  |  |  |  |  |  |
| 3 |  |  | Desarrollar formularios de configuración  |  |  |  |  |  |  |
| 4 |  |  | Validar datos ingresados  |  |  |  |  |  |  |
| 5 |  |  | Guardar parámetros en la base de datos |  |  |  |  |  |  |
| 6 |  |  | Mostrar mensajes de confirmación y error  |  |  |  |  |  |  |
| 7 |  |  | Hacer pruebas  |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-22 |  | **Nombre:** |  | Generación de credencial digital  |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-05 |  |  |  |  |  |  |
| **Módulo:** |  |  | Gestion de Credenciales |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Generar una credencial digital con un código Qr único para cada empleado |  |  |  |  |
|  |  |  | **Para** |  | Identificar al personal y facilitar la validación de acceso al laboratorio ROOM 911\. |  |  |  |  |
| **Requerimiento:** |  |  | El sistema permitirá generar automáticamente una credencial digital con un código QR único para cada empleado registrado. |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que exista un empleado registrado |  |  |  |  |
|  |  |  | **Cuando:** |  | El administrador genere la credencial |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema creará un código QR único asociado al empleado |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que la credencial haya sido generada |  |  |  |  |
|  |  |  | **Cuando:** |  | El administrador la consulte |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará la información del empleado junto con el código QR  |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que el empleado ya tenga una credencial |  |  |  |  |
|  |  |  | **Cuando:** |  | El administrador solicite generar una nueva  |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema actualizará la credencial sin generar códigos QR duplicados |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que la credencial haya sido creada correctamente |  |  |  |  |
|  |  |  | **Cuando:** |  | Finalice el proceso |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema notificará que la credencial fue generada exitosamente  |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Crear entidad para almacenar el código QR |  |  |  |  |  |  |
| 2 |  |  | Generar codigo QR unico para cada empleado |  |  |  |  |  |  |
| 3 |  |  | Diseñar la credencial digital |  |  |  |  |  |  |
| 4 |  |  | Asociar el QR al empleado |  |  |  |  |  |  |
| 5 |  |  | Mostrar la credencial en el sistema |  |  |  |  |  |  |
| 6 |  |  | Validar que no existan códigos duplicados  |  |  |  |  |  |  |
| 7 |  |  | Hacer pruebas  |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-23 |  | **Nombre:** |  | Validar acceso mediante código QR  |  |  |  |  |
| **Complejidad:** |  |  | Alta |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-21 |  |  |  |  |  |  |
| **Módulo:** |  |  | Control de Acceso |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Sistema de control de Acceso |  |  |  |  |
|  |  |  | **Requiero** |  | Leer el código QR de la credencial del empleado |  |  |  |  |
|  |  |  | **Para** |  | Validar automáticamente si el empleado tiene autorizacion para ingresar al laboratorio |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá leer el código QR presentado por el empleado, identificarlo y consultar la información almacenada para determinar si el acceso es permitido o denegado. |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que el empleado presente una credencial con código QR |  |  |  |  |
|  |  |  | **Cuando:** |  | El sistema lea el código |  |  |  |  |
|  |  |  | **Entonces:** |  | Obtendrá automáticamente la información del empleado |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que el empleado exista y tenga acceso permitido |  |  |  |  |
|  |  |  | **Cuando:** |  | El sistema valide la información |  |  |  |  |
|  |  |  | **Entonces:** |  | Autorizará el ingreso al laboratorio  |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que el empleado no exista, esté inactivo o no tenga permisos |  |  |  |  |
|  |  |  | **Cuando:** |  | El sistema valide el código QR |  |  |  |  |
|  |  |  | **Entonces:** |  | Denegará el acceso y registra el intento |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que ocurra un error durante la validación |  |  |  |  |
|  |  |  | **Cuando:** |  | El sistema no pueda consultar la información  |  |  |  |  |
|  |  |  | **Entonces:** |  | Mostrará un mensaje indicando el error de conexión   |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Implementar lectura del código QR |  |  |  |  |  |  |
| 2 |  |  | Obtener la información del empleado |  |  |  |  |  |  |
| 3 |  |  | Consultar la API del backend |  |  |  |  |  |  |
| 4 |  |  | Validar permisos del empleado |  |  |  |  |  |  |
| 5 |  |  | Registrar el intento de acceso |  |  |  |  |  |  |
| 6 |  |  | Mostrar el resultado de la validacion  |  |  |  |  |  |  |
| 7 |  |  | Hacer pruebas  |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-24 |  | **Nombre:** |  | Visualizar resultado de la validación del acceso  |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-22 |  |  |  |  |  |  |
| **Módulo:** |  |  | Control de Acceso |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Empleado |  |  |  |  |
|  |  |  | **Requiero** |  | Visualizar el resultado de la validación del acceso |  |  |  |  |
|  |  |  | **Para** |  | Conocer inmediatamente si el ingreso fue autorizado o rechazado |  |  |  |  |
| **Requerimiento:** |  |  | El sistema mostrará de forma clara el resultado del proceso de validación del empleado después de leer el código QR |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que el acceso sea autorizado |  |  |  |  |
|  |  |  | **Cuando:** |  | Finalice la validación |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará un mensaje de acceso concedido junto con la información del empleado  |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que el acceso sea rechazado |  |  |  |  |
|  |  |  | **Cuando:** |  | Finalice la validación |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará un mensaje indicando que el acceso fue denegado  |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que exista información del empleado  |  |  |  |  |
|  |  |  | **Cuando:** |  | Se visualice el resultado |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará nombre, documento, departamento, cargo y hora del acceso |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que ocurra un error durante la validación |  |  |  |  |
|  |  |  | **Cuando:** |  | No sea posible completar la validación |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrara un mensaje indicando el error y permitirá realizar un nuevo intento  |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Diseñar la interfaz de resultados |  |  |  |  |  |  |
| 2 |  |  | Mostrar datos del empleado |  |  |  |  |  |  |
| 3 |  |  | Mostrar estado del acceso |  |  |  |  |  |  |
| 4 |  |  | Mostrar errores de conexión |  |  |  |  |  |  |
| 5 |  |  | Permitir reiniciar la validación  |  |  |  |  |  |  |
| 6 |  |  | Hacer pruebas |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-25 |  | **Nombre:** |  | Visualizar el estado del punto de acceso en tiempo real |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-21 |  |  |  |  |  |  |
| **Módulo:** |  |  | Control de Acceso |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Empleado |  |  |  |  |
|  |  |  | **Requiero** |  | Visualizar en tiempo real el estado del punto de acceso |  |  |  |  |
|  |  |  | **Para** |  | Conocer la disponibilidad del sistema y el estado actual del proceso de validación de ingreso |  |  |  |  |
| **Requerimiento:** |  |  | El sistema mostrará información en tiempo real del punto de acceso, incluyendo la hora actual, el estado del sistema, el número de intentos realizados y el estado de la conexión con los servicios utilizados. |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que el sistema se encuentre en funcionamiento |  |  |  |  |
|  |  |  | **Cuando:** |  | El empleado acceda al módulo de control de acceso |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará la hora actual actualizada automáticamente |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que el sistema esté disponible  |  |  |  |  |
|  |  |  | **Cuando:** |  | El empleado visualice la pantalla principal |  |  |  |  |
|  |  |  | **Entonces:** |  | Se mostrará el estado actual del sistema (Esperando lectura, verificando, acceso concedido, acceso denegado o error de conexión) |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que se realice una validación |  |  |  |  |
|  |  |  | **Cuando:** |  | Finalice el proceso |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema actualiza el contador de intentos realizados  |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que la aplicación esté conectada al servidor |  |  |  |  |
|  |  |  | **Cuando:** |  | Se visualice el pie de la página del sistema  |  |  |  |  |
|  |  |  | **Entonces:** |  | Se mostrará el estado de la API, la base de datos y la versión del sistema |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Implementar reloj en tiempo real |  |  |  |  |  |  |
| 2 |  |  | Mostrar el estado del proceso de acceso |  |  |  |  |  |  |
| 3 |  |  | Actualizar el contador de intentos |  |  |  |  |  |  |
| 4 |  |  | Mostrar el estado de conexión con la Api |  |  |  |  |  |  |
| 5 |  |  | Mostrar el estado de la base de datos |  |  |  |  |  |  |
| 6 |  |  | Visualizar la versión del sistema |  |  |  |  |  |  |
| 7 |  |  | Hacer pruebas  |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-26 |  | **Nombre:** |  | Registrar intentos de acceso |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-21 |  |  |  |  |  |  |
| **Módulo:** |  |  | Control de Acceso |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Registrar automáticamente todos los intentos de acceso realizados al laboratorio  |  |  |  |  |
|  |  |  | **Para** |  | Mantener un historial de auditoría que permita consultar los ingresos autorizados y rechazados |  |  |  |  |
| **Requerimiento:** |  |  | El sistema registrará automáticamente cada intento de acceso indicando el empleado, la fecha, la hora, el resultado del intento y el motivo correspondiente |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que un empleado intente ingresar al laboratorio |  |  |  |  |
|  |  |  | **Cuando:** |  | El sistema valide la solicitud de acceso |  |  |  |  |
|  |  |  | **Entonces:** |  | Registrará automáticamente el intento realizado |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que el acceso sea autorizado |  |  |  |  |
|  |  |  | **Cuando:** |  | Finalice la validación |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema almacenará el intento como exitoso |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que el acceso sea rechazado |  |  |  |  |
|  |  |  | **Cuando:** |  | Finalice el proceso |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema registrará el motivo del rechazo   |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que el administrador consulte el historial  |  |  |  |  |
|  |  |  | **Cuando:** |  | Ingrese al módulo de historial  |  |  |  |  |
|  |  |  | **Entonces:** |  | Visualiza todos los intentos registrados |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Crear registro de intentos |  |  |  |  |  |  |
| 2 |  |  | Guardar fecha y hora |  |  |  |  |  |  |
| 3 |  |  | Guardar empleado asociado |  |  |  |  |  |  |
| 4 |  |  | Registrar motivo del resultado |  |  |  |  |  |  |
| 5 |  |  | Mostrar historial |  |  |  |  |  |  |
| 6 |  |  | Hacer pruebas |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-27 |  | **Nombre:** |  | Visualizar indicadores del sistema |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-21 |  |  |  |  |  |  |
| **Módulo:** |  |  | Dashboard |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Consultar indicadores generales del sistema |  |  |  |  |
|  |  |  | **Para** |  | Monitorear el funcionamiento del laboratorio y el comportamiento de los accesos |  |  |  |  |
| **Requerimiento:** |  |  | El sistema mostrará indicadores relevantes como empleados registrados, accesos autorizados, accesos rechazados y estadísticas generales |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que el administrador inicie sesión  |  |  |  |  |
|  |  |  | **Cuando:** |  | Acceda al dashboard |  |  |  |  |
|  |  |  | **Entonces:** |  | Visualiza los indicadores principales del sistema |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que existan registros de acceso |  |  |  |  |
|  |  |  | **Cuando:** |  | El dashboard sea cargado |  |  |  |  |
|  |  |  | **Entonces:** |  | Mostrará las estadísticas actualizadas |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que existan diferentes departamentos |  |  |  |  |
|  |  |  | **Cuando:** |  | Se consulte el dashboard |  |  |  |  |
|  |  |  | **Entonces:** |  | Se mostrarán indicadores por departamento   |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que el administrador actualice la página |  |  |  |  |
|  |  |  | **Cuando:** |  | El sistema recargue la información |  |  |  |  |
|  |  |  | **Entonces:** |  | Los indicadores reflejarán la información más reciente  |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Crear dashboard |  |  |  |  |  |  |
| 2 |  |  | Consultar indicadores |  |  |  |  |  |  |
| 3 |  |  | Mostrar estadísticas |  |  |  |  |  |  |
| 4 |  |  | Mostrar accesos recientes |  |  |  |  |  |  |
| 5 |  |  | Actualizar información |  |  |  |  |  |  |
| 6 |  |  | Diseñar interfaz |  |  |  |  |  |  |
| 7 |  |  | Hacer pruebas |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-28 |  | **Nombre:** |  | Autenticarse en el sistema |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-01 |  |  |  |  |  |  |
| **Módulo:** |  |  | Autenticación  |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Iniciar sesión mediante mis credenciales |  |  |  |  |
|  |  |  | **Para** |  | Acceder únicamente a las funciones administrativas del sistema |  |  |  |  |
| **Requerimiento:** |  |  | El sistema validará las credenciales del administrador antes de permitir el acceso al módulo administrativo |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que el administrador ingrese sus credenciales |  |  |  |  |
|  |  |  | **Cuando:** |  | Presione el botón “Iniciar sesión” |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema validará el usuario y la contraseña  |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que las credenciales sean válidas |  |  |  |  |
|  |  |  | **Cuando:** |  | Finalice la autenticación |  |  |  |  |
|  |  |  | **Entonces:** |  | Permitirá el acceso al Dashboard  |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que las credenciales sean incorrectas |  |  |  |  |
|  |  |  | **Cuando:** |  | Se intente iniciar sesión  |  |  |  |  |
|  |  |  | **Entonces:** |  | Mostrará un mensaje indicando el error |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que el administrador cierre sesión  |  |  |  |  |
|  |  |  | **Cuando:** |  | Seleccione la opcion “Cerrar sesion” |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema finaliza la sesión y regresará al inicio  |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Crear formulario de inicio de sesión |  |  |  |  |  |  |
| 2 |  |  | Validar credenciales |  |  |  |  |  |  |
| 3 |  |  | Generar sesión |  |  |  |  |  |  |
| 4 |  |  | Registrar acceso |  |  |  |  |  |  |
| 5 |  |  | Cerrar sesión  |  |  |  |  |  |  |
| 6 |  |  | Hacer pruebas |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-29 |  | **Nombre:** |  | Exportar historial de accesos en PDF |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-01 |  |  |  |  |  |  |
| **Módulo:** |  |  | Historial |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Exportar el historial de accesos en formato PDF  |  |  |  |  |
|  |  |  | **Para** |  | Conservar evidencia y generar reportes de auditoria |  |  |  |  |
| **Requerimiento:** |  |  | El sistema permitirá generar un documento PDF con la información registrada en el historial de accesos |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que existan registros de acceso |  |  |  |  |
|  |  |  | **Cuando:** |  | El administrador seleccione la opción “Exportar PDF” |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema generará el documento |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que el PDF haya sido generado |  |  |  |  |
|  |  |  | **Cuando:** |  | Finalice el proceso |  |  |  |  |
|  |  |  | **Entonces:** |  | Permitirá descargar el archivo  |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que no existan registros |  |  |  |  |
|  |  |  | **Cuando:** |  | Se solicite la exportación |  |  |  |  |
|  |  |  | **Entonces:** |  | Mostrará un mensaje indicando que no hay información disponible |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que el archivo sea generado correctamente |  |  |  |  |
|  |  |  | **Cuando:** |  | El administrador lo descargue |  |  |  |  |
|  |  |  | **Entonces:** |  | El documento contendrá la información del historial con fecha y hora de generación  |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Consultar historial |  |  |  |  |  |  |
| 2 |  |  | Generar documento PDF |  |  |  |  |  |  |
| 3 |  |  | Dar formato al reporte |  |  |  |  |  |  |
| 4 |  |  | Permitir descarga |  |  |  |  |  |  |
| 5 |  |  | Validar existencia de datos |  |  |  |  |  |  |
| 6 |  |  | Mostrar mensajes |  |  |  |  |  |  |
| 7 |  |  | Hacer pruebas |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |
