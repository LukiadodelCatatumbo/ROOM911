# HUs corregidas para copiar y pegar — ROOM911

> Este bloque corresponde a la versión `Historias de Usuario Room_911_v2.md`. Las historias HU-005 y HU-006 fueron retiradas del alcance y, por tanto, no se incluyen ni se renumeran. La secuencia vigente pasa de HU-004 a HU-007.

## HU-001 — Autenticación y cierre de sesión del administrador

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-001 |  | **Nombre:** |  | Autenticación y cierre de sesión del administrador |  |  |  |  |
| **Complejidad:** |  |  | Alta |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-002, HU-004, HU-007 y HU-020 |  |  |  |  |  |  |
| **Módulo:** |  |  | Autenticación y seguridad |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador autorizado de ROOM_911 |  |  |  |  |
|  |  |  | **Requiero** |  | Iniciar y cerrar sesión de forma segura |  |  |  |  |
|  |  |  | **Para** |  | Acceder únicamente a las funciones permitidas y proteger la información administrativa |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá validar usuario y contraseña contra el backend, emitir una sesión segura, dirigir al Dashboard cuando el acceso sea válido, restringir las rutas y operaciones protegidas según el rol, y eliminar la sesión cuando la persona cierre sesión o permanezca inactiva. |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **Parcial.** La pantalla de login y el endpoint JWT real están implementados. Las rutas y los permisos principales se protegen en frontend y backend. La auditoría automática del login y cierre aún no está conectada de forma completa, y la invalidación inmediata de un token ya emitido requiere una decisión adicional de seguridad. |  |  |  |  |  |  |
| **Evidencia:** |  |  | `Login.tsx`, `authService.ts`, `AppRoutes.tsx`, `AuthController.java`, `SecurityConfig.java` y `JwtAuthenticationFilter.java`. |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | que no exista una sesión activa |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona abra la pantalla de acceso |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará los campos de usuario o correo, contraseña y el botón de ingreso, con la contraseña oculta y etiquetas comprensibles. |  |  |  |  |
| **Condición 02** |  |  | **Dado:** |  | que uno o más campos obligatorios estén vacíos |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona intente ingresar |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema no enviará la solicitud, señalará los campos pendientes y conservará la pantalla para corregirlos. |  |  |  |  |
| **Condición 03** |  |  | **Dado:** |  | que la cuenta exista, esté activa y las credenciales sean correctas |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona envíe el formulario |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema autenticará a la persona, emitirá el token correspondiente, guardará solo los datos mínimos de sesión y dirigirá al Dashboard. |  |  |  |  |
| **Condición 04** |  |  | **Dado:** |  | que el usuario no exista o la contraseña sea incorrecta |  |  |  |  |
|  |  |  | **Cuando:** |  | se intente iniciar sesión |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema responderá con un mensaje general, no creará sesión y no revelará cuál credencial falló. |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | que la cuenta esté inactiva |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona intente autenticarse |  |  |  |  |
|  |  |  | **Entonces:** |  | el servidor rechazará el acceso, no emitirá un token y la interfaz permitirá reintentar sin mostrar información sensible. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que el servicio de autenticación no responda |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona envíe credenciales |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema informará que no pudo validar el acceso, no usará datos mock y permitirá reintentar. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que la autenticación haya sido exitosa |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona consulte una ruta u operación administrativa |  |  |  |  |
|  |  |  | **Entonces:** |  | el servidor validará el token y el rol antes de devolver o modificar información protegida. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | que exista una sesión activa |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona seleccione **Cerrar sesión** |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema eliminará los datos locales de sesión, redirigirá al login y bloqueará el acceso posterior a las rutas protegidas. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | que el token esté vencido o sea inválido |  |  |  |  |
|  |  |  | **Cuando:** |  | se consulte una operación protegida |  |  |  |  |
|  |  |  | **Entonces:** |  | el backend responderá 401, el frontend limpiará la sesión y solicitará autenticarse nuevamente. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | que la persona permanezca sin actividad durante el tiempo configurado |  |  |  |  |
|  |  |  | **Cuando:** |  | finalice el periodo de sesión |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará una advertencia previa, cerrará la sesión, eliminará los datos locales y dirigirá al login según HU-007. |  |  |  |  |
| **Condición 11** |  |  | **Dado:** |  | que se complete un ingreso, rechazo o cierre |  |  |  |  |
|  |  |  | **Cuando:** |  | termine la operación |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema registrará actor, fecha, hora, acción y resultado en auditoría, sin almacenar contraseña ni token. |  |  |  |  |
| **Condición 12** |  |  | **Dado:** |  | que una persona use teclado o lector de pantalla |  |  |  |  |
|  |  |  | **Cuando:** |  | complete el inicio o cierre de sesión |  |  |  |  |
|  |  |  | **Entonces:** |  | el formulario, mensajes, foco y botones serán operables y comprensibles sin depender exclusivamente del mouse o del color. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Definir el contrato de autenticación, incluyendo credenciales de entrada, respuesta JWT, rol, vencimiento y mensajes de error. |  |  |  |  |  |  |
| 2 |  |  | Construir la pantalla de login con etiquetas, validaciones, estado de carga, mensajes y navegación accesible. |  |  |  |  |  |  |  |
| 3 |  |  | Validar la cuenta activa y la contraseña en el servidor usando BCrypt sin devolver información sensible. |  |  |  |  |  |  |  |
| 4 |  |  | Emitir y validar tokens JWT firmados con secreto y vencimiento configurados por variables de entorno. |  |  |  |  |  |  |  |
| 5 |  |  | Aplicar autenticación obligatoria a las rutas administrativas y permisos por rol en los endpoints críticos. |  |  |  |  |  |  |  |
| 6 |  |  | Guardar y retirar únicamente la información mínima de sesión en el navegador. |  |  |  |  |  |  |  |
| 7 |  |  | Implementar el cierre manual y la respuesta automática ante una sesión vencida o inválida. |  |  |  |  |  |  |  |
| 8 |  |  | Evitar fallbacks mock, credenciales expuestas y mensajes que permitan enumerar cuentas. |  |  |  |  |  |  |  |
| 9 |  |  | Integrar el registro de login, rechazo, cierre y expiración con la auditoría administrativa. |  |  |  |  |  |  |  |
| 10 |  |  | Verificar el flujo con los roles SUPER_ADMIN, ADMIN_ACCESOS y ADMIN_SISTEMAS. |  |  |  |  |  |  |  |
| 11 |  |  | Ejecutar pruebas unitarias del servicio de autenticación, JWT, permisos y expiración. |  |  |  |  |  |  |  |
| 12 |  |  | Ejecutar pruebas funcionales de campos vacíos, credenciales inválidas, cuenta inactiva, rutas protegidas y cierre. |  |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 01-09-2026 |  |  | Revisión contra autenticación JWT, roles, rutas protegidas y sesión por inactividad. |  |  |  |

## HU-002 — Gestión de administradores

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-002 |  | **Nombre:** |  | Gestión de administradores |  |  |  |  |
| **Complejidad:** |  |  | Alta |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-001 y HU-004 |  |  |  |  |  |  |
| **Módulo:** |  |  | Administración de usuarios |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador con permiso de gestión |  |  |  |  |
|  |  |  | **Requiero** |  | Crear, consultar y actualizar cuentas administrativas |  |  |  |  |
|  |  |  | **Para** |  | Mantener controladas las personas que administran ROOM_911 |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá permitir registrar, listar, buscar, filtrar, paginar y editar administradores, mostrando nombre, correo, usuario, rol y estado. Las operaciones deberán persistir, respetar permisos y proteger la contraseña. |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **Parcial.** La vista y los servicios reales permiten consultar, crear y editar cuentas, aplicar filtros y paginación y limitar las acciones según rol. La persistencia del estado activo y la conexión automática con auditoría deben verificarse; la eliminación actual debe tratarse como una decisión de negocio porque puede ser física. |  |  |  |  |  |  |
| **Evidencia:** |  |  | `Administradores.tsx`, `adminService.ts`, `AdministradorController.java` y `AdministradorServiceImpl.java`. |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | que el administrador tenga el rol autorizado y complete los campos requeridos |  |  |  |  |
|  |  |  | **Cuando:** |  | seleccione **Guardar** |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema creará la cuenta activa, mostrará confirmación y la incorporará al listado. |  |  |  |  |
| **Condición 02** |  |  | **Dado:** |  | que el correo o usuario ya exista |  |  |  |  |
|  |  |  | **Cuando:** |  | se intente registrar otra cuenta |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema rechazará la operación y explicará cuál dato debe corregirse sin borrar los demás campos. |  |  |  |  |
| **Condición 03** |  |  | **Dado:** |  | que falte un dato obligatorio o el correo sea inválido |  |  |  |  |
|  |  |  | **Cuando:** |  | se envíe el formulario |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema no enviará información incompleta y marcará cada campo que requiera corrección. |  |  |  |  |
| **Condición 04** |  |  | **Dado:** |  | que exista una cuenta administrativa |  |  |  |  |
|  |  |  | **Cuando:** |  | se seleccione **Editar** |  |  |  |  |
|  |  |  | **Entonces:** |  | el formulario mostrará los datos permitidos, ocultará la contraseña y permitirá reemplazarla solo de manera explícita. |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | que se modifiquen datos válidos |  |  |  |  |
|  |  |  | **Cuando:** |  | se guarden los cambios |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema persistirá la modificación, confirmará el resultado y la conservará después de recargar. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que exista una cuenta activa diferente de la cuenta ejecutora |  |  |  |  |
|  |  |  | **Cuando:** |  | se seleccione **Inactivar** y se confirme |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema cambiará el estado, bloqueará nuevos accesos y reflejará la condición en el listado. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que exista una cuenta inactiva |  |  |  |  |
|  |  |  | **Cuando:** |  | una persona autorizada seleccione **Activar** |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema reactivará la cuenta y permitirá autenticarse conforme a HU-001. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | que la persona no tenga el rol requerido |  |  |  |  |
|  |  |  | **Cuando:** |  | intente crear, editar o cambiar el estado |  |  |  |  |
|  |  |  | **Entonces:** |  | la interfaz ocultará la acción y el servidor responderá 403 sin modificar información. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | que se consulte el módulo |  |  |  |  |
|  |  |  | **Cuando:** |  | se aplique búsqueda, filtro o paginación |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema actualizará el listado, indicará la cantidad de resultados y mostrará un estado vacío si no hay coincidencias. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | que una operación de cuenta finalice o sea rechazada |  |  |  |  |
|  |  |  | **Cuando:** |  | se consulte la auditoría |  |  |  |  |
|  |  |  | **Entonces:** |  | deberá existir actor, fecha, hora, acción, cuenta afectada y resultado, sin registrar contraseñas. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Definir los datos de la cuenta, roles válidos, estado, fechas y reglas de unicidad de usuario y correo. |  |  |  |  |  |  |
| 2 |  |  | Implementar creación, consulta y actualización mediante el contrato real del backend. |  |  |  |  |  |  |
| 3 |  |  | Diseñar el formulario de alta con validaciones de campos, correo, contraseña y rol. |  |  |  |  |  |  |
| 4 |  |  | Diseñar el formulario de edición sin exponer la contraseña almacenada. |  |  |  |  |  |  |
| 5 |  |  | Validar duplicados de usuario y correo tanto en interfaz como en servidor. |  |  |  |  |  |  |
| 6 |  |  | Implementar el listado con búsqueda, filtros, paginación, estados y acciones según rol. |  |  |  |  |  |  |
| 7 |  |  | Persistir activación e inactivación y definir si la baja es lógica o física. |  |  |  |  |  |  |
| 8 |  |  | Impedir que una persona se desactive a sí misma cuando la regla de seguridad lo prohíba. |  |  |  |  |  |  |
| 9 |  |  | Aplicar BCrypt al crear o cambiar una contraseña y evitar devolverla en respuestas. |  |  |  |  |  |  |
| 10 |  |  | Proteger el endpoint y las acciones con los roles definidos en seguridad. |  |  |  |  |  |  |
| 11 |  |  | Integrar las operaciones con la auditoría administrativa. |  |  |  |  |  |  |
| 12 |  |  | Mostrar confirmaciones y errores claros, sin fallbacks de demostración. |  |  |  |  |  |  |
| 13 |  |  | Ejecutar pruebas de creación, edición, duplicados, estados, permisos, filtros y persistencia. |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 01-09-2026 |  |  | Revisión funcional contra frontend, backend, roles y persistencia de administradores. |  |  |  |

## HU-003 — Gestión de departamentos

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-003 |  | **Nombre:** |  | Gestión de departamentos |  |  |  |  |
| **Complejidad:** |  |  | Alta |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-008, HU-009, HU-010 y HU-016 |  |  |  |  |  |  |
| **Módulo:** |  |  | Catálogos y gestión de personal |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador autorizado |  |  |  |  |
|  |  |  | **Requiero** |  | Crear y mantener departamentos |  |  |  |  |
|  |  |  | **Para** |  | Organizar empleados y aplicar reglas operativas por área |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá permitir registrar, consultar, editar, activar e inactivar departamentos, mostrando código, nombre, descripción, responsable, nivel de restricción, capacidad y cantidad de empleados activos. |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **Parcial.** La vista permite consultar, buscar, crear, editar, activar e inactivar departamentos y muestra el conteo de empleados. La auditoría de cambios, la validación completa de unicidad del código y las restricciones de baja cuando existen empleados requieren verificación adicional. HU-016 conserva el mismo objetivo y debe consolidarse. |  |  |  |  |  |  |
| **Evidencia:** |  |  | `Departamentos.tsx`, `departamentoService.ts`, `DepartamentoController.java` y `DepartamentoServiceImpl.java`. |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | que la persona tenga permiso y complete nombre, código, responsable y capacidad válidos |  |  |  |  |
|  |  |  | **Cuando:** |  | seleccione **Guardar** |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema creará el departamento activo, confirmará el resultado y lo mostrará en el listado. |  |  |  |  |
| **Condición 02** |  |  | **Dado:** |  | que el nombre o código ya estén registrados |  |  |  |  |
|  |  |  | **Cuando:** |  | se intente crear o actualizar |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema rechazará la operación y explicará el dato duplicado. |  |  |  |  |
| **Condición 03** |  |  | **Dado:** |  | que un campo obligatorio esté vacío o fuera de rango |  |  |  |  |
|  |  |  | **Cuando:** |  | se envíe el formulario |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema no enviará la solicitud y mostrará la corrección requerida junto al campo. |  |  |  |  |
| **Condición 04** |  |  | **Dado:** |  | que exista un departamento |  |  |  |  |
|  |  |  | **Cuando:** |  | se seleccione **Editar** |  |  |  |  |
|  |  |  | **Entonces:** |  | el formulario cargará los datos actuales y permitirá modificarlos sin perder la relación con sus empleados. |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | que el departamento tenga empleados asociados |  |  |  |  |
|  |  |  | **Cuando:** |  | se solicite inactivarlo |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema aplicará la regla aprobada, conservará la integridad de las relaciones y explicará si la acción no está permitida. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que un departamento esté inactivo |  |  |  |  |
|  |  |  | **Cuando:** |  | una persona autorizada lo reactive |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema actualizará su estado y lo habilitará para las operaciones permitidas. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que existan varios departamentos |  |  |  |  |
|  |  |  | **Cuando:** |  | se busque por nombre, código, responsable o nivel |  |  |  |  |
|  |  |  | **Entonces:** |  | el listado mostrará solo las coincidencias y reiniciará la página de resultados. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | que una búsqueda no produzca coincidencias |  |  |  |  |
|  |  |  | **Cuando:** |  | termine la consulta |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará un estado vacío informativo y ofrecerá limpiar el filtro. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | que la persona no tenga permisos de escritura |  |  |  |  |
|  |  |  | **Cuando:** |  | intente crear, editar o cambiar estado |  |  |  |  |
|  |  |  | **Entonces:** |  | la interfaz ocultará la acción y el servidor devolverá 403 sin modificar el catálogo. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | que se realice una operación sobre un departamento |  |  |  |  |
|  |  |  | **Cuando:** |  | finalice o sea rechazada |  |  |  |  |
|  |  |  | **Entonces:** |  | la auditoría registrará actor, fecha, hora, departamento, acción y resultado. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Definir los campos, estados, niveles de restricción y capacidad permitidos para un departamento. |  |  |  |  |  |  |
| 2 |  |  | Implementar el contrato de alta, consulta, edición, activación e inactivación. |  |  |  |  |  |  |
| 3 |  |  | Validar nombre, código, responsable, descripción y capacidad en la interfaz. |  |  |  |  |  |  |
| 4 |  |  | Validar unicidad y reglas de integridad en el servidor. |  |  |  |  |  |  |
| 5 |  |  | Construir el listado con búsqueda, paginación, estado y cantidad de empleados activos. |  |  |  |  |  |  |
| 6 |  |  | Relacionar el departamento con el alta y edición de empleados. |  |  |  |  |  |  |
| 7 |  |  | Definir el comportamiento de inactivación cuando existan empleados asociados. |  |  |  |  |  |  |
| 8 |  |  | Aplicar permisos por rol a cada operación de escritura. |  |  |  |  |  |  |
| 9 |  |  | Integrar las operaciones con auditoría y mensajes de resultado. |  |  |  |  |  |  |
| 10 |  |  | Implementar estados vacíos, errores de servicio y recuperación de filtros. |  |  |  |  |  |  |
| 11 |  |  | Consolidar HU-016 para evitar duplicidad funcional. |  |  |  |  |  |  |
| 12 |  |  | Ejecutar pruebas de alta, edición, duplicados, búsqueda, estados, relaciones y permisos. |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 01-09-2026 |  |  | Revisión contra catálogo de departamentos, relaciones con empleados y permisos reales. |  |  |  |

## HU-004 — Desactivar administrador

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-004 |  | **Nombre:** |  | Desactivar administrador |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-001 y HU-002 |  |  |  |  |  |  |
| **Módulo:** |  |  | Administración de usuarios |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador autorizado |  |  |  |  |
|  |  |  | **Requiero** |  | Inactivar una cuenta administrativa |  |  |  |  |
|  |  |  | **Para** |  | Impedir que una cuenta no autorizada siga ingresando al sistema |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá solicitar confirmación antes de inactivar una cuenta, persistir el nuevo estado, impedir el acceso posterior y conservar la trazabilidad de la operación. |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **Parcial.** La interfaz muestra confirmación y acciones de estado, y el login rechaza cuentas inactivas. El backend actual de administradores realiza eliminación física en su operación de borrar y no evidencia una activación equivalente; debe definirse y corregirse la baja lógica para conservar historial. |  |  |  |  |  |  |
| **Evidencia:** |  |  | `Administradores.tsx`, `adminService.ts`, `AdministradorController.java` y `AdministradorServiceImpl.java`. |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | que exista una cuenta activa y la persona tenga permiso |  |  |  |  |
|  |  |  | **Cuando:** |  | seleccione **Inactivar** |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará un diálogo con la cuenta afectada, consecuencias y opciones de confirmar o cancelar. |  |  |  |  |
| **Condición 02** |  |  | **Dado:** |  | que el diálogo de confirmación esté abierto |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona seleccione **Cancelar** |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema cerrará el diálogo y conservará la cuenta sin cambios. |  |  |  |  |
| **Condición 03** |  |  | **Dado:** |  | que la persona confirme la inactivación |  |  |  |  |
|  |  |  | **Cuando:** |  | el servidor procese la operación |  |  |  |  |
|  |  |  | **Entonces:** |  | la cuenta quedará inactiva, el listado se actualizará y la operación conservará el registro histórico. |  |  |  |  |
| **Condición 04** |  |  | **Dado:** |  | que una cuenta esté inactiva |  |  |  |  |
|  |  |  | **Cuando:** |  | intente iniciar sesión |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema rechazará el acceso y no emitirá un token. |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | que la operación haya terminado correctamente |  |  |  |  |
|  |  |  | **Cuando:** |  | se consulte el listado |  |  |  |  |
|  |  |  | **Entonces:** |  | la cuenta aparecerá con estado **Inactiva** y sin una acción que permita entrar mientras siga deshabilitada. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que la persona intente inactivar su propia cuenta |  |  |  |  |
|  |  |  | **Cuando:** |  | confirme la operación |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema aplicará la regla de seguridad definida y, si está prohibido, rechazará la acción sin cambios. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que la persona no tenga permiso o su sesión haya vencido |  |  |  |  |
|  |  |  | **Cuando:** |  | intente ejecutar la acción |  |  |  |  |
|  |  |  | **Entonces:** |  | la interfaz y el servidor impedirán la operación y devolverán un mensaje comprensible. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | que la cuenta no exista |  |  |  |  |
|  |  |  | **Cuando:** |  | se solicite su inactivación |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema responderá que no fue encontrada y no afectará otras cuentas. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | que una inactivación sea aprobada o rechazada |  |  |  |  |
|  |  |  | **Cuando:** |  | se consulte auditoría |  |  |  |  |
|  |  |  | **Entonces:** |  | se mostrará actor, cuenta afectada, fecha, hora, acción, resultado y motivo cuando aplique. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | que ocurra un error de persistencia |  |  |  |  |
|  |  |  | **Cuando:** |  | se confirme la acción |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema no mostrará éxito, conservará el estado anterior y permitirá reintentar. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Definir la baja lógica, estados permitidos y regla de reactivación de cuentas. |  |  |  |  |  |  |
| 2 |  |  | Incorporar la acción de inactivación solo a los roles autorizados. |  |  |  |  |  |  |  |
| 3 |  |  | Diseñar el diálogo de confirmación y cancelación con foco accesible. |  |  |  |  |  |  |  |
| 4 |  |  | Persistir el estado inactivo sin borrar físicamente la cuenta ni sus referencias históricas. |  |  |  |  |  |  |  |
| 5 |  |  | Bloquear en el servicio de autenticación las cuentas inactivas. |  |  |  |  |  |  |  |
| 6 |  |  | Implementar la reactivación si el producto la autoriza. |  |  |  |  |  |  |  |
| 7 |  |  | Impedir la auto-inactivación cuando corresponda a la política de seguridad. |  |  |  |  |  |  |  |
| 8 |  |  | Mostrar estado, confirmación, error y resultado sin datos de demostración. |  |  |  |  |  |  |  |
| 9 |  |  | Registrar la acción en auditoría con información mínima y segura. |  |  |  |  |  |  |  |
| 10 |  |  | Proteger las operaciones ante sesión vencida, rol insuficiente o cuenta inexistente. |  |  |  |  |  |  |  |
| 11 |  |  | Ejecutar pruebas de confirmar, cancelar, persistir, autenticar posteriormente y reintentar. |  |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 01-09-2026 |  |  | Revisión de baja lógica, seguridad, persistencia y auditoría de cuentas. |  |  |  |

## HU-007 — Cierre de sesión por inactividad

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-007 |  | **Nombre:** |  | Cierre de sesión por inactividad |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-001 y HU-020 |  |  |  |  |  |  |
| **Módulo:** |  |  | Autenticación y seguridad |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador autenticado |  |  |  |  |
|  |  |  | **Requiero** |  | Que la sesión termine después de un periodo sin actividad |  |  |  |  |
|  |  |  | **Para** |  | Evitar que otra persona use una sesión administrativa abandonada |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá controlar el tiempo sin interacción, advertir antes del vencimiento, cerrar la sesión, limpiar los datos locales, redirigir al login y registrar el resultado sin guardar credenciales ni tokens en auditoría. |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **Parcial.** `SessionTimeout.tsx` implementa temporizador, advertencia, detección de actividad, cierre local y redirección. El tiempo se configura por variables de entorno del frontend. La conexión del cierre por inactividad con auditoría y la coordinación exacta con el vencimiento JWT del backend aún requieren prueba integral. |  |  |  |  |  |  |
| **Evidencia:** |  |  | `SessionTimeout.tsx`, `authService.ts`, `api.ts` y `AppRoutes.tsx`. |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | que exista una sesión válida |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona permanezca sin interactuar |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema medirá el tiempo desde la última actividad válida. |  |  |  |  |
| **Condición 02** |  |  | **Dado:** |  | que se alcance el momento de advertencia configurado |  |  |  |  |
|  |  |  | **Cuando:** |  | no exista interacción reciente |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará un aviso con el tiempo restante y la consecuencia de no interactuar. |  |  |  |  |
| **Condición 03** |  |  | **Dado:** |  | que la advertencia esté visible |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona realice una interacción válida |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema cerrará la advertencia y reiniciará el contador mientras el token siga vigente. |  |  |  |  |
| **Condición 04** |  |  | **Dado:** |  | que se cumpla el tiempo máximo de inactividad |  |  |  |  |
|  |  |  | **Cuando:** |  | no haya actividad válida |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema cerrará la sesión, limpiará el almacenamiento local y dirigirá al login. |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | que la sesión haya vencido por inactividad |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona intente abrir una ruta protegida |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema no mostrará información protegida y solicitará nueva autenticación. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que la configuración de minutos sea inválida o no exista |  |  |  |  |
|  |  |  | **Cuando:** |  | se cargue la sesión |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema usará un valor seguro definido para desarrollo y no dejará el temporizador deshabilitado accidentalmente. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que la persona cierre sesión desde el menú |  |  |  |  |
|  |  |  | **Cuando:** |  | se ejecute el cierre manual |  |  |  |  |
|  |  |  | **Entonces:** |  | el temporizador se detendrá, se limpiará la sesión y no se mostrará una advertencia posterior. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | que otra pestaña elimine el token |  |  |  |  |
|  |  |  | **Cuando:** |  | se detecte el cambio de almacenamiento |  |  |  |  |
|  |  |  | **Entonces:** |  | la pestaña actual redirigirá al login y dejará de operar como sesión autenticada. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | que ocurra un cierre por inactividad |  |  |  |  |
|  |  |  | **Cuando:** |  | se registre el evento |  |  |  |  |
|  |  |  | **Entonces:** |  | auditoría conservará actor, fecha, hora, acción y motivo, sin almacenar el token ni la contraseña. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | que se pruebe el flujo en escritorio y móvil |  |  |  |  |
|  |  |  | **Cuando:** |  | se alcance advertencia o vencimiento |  |  |  |  |
|  |  |  | **Entonces:** |  | el mensaje será visible, accesible y no bloqueará la posibilidad de autenticarse nuevamente. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Definir tiempo máximo, tiempo de advertencia y valores permitidos mediante variables de entorno. |  |  |  |  |  |  |
| 2 |  |  | Implementar el contador desde la última interacción válida. |  |  |  |  |  |  |
| 3 |  |  | Detectar actividad de mouse, teclado, desplazamiento y táctil sin generar reinicios excesivos. |  |  |  |  |  |  |
| 4 |  |  | Mostrar la advertencia con texto, tiempo restante y acción comprensible. |  |  |  |  |  |  |
| 5 |  |  | Ejecutar cierre automático, limpiar sesión y redirigir al login. |  |  |  |  |  |  |
| 6 |  |  | Coordinar el vencimiento local con la expiración del JWT y la respuesta 401 del backend. |  |  |  |  |  |  |
| 7 |  |  | Detener temporizadores al cerrar sesión o desmontar la vista. |  |  |  |  |  |  |
| 8 |  |  | Sincronizar el cierre entre pestañas mediante el almacenamiento del navegador. |  |  |  |  |  |  |
| 9 |  |  | Registrar cierre por inactividad en auditoría sin datos sensibles. |  |  |  |  |  |  |
| 10 |  |  | Mostrar mensajes claros para cierre manual, vencimiento y error de configuración. |  |  |  |  |  |  |
| 11 |  |  | Ejecutar pruebas unitarias de contador, reinicio, advertencia, vencimiento y limpieza. |  |  |  |  |  |  |
| 12 |  |  | Ejecutar pruebas funcionales con actividad, inactividad, varias pestañas, rutas protegidas y nueva autenticación. |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 01-09-2026 |  |  | Revisión contra SessionTimeout, JWT, rutas protegidas y configuración de sesión. |  |  |  |

## HU-008 — Registro masivo de empleados mediante CSV

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-008 |  | **Nombre:** |  | Registro masivo de empleados mediante CSV |  |  |  |  |
| **Complejidad:** |  |  | Alta |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-003, HU-009, HU-010, HU-014 y HU-020 |  |  |  |  |  |  |
| **Módulo:** |  |  | Gestión de empleados |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador con permiso para gestionar personal |  |  |  |  |
|  |  |  | **Requiero** |  | Cargar varios empleados mediante un archivo CSV y conocer el resultado de cada fila |  |  |  |  |
|  |  |  | **Para** |  | Registrar personal rápidamente sin crear información incompleta o duplicada |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá permitir seleccionar un departamento activo, cargar un CSV UTF-8 separado por comas, validar cabecera y filas, mostrar una previsualización, guardar las filas válidas, reportar rechazados y registrar la operación en auditoría. |  |  |  |  |  |  |
| **Alcance:** |  |  | Incluye selección de departamento, lectura, validación de estructura, campos obligatorios, documento, correo, duplicados, previsualización, confirmación, persistencia, reporte, errores, actualización del directorio y auditoría. |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **Parcial.** El drawer carga departamentos activos, lee el archivo real, muestra filas analizadas y envía `multipart/form-data` al endpoint protegido. El backend asigna empleados al departamento y omite duplicados existentes. Faltan validación completa de cabecera, codificación, tamaño y documento, reporte detallado del backend, auditoría automática y una política transaccional explícita. |  |  |  |  |  |  |
| **Evidencia:** |  |  | `EmpleadoCsvDrawer.tsx`, `empleadoService.ts`, `EmpleadoController.java`, `EmpleadoServiceImpl.java`, `EmpleadoDTO.java` y `Empleado.java`. |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | que la persona tenga sesión y rol autorizado |  |  |  |  |
|  |  |  | **Cuando:** |  | abra el directorio |  |  |  |  |
|  |  |  | **Entonces:** |  | verá la acción de carga masiva y podrá iniciar el flujo; una persona sin permiso no verá la acción y recibirá 403 si intenta usar el endpoint. |  |  |  |  |
| **Condición 02** |  |  | **Dado:** |  | que se abra el drawer de importación |  |  |  |  |
|  |  |  | **Cuando:** |  | se consulten los departamentos |  |  |  |  |
|  |  |  | **Entonces:** |  | solo se mostrarán departamentos activos y se exigirá seleccionar un destino. |  |  |  |  |
| **Condición 03** |  |  | **Dado:** |  | que la persona seleccione un archivo |  |  |  |  |
|  |  |  | **Cuando:** |  | no sea `.csv`, supere el tamaño permitido o no pueda leerse |  |  |  |  |
|  |  |  | **Entonces:** |  | se rechazará antes del envío, se explicará la causa y no se modificarán empleados. |  |  |  |  |
| **Condición 04** |  |  | **Dado:** |  | que el archivo tenga registros |  |  |  |  |
|  |  |  | **Cuando:** |  | se valide la primera fila |  |  |  |  |
|  |  |  | **Entonces:** |  | se aceptará únicamente la cabecera `nombre, apellido, documento, correo, cargo` con cinco columnas separadas por comas. |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | que el archivo esté vacío, tenga solo cabecera o líneas en blanco |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona intente continuar |  |  |  |  |
|  |  |  | **Entonces:** |  | se mostrará **Archivo sin registros**, se deshabilitará la confirmación y no se enviará la solicitud. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que una fila tenga comas dentro de un campo entre comillas |  |  |  |  |
|  |  |  | **Cuando:** |  | se analice el CSV |  |  |  |  |
|  |  |  | **Entonces:** |  | el valor permanecerá completo y las columnas siguientes conservarán su posición. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que una fila tenga un campo obligatorio vacío |  |  |  |  |
|  |  |  | **Cuando:** |  | se valide |  |  |  |  |
|  |  |  | **Entonces:** |  | se rechazará la fila, se conservará el número de línea y se informará el campo faltante. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | que una fila tenga documento o correo inválido |  |  |  |  |
|  |  |  | **Cuando:** |  | se procese |  |  |  |  |
|  |  |  | **Entonces:** |  | se rechazará con un motivo; el documento deberá contener diez dígitos y el correo cumplir un formato válido. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | que el documento o correo ya exista en la base de datos |  |  |  |  |
|  |  |  | **Cuando:** |  | se procese la carga |  |  |  |  |
|  |  |  | **Entonces:** |  | la fila se marcará como duplicada y no se creará otro empleado. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | que dos filas del mismo archivo repitan documento o correo |  |  |  |  |
|  |  |  | **Cuando:** |  | se valide el conjunto |  |  |  |  |
|  |  |  | **Entonces:** |  | como máximo una fila podrá aceptarse y las restantes mostrarán las líneas relacionadas. |  |  |  |  |
| **Condición 11** |  |  | **Dado:** |  | que la estructura sea válida |  |  |  |  |
|  |  |  | **Cuando:** |  | se muestre la previsualización |  |  |  |  |
|  |  |  | **Entonces:** |  | se mostrarán datos reales, número de fila, válidas, rechazadas y motivo por fila. |  |  |  |  |
| **Condición 12** |  |  | **Dado:** |  | que existan filas válidas y rechazadas |  |  |  |  |
|  |  |  | **Cuando:** |  | se confirme la importación |  |  |  |  |
|  |  |  | **Entonces:** |  | se guardarán solo las válidas y se devolverán separados los totales aceptados, rechazados y duplicados. |  |  |  |  |
| **Condición 13** |  |  | **Dado:** |  | que una fila sea aceptada |  |  |  |  |
|  |  |  | **Cuando:** |  | finalice la persistencia |  |  |  |  |
|  |  |  | **Entonces:** |  | el empleado quedará asociado al departamento seleccionado, activo y con la configuración inicial aprobada. |  |  |  |  |
| **Condición 14** |  |  | **Dado:** |  | que ocurra un error estructural, de permisos o del servidor |  |  |  |  |
|  |  |  | **Cuando:** |  | se confirme la operación |  |  |  |  |
|  |  |  | **Entonces:** |  | no se mostrará éxito falso, se conservarán los datos existentes y se permitirá reintentar sin duplicar. |  |  |  |  |
| **Condición 15** |  |  | **Dado:** |  | que termine la importación |  |  |  |  |
|  |  |  | **Cuando:** |  | se consulte el resultado |  |  |  |  |
|  |  |  | **Entonces:** |  | se mostrará total procesado, aceptados, rechazados, duplicados y motivos sin trazas técnicas. |  |  |  |  |
| **Condición 16** |  |  | **Dado:** |  | que la importación finalice o sea rechazada |  |  |  |  |
|  |  |  | **Cuando:** |  | se registre la operación |  |  |  |  |
|  |  |  | **Entonces:** |  | auditoría guardará actor, fecha, hora, departamento, acción, resultado y totales, sin guardar el archivo completo. |  |  |  |  |
| **Condición 17** |  |  | **Dado:** |  | que la persona cancele o cambie de archivo antes de confirmar |  |  |  |  |
|  |  |  | **Cuando:** |  | seleccione la acción correspondiente |  |  |  |  |
|  |  |  | **Entonces:** |  | se limpiará la previsualización y no se enviará ni persistirá ningún registro. |  |  |  |  |
| **Condición 18** |  |  | **Dado:** |  | que una importación termine correctamente |  |  |  |  |
|  |  |  | **Cuando:** |  | se actualice el directorio |  |  |  |  |
|  |  |  | **Entonces:** |  | los empleados aceptados aparecerán una sola vez, con el departamento seleccionado y disponibles para HU-009 y HU-014. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Definir la plantilla oficial, cabecera, separador, codificación y tamaño máximo del CSV. |  |  |  |  |  |  |
| 2 |  |  | Documentar el contrato multipart, departamento destino y respuesta con totales y filas. |  |  |  |  |  |  |
| 3 |  |  | Restringir la carga masiva a SUPER_ADMIN y ADMIN_ACCESOS en frontend y backend. |  |  |  |  |  |  |
| 4 |  |  | Cargar departamentos activos y exigir destino antes de confirmar. |  |  |  |  |  |  |
| 5 |  |  | Validar extensión, tamaño, codificación, cabecera y archivo sin registros. |  |  |  |  |  |  |
| 6 |  |  | Implementar el parser para comillas, separadores, saltos de línea y campos. |  |  |  |  |  |  |
| 7 |  |  | Validar campos obligatorios, documento, correo y cargo en cliente y servidor. |  |  |  |  |  |  |
| 8 |  |  | Detectar duplicados contra la base de datos y dentro del archivo. |  |  |  |  |  |  |
| 9 |  |  | Construir la previsualización con datos reales, estados, totales y motivos. |  |  |  |  |  |  |
| 10 |  |  | Implementar la política de carga parcial sin guardar filas incompletas o duplicadas. |  |  |  |  |  |  |
| 11 |  |  | Asociar cada empleado válido al departamento y estado inicial aprobados. |  |  |  |  |  |  |
| 12 |  |  | Evitar datos huérfanos y confirmaciones falsas ante errores de persistencia. |  |  |  |  |  |  |
| 13 |  |  | Devolver el reporte detallado de procesados, aceptados, rechazados y duplicados. |  |  |  |  |  |  |
| 14 |  |  | Actualizar el directorio después de una importación exitosa. |  |  |  |  |  |  |
| 15 |  |  | Integrar la operación con auditoría sin guardar el archivo ni credenciales. |  |  |  |  |  |  |
| 16 |  |  | Limpiar archivo y previsualización al cancelar o cambiar de archivo. |  |  |  |  |  |  |
| 17 |  |  | Ejecutar pruebas unitarias del parser, formatos, campos, archivos vacíos y duplicados. |  |  |  |  |  |  |
| 18 |  |  | Ejecutar pruebas de integración del endpoint, permisos, persistencia y errores. |  |  |  |  |  |  |
| 19 |  |  | Ejecutar pruebas funcionales de carga válida, parcial, cancelación, reintento y auditoría. |  |  |  |  |  |  |
| **REGLAS DE NEGOCIO Y CALIDAD** |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  | La validación del navegador no reemplaza la del servidor. Documento y correo son únicos. Un archivo estructuralmente inválido no debe guardar filas. Para errores de fila se aplicará la política de carga parcial aprobada y se reportará el motivo. No se usarán mocks silenciosos, credenciales ni tokens en el flujo. |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 01-09-2026 |  |  | Revisión completa de HU-008 contra drawer, servicio, endpoint, persistencia y auditoría. |  |  |  |
