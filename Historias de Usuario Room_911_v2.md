

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

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-002 |  | **Nombre:** |  | Gestión de administradores |  |  |  |  |
| **Complejidad:** |  |  | Alta |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-01 |  |  |  |  |  |  |
| **Módulo:** |  |  | Administracion de usuarios |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador principal |  |  |  |  |
|  |  |  | **Requiero** |  | Gestionar los usuarios administradores |  |  |  |  |
|  |  |  | **Para** |  | Permitir que varias personas autorizadas administren el sistema |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá mostrar una pantalla que permita: Crear administradores, consultar administradores, editar administradores, activar administradores, inactivar administradores, buscar administradores, visualizar estado de cada cuenta. La información deberá mostrarse en una tabla con acciones disponibles para cada registro  |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01**  |  |  | **Dado:** |  | Que el administrador diligencie el formulario |  |  |  |  |
|  |  |  | **Cuando:** |  | Guarde la información |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema registrará el nuevo administrador |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que el correo electrónico exista   |  |  |  |  |
|  |  |  | **Cuando:** |  | Intente registrar un nuevo administrador |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema rechazará el registro |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que exista un usuario registrado |  |  |  |  |
|  |  |  | **Cuando:** |  | Se intente reutilizar  |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará el error correspondiente  |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que existan campos vacíos |  |  |  |  |
|  |  |  | **Cuando:** |  | Se envíe el formulario  |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema solicitará completar la información  |  |  |  |  |
| **Condicion 05** |  |  | **Dado:** |  | Que el administrador exista |  |  |  |  |
|  |  |  | **Cuando:** |  | Se seleccione Editar |  |  |  |  |
|  |  |  | **Entonces:**  |  | El sistema mostrará su información actual |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | Que se modifiquen los datos |  |  |  |  |
|  |  |  | **Cuando:** |  | Se guarden los cambios |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema actualizará la información |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | Que un administrador esté activo |  |  |  |  |
|  |  |  | **Cuando:** |  | Se seleccione Inactivar |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema cambiará su estado |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | Que un administrador esté inactivo |  |  |  |  |
|  |  |  | **Cuando:** |  | Se seleccione Activar |  |  |  |  |
|  |  |  | **Entonces:**  |  | El sistema habilitará nuevamente el acceso |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | Que se consulte el listado |  |  |  |  |
|  |  |  | **Cuando:** |  | Cargue la pantalla |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará todos los administradores registrados |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | Que exista una modificación |  |  |  |  |
|  |  |  | **Cuando:** |  | Finalice el proceso |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema registrará la acción en auditoría |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Definir la entidad de administrador con nombre, apellido, correo, usuario, rol, estado, fechas y credencial protegida para representar una cuenta completa. |  |  |  |  |  |  |
| 2 |  |  | Implementar las operaciones de registro, consulta y actualización de administradores, incluyendo respuestas claras para éxito, duplicados, permisos y errores de servicio. |  |  |  |  |  |  |
| 3 |  |  | Diseñar el formulario de registro con campos obligatorios, selección de rol, confirmación de correo y contraseña, validaciones visibles y estado inicial activo |  |  |  |  |  |  |
| 4 |  |  | Diseñar el formulario de edición para precargar los datos permitidos, conservar la contraseña oculta y permitir actualizar solo la información autorizada |  |  |  |  |  |  |
| 5 |  |  | Validar que el nombre de usuario y el correo sean únicos antes de guardar, tanto en la interfaz como en el servidor, evitando registros duplicados |  |  |  |  |  |  |
| 6 |  |  | Implementar el estado activo o inactivo de cada cuenta y mostrarlo con una etiqueta comprensible en el listado y en las acciones disponibles |  |  |  |  |  |  |
| 7 |  |  | Construir el listado de administradores con nombre, usuario, correo, rol, estado y acciones de edición, activación o inactivación por registro |  |  |  |  |  |  |
| 8 |  |  | Implementar búsqueda por nombre, usuario, correo o identificador para localizar una cuenta y reiniciar la paginación cuando cambien los criterios |  |  |  |  |  |  |
| 9 |  |  | Implementar paginación del listado, indicando la cantidad de resultados y conservando un estado vacío informativo cuando no existan coincidencias |  |  |  |  |  |  |
| 10 |  |  | Implementar la activación de una cuenta inactiva mediante confirmación, persistir el cambio y actualizar inmediatamente el estado visible |  |  |  |  |  |  |
| 11 |  |  | Implementar la inactivación de una cuenta activa mediante confirmación, impedir la auto-inactivación y bloquear el acceso posterior de la cuenta afectada |  |  |  |  |  |  |
| 12 |  |  | Actualizar la información editada en el backend, devolver los campos acordados y comprobar que los cambios permanezcan después de recargar el módulo |  |  |  |  |  |  |
| 13 |  |  | Registrar en auditoría cada creación, edición, activación, inactivación o rechazo, incluyendo actor, fecha, hora, resultado y cuenta involucrada |  |  |  |  |  |  |
| 14 |  |  | Mostrar confirmaciones específicas después de crear, editar, activar o reactivar una cuenta, indicando qué administrador fue afectado |  |  |  |  |  |  |
| 15 |  |  | Mostrar mensajes de error junto al campo o acción correspondiente, sin borrar datos válidos ni ocultar fallas reales del backend con información de demostración |  |  |  |  |  |  |
| 16 |  |  | Ejecutar pruebas funcionales de creación, duplicados, validaciones, edición, búsqueda, filtros, paginación, permisos, estados y persistencia después de recargar |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

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
| **Condición 01** |  |  | **Dado:** |  | Que el administrador registre un departamento |  |  |  |  |
|  |  |  | **Cuando:** |  | Guarde la información |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema almacenará el departamento |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que exista un nombre de departamento registrado |  |  |  |  |
|  |  |  | **Cuando:** |  | Se intente registrar nuevamente |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema rechazará el registro |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que existan campos obligatorios vacíos |  |  |  |  |
|  |  |  | **Cuando:** |  | Se envíe el formulario |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará las validaciones |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que exista un departamento |  |  |  |  |
|  |  |  | **Cuando:** |  | Se seleccione editar |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará la información actual |  |  |  |  |
| **Condicion 05** |  |  | **Dado:** |  | Que se modifique la información |  |  |  |  |
|  |  |  | **Cuando:** |  | Se guarde la modificación |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema actualizará los datos |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | Que se consulte un departamento |  |  |  |  |
|  |  |  | **Cuando:** |  | Se visualice el detalle |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará los empleados asociados |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | Que existan varios departamentos |  |  |  |  |
|  |  |  | **Cuando:** |  | Se realice una búsqueda |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará coincidencias |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | Que no existan resultados |  |  |  |  |
|  |  |  | **Cuando:** |  | Se ejecute una consulta |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema indicará que no hay registros |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Definir la entidad departamento con nombre, descripción, capacidad y datos de control para representar cada área de trabajo |  |  |  |  |  |  |
| 2 |  |  | Crear la estructura de almacenamiento con campos obligatorios, límites de capacidad y reglas que eviten departamentos duplicados |  |  |  |  |  |  |
| 3 |  |  | Implementar las operaciones de registro, consulta, edición y validación de departamentos con respuestas comprensibles para la persona usuaria |  |  |  |  |  |  |
| 4 |  |  | Diseñar el formulario de registro para capturar la información del departamento y validar los datos antes de enviarlos |  |  |  |  |  |  |
| 5 |  |  | Diseñar el formulario de edición para mostrar la información actual y permitir cambios sin perder las relaciones existentes |  |  |  |  |  |  |
| 6 |  |  | Construir el listado con nombre, capacidad, cantidad de empleados, búsqueda y acciones disponibles para cada departamento |  |  |  |  |  |  |
| 7 |  |  | Implementar la búsqueda por nombre y actualizar los resultados mostrando un estado vacío cuando no haya coincidencias |  |  |  |  |  |  |
| 8 |  |  | Relacionar cada departamento con los empleados para que pueda seleccionarse durante el registro o edición del personal |  |  |  |  |  |  |
| 9 |  |  | Implementar la consulta de empleados asociados y mostrar la cantidad o detalle disponible desde el departamento seleccionado |  |  |  |  |  |  |
| 10 |  |  | Validar la eliminación o modificación de un departamento cuando tenga empleados asociados, protegiendo la integridad de la información |  |  |  |  |  |  |
| 11 |  |  | Registrar en auditoría las creaciones, ediciones, eliminaciones rechazadas y demás cambios relevantes del catálogo de departamentos |  |  |  |  |  |  |
| 12 |  |  | Mostrar confirmaciones después de guardar o actualizar, indicando el departamento afectado y el resultado de la operación |  |  |  |  |  |  |
| 13 |  |  | Mostrar mensajes de error junto al campo o acción correspondiente, conservando los datos válidos para facilitar la corrección |  |  |  |  |  |  |
| 14 |  |  | Ejecutar pruebas funcionales de registro, duplicados, validaciones, edición, búsqueda, relaciones, eliminación y consulta sin resultados |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

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
| **Condición 01**  |  |  | **Dado:** |  | Que el administrador exista |  |  |  |  |
|  |  |  | **Cuando:** |  | Se seleccione “desactivar” |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema solicitará confirmación |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que el administrador confirme la desactivación |  |  |  |  |
|  |  |  | **Cuando:** |  | Presione “Aceptar” en el diálogo |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema marcará la cuenta como inactiva, actualizará el listado |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que un administrador inactivo intente iniciar sesión |  |  |  |  |
|  |  |  | **Cuando:** |  | ingrese sus credenciales |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema rechazará el acceso indicando que la cuenta se encuentra en estado inactivo |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que la operación se haya realizado correctamente |  |  |  |  |
|  |  |  | **Cuando:** |  | Se consulte el listado de administradores |  |  |  |  |
|  |  |  | **Entonces:** |  | El administrador aparecerá con estado “Inactivo”  |  |  |  |  |
| **Condicion 05** |  |  | **Dado:** |  | Que se intente desactivar un administrador sin permisos |  |  |  |  |
|  |  |  | **Cuando:** |  | Se ejecute la acción |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará mensaje “Acceso denegado” |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | Que se desactive un administrador |  |  |  |  |
|  |  |  | **Cuando:** |  | se confirme la acción |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema registrará la operación en auditoría |  |  |  |  |
| **Tareas** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Incorporar el estado activo o inactivo a la cuenta y definir cómo se representa para consulta y autenticación |  |  |  |  |  |  |
| 2 |  |  | Agregar la acción “Desactivar” al registro de una cuenta activa, mostrando solo las opciones permitidas por su estado |  |  |  |  |  |  |
| 3 |  |  | Diseñar una confirmación que explique la consecuencia de desactivar la cuenta y permita cancelar sin aplicar cambios |  |  |  |  |  |  |
| 4 |  |  | Actualizar y persistir el estado de la cuenta para que el cambio se mantenga al consultar o recargar el listado |  |  |  |  |  |  |
| 5 |  |  | Impedir la autenticación de cuentas inactivas desde el servidor y devolver una respuesta segura y comprensible |  |  |  |  |  |  |
| 6 |  |  | Mostrar el estado actualizado en el listado y diferenciar visualmente cuentas activas e inactivas |  |  |  |  |  |  |
| 7 |  |  | Registrar la desactivación con persona ejecutora, cuenta afectada, fecha, hora, resultado y motivo cuando corresponda |  |  |  |  |  |  |
| 8 |  |  | Mostrar una confirmación posterior que indique que la cuenta quedó inactiva y que ya no puede iniciar sesión |  |  |  |  |  |  |
| 9 |  |  | Mostrar errores de permisos, cuenta inexistente, sesión inválida o falla del servicio sin modificar información parcialmente |  |  |  |  |  |  |
| 10 |  |  | Validar que la cuenta exista, que esté activa y que no corresponda a una operación prohibida sobre la cuenta propia |  |  |  |  |  |  |
| 11 |  |  | Ejecutar pruebas funcionales de confirmación, cancelación, desactivación, autenticación posterior, permisos, persistencia y auditoría |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

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
| **Condición 01**  |  |  | **Dado:** |  | Que el administrador permanezca inactivo |  |  |  |  |
|  |  |  | **Cuando:** |  | Se supere el tiempo configurado |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará advertencia de cierre |  |  |  |  |
| **Condición 02**  |  |  | **Dado:** |  | Que se supere el tiempo máximo de inactividad |  |  |  |  |
|  |  |  | **Cuando:** |  | No se detecte interacción |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema cerrará sesión automáticamente |  |  |  |  |
| **Condición 03**  |  |  | **Dado:** |  | Que se cierre sesión por inactividad |  |  |  |  |
|  |  |  | **Cuando:** |  | Se registre la acción |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema guardará el evento en auditoría |  |  |  |  |
| **Condición 04**  |  |  | **Dado:** |  | Que el administrador intente realizar una acción tras cierre |  |  |  |  |
|  |  |  | **Cuando:** |  | Se ejecute cualquier operación |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema solicitará nueva autenticación |  |  |  |  |
| **Condicion 05** |  |  | **Dado:** |  | Que el administrador configure tiempo de inactividad |  |  |  |  |
|  |  |  | **Cuando:** |  | Se guarde la configuración |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema aplicará el nuevo tiempo |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | Que se cierre sesión automáticamente |  |  |  |  |
|  |  |  | **Cuando:** |  | Se redirija al login |  |  |  |  |
|  |  |  | **Entonces:** |  | El sistema mostrará mensaje “Sesión cerrada por inactividad” |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Implementar el temporizador de inactividad para controlar el tiempo sin interacción y reiniciarlo con acciones válidas de la persona usuaria |  |  |  |  |  |  |
| 2 |  |  | Diseñar la advertencia previa al cierre con tiempo restante, motivo y una acción clara para mantener la sesión activa |  |  |  |  |  |  |
| 3 |  |  | Implementar el cierre automático cuando finalice el tiempo permitido, eliminando la información de sesión disponible en el navegador |  |  |  |  |  |  |
| 4 |  |  | Redirigir al inicio de sesión y bloquear las rutas protegidas después de que la sesión haya expirado |  |  |  |  |  |  |
| 5 |  |  | Registrar el cierre por inactividad con usuario, fecha, hora y motivo, sin almacenar contraseñas ni tokens |  |  |  |  |  |  |
| 6 |  |  | Validar el tiempo configurado, sus límites y el permiso requerido antes de aplicarlo a las sesiones |  |  |  |  |  |  |
| 7 |  |  | Permitir cancelar la advertencia mediante interacción válida y conservar la sesión solo mientras siga vigente |  |  |  |  |  |  |
| 8 |  |  | Mostrar mensajes de cierre, sesión expirada y errores de configuración con lenguaje claro y sin detalles técnicos |  |  |  |  |  |  |
| 9 |  |  | Ejecutar pruebas unitarias del contador, reinicio del temporizador, advertencia, expiración y limpieza de la sesión |  |  |  |  |  |  |
| 10 |  |  | Ejecutar pruebas funcionales de inactividad, continuidad por interacción, redirección, bloqueo de rutas, auditoría y nueva autenticación |  |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
|  |  |  |  |  |  |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-008 |  | **Nombre:** |  | Registro masivo de empleados (CSV) |  |  |  |  |
| **Complejidad:** |  |  | Alta |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-002, HU-003, HU-009, HU-014 y HU-020 |  |  |  |  |  |  |
| **Módulo:** |  |  | Gestión de empleados |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador con permiso para gestionar personal |  |  |  |  |
|  |  |  | **Requiero** |  | Cargar varios empleados mediante un archivo CSV y conocer el resultado de cada fila |  |  |  |  |
|  |  |  | **Para** |  | Registrar personal de forma rápida, controlada y trazable, sin crear datos incompletos o duplicados |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá permitir seleccionar un departamento activo, cargar un archivo CSV UTF-8 separado por comas, validar su estructura y mostrar una previsualización antes de guardar. La importación deberá revisar cada fila, separar registros aceptados y rechazados con su motivo, conservar la integridad de la información existente, actualizar el directorio y dejar evidencia de la operación en auditoría. |  |  |  |  |  |  |
| **Alcance:** |  |  | Incluye selección del departamento destino, lectura del archivo, validación de cabecera y campos, detección de duplicados, previsualización, confirmación, persistencia de filas válidas, reporte de resultados, mensajes de error y trazabilidad. La edición de empleados, la autorización de acceso y la validación transversal de duplicados se detallan en HU-009, HU-010 y HU-014. |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **Parcial.** `EmpleadoCsvDrawer.tsx` carga departamentos activos, acepta un archivo real, interpreta filas en el navegador, muestra una previsualización y envía el archivo mediante `multipart/form-data`. El backend asigna las filas a un departamento y omite coincidencias existentes por documento o correo. Aún no se valida de forma completa la cabecera, la codificación, el límite de tamaño, el formato de documento ni todos los duplicados antes de guardar; la respuesta solo informa que el archivo fue importado, no devuelve aceptados, rechazados ni motivos; tampoco hay evidencia de auditoría automática ni de una política transaccional para fallas parciales. |  |  |  |  |  |  |
| **Precondiciones:** |  |  | La persona debe tener una sesión válida y un rol autorizado para gestionar personal. Debe existir al menos un departamento activo y el archivo debe respetar la plantilla acordada: `nombre, apellido, documento, correo, cargo`. |  |  |  |  |  |  |
| **Flujo principal:** |  |  | 1. La persona abre **Carga Masiva (Empleados)**. 2. El sistema carga los departamentos activos y solicita elegir el destino. 3. La persona selecciona o arrastra el CSV. 4. El sistema valida el archivo y presenta las filas con su estado. 5. La persona revisa la previsualización y confirma la importación. 6. El servidor vuelve a validar los datos, guarda únicamente las filas aceptadas y genera el resultado. 7. El sistema informa los totales, muestra los motivos de rechazo, actualiza el directorio y registra la operación. |  |  |  |  |  |  |
| **Evidencia:** |  |  | E-07 [`EmpleadoCsvDrawer.tsx:67`](./room911-frontend/src/pages/EmpleadoCsvDrawer.tsx:67), [`empleadoService.ts:97`](./room911-frontend/src/services/empleadoService.ts:97), [`EmpleadoController.java:98`](./backend_911/backend/src/main/java/com/room911/controller/EmpleadoController.java:98), [`EmpleadoServiceImpl.java:124`](./backend_911/backend/src/main/java/com/room911/service/impl/EmpleadoServiceImpl.java:124), [`EmpleadoDTO.java:18`](./backend_911/backend/src/main/java/com/room911/dto/EmpleadoDTO.java:18) y [`Auditoria.java:20`](./backend_911/backend/src/main/java/com/room911/entity/Auditoria.java:20). |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | que la persona tenga una sesión válida y un rol autorizado para gestionar personal |  |  |  |  |
|  |  |  | **Cuando:** |  | abra el directorio de empleados |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará la acción **Carga Masiva (Empleados)** y permitirá iniciar el flujo; una persona sin permiso no verá la acción y el servidor rechazará un intento directo. |  |  |  |  |
| **Condición 02** |  |  | **Dado:** |  | que se abra el formulario de carga masiva |  |  |  |  |
|  |  |  | **Cuando:** |  | se consulten los departamentos disponibles |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará únicamente departamentos activos, exigirá seleccionar un destino y explicará el problema si no puede cargar la lista. |  |  |  |  |
| **Condición 03** |  |  | **Dado:** |  | que la persona seleccione un archivo |  |  |  |  |
|  |  |  | **Cuando:** |  | el archivo no tenga extensión `.csv`, supere el tamaño permitido o no pueda leerse como UTF-8 |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema rechazará el archivo antes de enviarlo, indicará la causa de forma comprensible y no modificará ningún empleado. |  |  |  |  |
| **Condición 04** |  |  | **Dado:** |  | que el archivo tenga registros |  |  |  |  |
|  |  |  | **Cuando:** |  | se revise la primera fila |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema aceptará únicamente la cabecera acordada —`nombre, apellido, documento, correo, cargo`— con cinco columnas separadas por comas y rechazará estructuras distintas sin guardar filas. |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | que el archivo esté vacío, tenga solo cabecera o contenga únicamente líneas en blanco |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona intente continuar |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará **Archivo sin registros**, deshabilitará la confirmación y no enviará una solicitud de importación. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que el CSV use comillas para contener una coma dentro de un campo |  |  |  |  |
|  |  |  | **Cuando:** |  | se analice la fila |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema conservará el valor completo del campo, mantendrá las cinco columnas y no desplazará los datos de las columnas siguientes. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que una fila tenga nombre, apellido, documento, correo o cargo vacío |  |  |  |  |
|  |  |  | **Cuando:** |  | se valide la previsualización o se procese en el servidor |  |  |  |  |
|  |  |  | **Entonces:** |  | la fila quedará rechazada, se conservará su número de línea y el reporte explicará cuál campo obligatorio falta. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | que una fila tenga datos completos |  |  |  |  |
|  |  |  | **Cuando:** |  | se validen documento y correo |  |  |  |  |
|  |  |  | **Entonces:** |  | el documento deberá contener exactamente diez dígitos y el correo deberá tener un formato válido; una fila que no cumpla será rechazada con su motivo. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | que el documento o correo de una fila ya pertenezca a un empleado registrado |  |  |  |  |
|  |  |  | **Cuando:** |  | se procese la carga |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema no creará otro empleado, marcará la fila como duplicada y mostrará el campo que provocó el rechazo. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | que dos o más filas del mismo archivo repitan documento o correo |  |  |  |  |
|  |  |  | **Cuando:** |  | se valide el conjunto de filas |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema conservará como máximo una fila aceptada y marcará las demás como duplicadas, indicando las líneas involucradas. |  |  |  |  |
| **Condición 11** |  |  | **Dado:** |  | que el archivo haya pasado la validación estructural |  |  |  |  |
|  |  |  | **Cuando:** |  | se muestre la previsualización |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará el número de fila, los datos principales, la cantidad de filas válidas y rechazadas y el motivo de cada rechazo, sin presentar filas de ejemplo como si fueran del archivo. |  |  |  |  |
| **Condición 12** |  |  | **Dado:** |  | que existan filas válidas y filas rechazadas por errores de datos |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona confirme la importación |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema guardará las filas válidas, no guardará las rechazadas y entregará un resultado que distinga ambos totales. |  |  |  |  |
| **Condición 13** |  |  | **Dado:** |  | que una fila sea aceptada |  |  |  |  |
|  |  |  | **Cuando:** |  | finalice la persistencia |  |  |  |  |
|  |  |  | **Entonces:** |  | el empleado quedará asociado al departamento seleccionado, activo y con permiso de acceso inicial según la regla de negocio definida para altas masivas. |  |  |  |  |
| **Condición 14** |  |  | **Dado:** |  | que el archivo tenga un error estructural o el servidor no esté disponible |  |  |  |  |
|  |  |  | **Cuando:** |  | se intente confirmar la carga |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema no mostrará éxito, conservará los datos existentes, informará que la operación no terminó y permitirá reintentar sin duplicar registros. |  |  |  |  |
| **Condición 15** |  |  | **Dado:** |  | que termine una importación con o sin filas rechazadas |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona consulte el resultado |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará total procesado, aceptados, rechazados, duplicados y motivos por fila; no expondrá trazas, consultas ni detalles técnicos. |  |  |  |  |
| **Condición 16** |  |  | **Dado:** |  | que la importación finalice o sea rechazada |  |  |  |  |
|  |  |  | **Cuando:** |  | se registre la operación |  |  |  |  |
|  |  |  | **Entonces:** |  | la auditoría conservará el administrador ejecutor, fecha, hora, acción, departamento, resultado y totales, sin guardar el archivo completo ni credenciales. |  |  |  |  |
| **Condición 17** |  |  | **Dado:** |  | que la persona cambie de archivo o cancele la operación antes de confirmar |  |  |  |  |
|  |  |  | **Cuando:** |  | seleccione **Cambiar archivo** o **Cancelar** |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema limpiará la previsualización y no enviará ni persistirá ningún registro. |  |  |  |  |
| **Condición 18** |  |  | **Dado:** |  | que una importación termine correctamente |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona vuelva al directorio o lo actualice |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará los nuevos empleados una sola vez, asociados al departamento elegido y disponibles para las historias de edición, búsqueda y validación de duplicados. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Definir la plantilla CSV oficial con nombre, apellido, documento, correo y cargo, incluyendo separador, codificación, cabecera y límite de tamaño. |  |  |  |  |  |  |
| 2 |  |  | Documentar el contrato de importación, incluyendo departamento destino, nombre del campo multipart y estructura de la respuesta con totales y resultados por fila. |  |  |  |  |  |  |
| 3 |  |  | Restringir la acción de carga masiva a los roles autorizados y devolver una respuesta 403 cuando se intente usar el endpoint sin permiso. |  |  |  |  |  |  |
| 4 |  |  | Cargar los departamentos activos en el formulario y exigir un destino válido antes de habilitar la confirmación. |  |  |  |  |  |  |
| 5 |  |  | Implementar la selección y el arrastre de archivos CSV, validando extensión, tamaño y lectura antes de iniciar la importación. |  |  |  |  |  |  |
| 6 |  |  | Implementar el lector CSV para reconocer comillas, separadores, saltos de línea y cabecera sin desplazar los valores de una fila. |  |  |  |  |  |  |
| 7 |  |  | Validar la estructura completa del archivo en el cliente y en el servidor, rechazando cabeceras incorrectas, columnas insuficientes y archivos sin registros. |  |  |  |  |  |  |
| 8 |  |  | Validar en cada fila los campos obligatorios, el documento de diez dígitos, el correo y el cargo, conservando el número de línea del error. |  |  |  |  |  |  |
| 9 |  |  | Detectar duplicados contra la base de datos y dentro del mismo archivo usando documento y correo como identificadores únicos. |  |  |  |  |  |  |
| 10 |  |  | Construir la previsualización con datos reales del archivo, estado por fila, totales y motivos de rechazo antes de permitir guardar. |  |  |  |  |  |  |
| 11 |  |  | Implementar el procesamiento de filas válidas y rechazadas con una política explícita de carga parcial y sin crear registros incompletos. |  |  |  |  |  |  |
| 12 |  |  | Asociar cada empleado aceptado al departamento seleccionado y aplicar el estado inicial acordado para altas masivas. |  |  |  |  |  |  |
| 13 |  |  | Proteger la persistencia ante errores estructurales o de infraestructura, evitando duplicados, datos huérfanos y confirmaciones falsas de éxito. |  |  |  |  |  |  |
| 14 |  |  | Devolver desde el backend un reporte con total procesado, aceptados, rechazados, duplicados y motivos identificados por fila. |  |  |  |  |  |  |
| 15 |  |  | Mostrar el resultado de la carga en la interfaz, permitiendo distinguir éxito total, éxito parcial y fallo sin revelar detalles técnicos. |  |  |  |  |  |  |
| 16 |  |  | Actualizar el directorio después de una importación exitosa y evitar que los registros nuevos aparezcan duplicados en la pantalla. |  |  |  |  |  |  |
| 17 |  |  | Registrar la importación y su resultado en auditoría con actor, fecha, hora, departamento, totales y referencia segura de la operación. |  |  |  |  |  |  |
| 18 |  |  | Limpiar el archivo y la previsualización cuando la persona cancele o cambie de archivo, sin realizar solicitudes ni guardar información. |  |  |  |  |  |  |
| 19 |  |  | Ejecutar pruebas unitarias del parser, cabecera, campos obligatorios, formatos, comillas, archivos vacíos y duplicados dentro del archivo. |  |  |  |  |  |  |
| 20 |  |  | Ejecutar pruebas de integración del endpoint con permisos, departamento inexistente, respuesta detallada, persistencia y errores de lectura. |  |  |  |  |  |  |
| 21 |  |  | Ejecutar pruebas funcionales de carga válida, carga parcial, archivo inválido, cancelación, reintento, actualización del directorio y auditoría. |  |  |  |  |  |  |
| **REGLAS DE NEGOCIO Y CALIDAD** |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  | El documento no debe contener credenciales, tokens ni datos de demostración. La validación del navegador es una ayuda visual y el servidor debe volver a validar cada dato. Los documentos y correos deben ser únicos. Un archivo estructuralmente inválido no debe guardar ninguna fila; para errores de fila debe aplicarse la política de carga parcial aprobada y reportarse claramente. |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 01-09-2026 |  |  | Revisión de HU-008 contra la implementación real; ampliación de alcance, criterios, brechas, reglas y tareas verificables. |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-009 |  | **Nombre:** |  | Editar información de empleado |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-008, HU-010, HU-012 y HU-014 |  |  |  |  |  |  |
| **Módulo:** |  |  | Gestión de empleados |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador con permiso para gestionar personal |  |  |  |  |
|  |  |  | **Requiero** |  | Modificar la información de un empleado registrado |  |  |  |  |
|  |  |  | **Para** |  | Mantener actualizados los datos del personal y asegurar que las validaciones de acceso usen información correcta |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá permitir abrir la ficha de un empleado desde el listado, mostrar un formulario precargado con nombres, apellidos, documento, correo, departamento, cargo y permiso de acceso, validar los datos en el cliente y en el servidor, rechazar duplicados de documento o correo, guardar los cambios de forma persistente y confirmar el resultado. La edición quedará restringida a los roles autorizados. |  |  |  |  |  |  |
| **Alcance:** |  |  | Incluye la apertura del formulario desde el listado, la precarga de datos, las validaciones de campo, la detección de duplicados al guardar, la actualización vía PUT /api/empleados/{id}, los mensajes de éxito y error y la persistencia observable en el listado. No incluye la autorización o revocación del acceso como acción separada (HU-010), la carga masiva (HU-008), la búsqueda y los filtros (HU-012 y HU-013) ni la auditoría automática de la operación (HU-020). |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **Parcial.** El mismo formulario se usa para crear y editar con título dinámico, precarga los datos y valida los campos en el cliente; la actualización usa PUT /empleados/{dbId} y el servidor revalida obligatorios y duplicados solo cuando el valor cambió. Brechas: no existe confirmación adicional al modificar el documento de identidad; la edición no genera registro de auditoría; no hay notificación al administrador principal; el formulario no expone el estado de cuenta (activo) y el servidor no lo altera; los duplicados de empleado responden 400 en lugar de 409 de forma consistente. |  |  |  |  |  |  |
| **Precondiciones:** |  |  | La persona debe tener una sesión válida y el rol SUPER_ADMIN o ADMIN_ACCESOS; debe existir al menos un empleado activo registrado y el catálogo de departamentos debe poder cargarse. |  |  |  |  |  |  |
| **Flujo principal:** |  |  | 1. La persona abre el directorio de empleados. 2. Selecciona la acción **Editar** en la fila del empleado. 3. El sistema muestra el formulario precargado con los datos actuales. 4. La persona modifica los datos y guarda. 5. El sistema valida el formulario, envía la actualización y el servidor revalida obligatorios y unicidad. 6. El sistema confirma el resultado, actualiza el listado y los cambios permanecen al recargar. |  |  |  |  |  |  |
| **Evidencia:** |  |  | E-08 [`Empleados.tsx:301`](./room911-frontend/src/pages/Empleados.tsx:301) (apertura de la edición), [`EmpleadoFormDrawer.tsx:91`](./room911-frontend/src/pages/EmpleadoFormDrawer.tsx:91) (validaciones del formulario), [`empleadoService.ts:74`](./room911-frontend/src/services/empleadoService.ts:74) (PUT), [`EmpleadoController.java:80`](./backend_911/backend/src/main/java/com/room911/controller/EmpleadoController.java:80) (endpoint y roles), [`EmpleadoServiceImpl.java:81`](./backend_911/backend/src/main/java/com/room911/service/impl/EmpleadoServiceImpl.java:81) (actualización y duplicados) y [`EmpleadoMapper.java:14`](./backend_911/backend/src/main/java/com/room911/mapper/EmpleadoMapper.java:14) (mapeo de respuesta). |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | que la persona tenga sesión válida y rol SUPER_ADMIN o ADMIN_ACCESOS, y que el empleado exista y esté activo |  |  |  |  |
|  |  |  | **Cuando:** |  | seleccione **Editar** y guarde cambios válidos |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema actualizará la ficha, mostrará la confirmación con el nombre del empleado y el listado reflejará los nuevos datos. |  |  |  |  |
| **Condición 02** |  |  | **Dado:** |  | que la persona carezca del rol requerido |  |  |  |  |
|  |  |  | **Cuando:** |  | intente editar desde la interfaz o llame al endpoint directamente |  |  |  |  |
|  |  |  | **Entonces:** |  | no verá la acción y el servidor responderá 403 sin modificar ningún dato. |  |  |  |  |
| **Condición 03** |  |  | **Dado:** |  | que se dejen vacíos nombres, apellidos, documento, departamento o cargo |  |  |  |  |
|  |  |  | **Cuando:** |  | se intente guardar |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará la validación junto a cada campo, no enviará la solicitud y conservará los datos ya diligenciados. |  |  |  |  |
| **Condición 04** |  |  | **Dado:** |  | que el documento modificado no tenga exactamente diez dígitos |  |  |  |  |
|  |  |  | **Cuando:** |  | se valide el formulario o se procese en el servidor |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema rechazará el cambio explicando la regla del documento y no actualizará el registro. |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | que el correo tenga formato inválido o supere los 80 caracteres |  |  |  |  |
|  |  |  | **Cuando:** |  | se guarde la información |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará el error junto al campo y no enviará la actualización. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que el documento o el correo nuevo ya pertenezca a otro empleado registrado |  |  |  |  |
|  |  |  | **Cuando:** |  | se confirme el guardado |  |  |  |  |
|  |  |  | **Entonces:** |  | el servidor rechazará la actualización con un mensaje claro indicando el dato duplicado y ningún registro será modificado. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que la persona abra la edición de un empleado que ya no existe o está inactivo |  |  |  |  |
|  |  |  | **Cuando:** |  | el sistema consulte el expediente |  |  |  |  |
|  |  |  | **Entonces:** |  | informará que no fue posible obtener el expediente y no permitirá guardar datos sobre un registro inexistente. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | que el servidor no esté disponible o falle durante el guardado |  |  |  |  |
|  |  |  | **Cuando:** |  | se confirme la edición |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará el mensaje de error del servidor, no informará éxito y conservará los datos del formulario para reintentar. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | que el guardado haya sido exitoso |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona recargue el directorio o vuelva a abrir la ficha |  |  |  |  |
|  |  |  | **Entonces:** |  | los cambios permanecerán y el detalle mostrará la información actualizada, incluido el nombre del departamento. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | que la edición termine o sea rechazada |  |  |  |  |
|  |  |  | **Cuando:** |  | se consulte la auditoría |  |  |  |  |
|  |  |  | **Entonces:** |  | la operación deberá quedar registrada con actor, fecha, hora y campos modificados; hoy esto no ocurre automáticamente y queda como brecha pendiente de HU-020. |  |  |  |  |
| **Condición 11** |  |  | **Dado:** |  | que el directorio no tenga empleados |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona abra el módulo |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará el estado vacío del listado y no ofrecerá filas para editar. |  |  |  |  |
| **Condición 12** |  |  | **Dado:** |  | que la persona modifique el documento de identidad |  |  |  |  |
|  |  |  | **Cuando:** |  | guarde la ficha |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema deberá solicitar confirmación adicional explicando el impacto sobre la credencial y el acceso; esta confirmación aún no existe y la tarea queda pendiente. |  |  |  |  |
| **Condición 13** |  |  | **Dado:** |  | que la persona navegue con teclado o lector de pantalla |  |  |  |  |
|  |  |  | **Cuando:** |  | recorra el formulario de edición |  |  |  |  |
|  |  |  | **Entonces:** |  | los campos deberán tener etiqueta asociada, foco visible y errores anunciados; el formulario ya etiqueta sus campos y deshabilita el botón durante el guardado. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Comprobar que la edición solo se muestre y solo se permita en el servidor para SUPER_ADMIN y ADMIN_ACCESOS, respondiendo 403 en cualquier otro caso. |  |  |  |  |  |  |
| 2 |  |  | Verificar el formulario único de alta y edición con precarga correcta de los siete campos y título dinámico según el modo. |  |  |  |  |  |  |
| 3 |  |  | Mantener las validaciones de cliente: obligatorios, nombres solo con letras, documento de diez dígitos, correo con formato y límite de 80 caracteres, cargo de 2 a 50. |  |  |  |  |  |  |
| 4 |  |  | Confirmar que el servidor revalida obligatorios, documento de diez dígitos y unicidad de documento y correo cuando el valor cambió. |  |  |  |  |  |  |
| 5 |  |  | Unificar la respuesta de duplicados de empleado en 409 con mensaje comprensible, igual que en la gestión de administradores. |  |  |  |  |  |  |
| 6 |  |  | Implementar la confirmación adicional cuando el documento de identidad cambie, explicando el impacto en la credencial y en la validación de acceso. |  |  |  |  |  |  |
| 7 |  |  | Asegurar que la actualización persista nombre, apellido, documento, correo, cargo, departamento y permiso de acceso, y que se observe al recargar el módulo. |  |  |  |  |  |  |
| 8 |  |  | Definir el comportamiento de la edición sobre un empleado inactivo y reflejarlo en mensajes claros en la interfaz. |  |  |  |  |  |  |
| 9 |  |  | Mostrar confirmaciones de éxito con el nombre del empleado y errores con el mensaje del servidor, sin exponer trazas técnicas ni datos de demostración. |  |  |  |  |  |  |
| 10 |  |  | Registrar la edición en auditoría con actor, fecha, hora y campos modificados desde el servidor, sin depender de una llamada manual del frontend (ligada a HU-020). |  |  |  |  |  |  |
| 11 |  |  | Verificar que el estado de cuenta (activo) no se pierda ni se altere durante una edición. |  |  |  |  |  |  |
| 12 |  |  | Cubrir accesibilidad: etiquetas asociadas, foco visible, navegación por teclado y mensajes de error anunciados por lectores de pantalla. |  |  |  |  |  |  |
| 13 |  |  | Evitar solicitudes duplicadas deshabilitando el botón de guardado mientras la petición está en curso y rehabilitándolo al terminar. |  |  |  |  |  |  |
| 14 |  |  | Ejecutar pruebas funcionales de edición exitosa, validaciones, duplicados, permisos, persistencia, empleado inexistente y falla del servidor. |  |  |  |  |  |  |
| **REGLAS DE NEGOCIO Y CALIDAD** |  |  |  |  |  |  |  |  |  |
|  |  |  |  | El documento y el correo deben ser únicos entre los empleados activos. La validación del navegador es una ayuda visual y el servidor es la autoridad final. No se informará éxito si el backend falla y no se mostrarán datos de demostración. La edición no debe alterar el estado de cuenta del empleado ni el histórico de accesos ya registrado. |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 01-09-2026 |  |  | Revisión de HU-009 contra la implementación real; ampliación de alcance, estado, evidencias, criterios, brechas, reglas y tareas verificables. |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-010 |  | **Nombre:** |  | Autorizar acceso al ROOM\_911 |  |  |  |  |
| **Complejidad:** |  |  | Alta |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-008, HU-009, HU-014, HU-022 y HU-023 |  |  |  |  |  |  |
| **Módulo:** |  |  | Gestión de empleados |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador con permiso para gestionar personal |  |  |  |  |
|  |  |  | **Requiero** |  | Autorizar o revocar el permiso de acceso de un empleado al ROOM\_911 |  |  |  |  |
|  |  |  | **Para** |  | Permitir que solo personal autorizado ingrese al área restringida |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá mostrar el estado de acceso de cada empleado en el listado, permitir habilitarlo o deshabilitarlo desde la ficha del empleado o mediante una acción dedicada con confirmación, persistir el cambio y aplicar la decisión en la validación del punto de acceso, de modo que un empleado sin permiso sea rechazado al intentar ingresar. |  |  |  |  |  |  |
| **Alcance:** |  |  | Incluye la columna de estado de acceso en el listado, el conmutador dentro de la ficha, la acción dedicada de habilitar o deshabilitar con confirmación en el listado y en el detalle, la persistencia vía PUT /api/empleados/{id} y el efecto real sobre POST /api/acceso. No incluye las reglas de horario, zonas ni anti-passback que hoy solo existen en el simulador (HU-023 y HU-025), la credencial digital (HU-022) ni la auditoría automática (HU-020). |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **Parcial.** El permiso se muestra como columna en el listado, se edita con el conmutador de la ficha y con la acción dedicada que pide confirmación, y el servidor lo persiste con la actualización del empleado; la validación de acceso del punto de control sí evalúa el permiso y deniega con mensaje. Brechas: no existe un endpoint dedicado de autorización — la acción ejecuta un GET completo seguido de un PUT que reenvía toda la ficha —; el anti-passback vive solo en la memoria del navegador y se pierde al recargar; la autorización no genera registro de auditoría ni notificación al administrador principal. |  |  |  |  |  |  |
| **Precondiciones:** |  |  | La persona debe tener una sesión válida y el rol SUPER_ADMIN o ADMIN_ACCESOS; debe existir al menos un empleado activo registrado. Para comprobar el efecto se requiere que el punto de acceso pueda llamar a POST /api/acceso. |  |  |  |  |  |  |
| **Flujo principal:** |  |  | 1. La persona abre el directorio de empleados. 2. Identifica el estado de acceso en la columna correspondiente. 3. Selecciona la acción de habilitar o deshabilitar acceso. 4. El sistema solicita confirmación y explica la consecuencia. 5. La persona confirma y el sistema persiste el permiso. 6. El listado y el detalle reflejan el nuevo estado y la siguiente validación de acceso aplica la decisión del servidor. |  |  |  |  |  |  |
| **Evidencia:** |  |  | E-09 [`EmpleadoFormDrawer.tsx:399`](./room911-frontend/src/pages/EmpleadoFormDrawer.tsx:399) (conmutador del permiso), [`Empleados.tsx:317`](./room911-frontend/src/pages/Empleados.tsx:317) y [`Empleados.tsx:391`](./room911-frontend/src/pages/Empleados.tsx:391) (acción con confirmación), [`empleadoService.ts:80`](./room911-frontend/src/services/empleadoService.ts:80) (GET+PUT de cambio de estado), [`EmpleadoServiceImpl.java:103`](./backend_911/backend/src/main/java/com/room911/service/impl/EmpleadoServiceImpl.java:103) (persistencia del permiso) y [`AccessServiceImpl.java:33`](./backend_911/backend/src/main/java/com/room911/service/impl/AccessServiceImpl.java:33) (evaluación en el punto de acceso). |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | que el empleado exista, esté activo y no tenga permiso de acceso |  |  |  |  |
|  |  |  | **Cuando:** |  | un administrador autorizado habilite el acceso con confirmación |  |  |  |  |
|  |  |  | **Entonces:** |  | el estado cambiará a autorizado, persistirá al recargar y la siguiente validación por POST /api/acceso será concedida. |  |  |  |  |
| **Condición 02** |  |  | **Dado:** |  | que el empleado tenga permiso de acceso activo |  |  |  |  |
|  |  |  | **Cuando:** |  | se deshabilite mediante la acción dedicada y se confirme |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará el estado deshabilitado, persistirá el cambio y la siguiente validación de acceso será denegada con mensaje. |  |  |  |  |
| **Condición 03** |  |  | **Dado:** |  | que la acción de autorización o revocación requiera confirmación |  |  |  |  |
|  |  |  | **Cuando:** |  | se abra el diálogo |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema explicará la consecuencia sobre la validación de acceso y permitirá cancelar sin aplicar cambios. |  |  |  |  |
| **Condición 04** |  |  | **Dado:** |  | que la persona carezca del rol SUPER_ADMIN o ADMIN_ACCESOS |  |  |  |  |
|  |  |  | **Cuando:** |  | intente autorizar o revocar desde la interfaz o el endpoint |  |  |  |  |
|  |  |  | **Entonces:** |  | no verá la acción y el servidor responderá 403 sin modificar el permiso. |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | que el empleado ya no exista o esté inactivo |  |  |  |  |
|  |  |  | **Cuando:** |  | se intente cambiar su permiso |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará el error del servidor y no aplicará cambios parciales sobre la ficha. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que el cambio de permiso haya sido exitoso |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona recargue el listado o el detalle |  |  |  |  |
|  |  |  | **Entonces:** |  | el estado de acceso se mantendrá según lo guardado en la base de datos. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que un empleado presente su credencial en el punto de acceso sin permiso activo |  |  |  |  |
|  |  |  | **Cuando:** |  | el servidor valide el ingreso |  |  |  |  |
|  |  |  | **Entonces:** |  | responderá denegado con mensaje comprensible y registrará el intento con su resultado. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | que un empleado tenga permiso activo y cuenta activa |  |  |  |  |
|  |  |  | **Cuando:** |  | valide su acceso |  |  |  |  |
|  |  |  | **Entonces:** |  | el servidor autorizará el ingreso y registrará el intento exitoso. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | que el servidor no esté disponible al confirmar el cambio |  |  |  |  |
|  |  |  | **Cuando:** |  | la petición falle |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará el error, no informará éxito y el permiso conservará su valor previo. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | que se autorice o revoque un acceso |  |  |  |  |
|  |  |  | **Cuando:** |  | se consulte la auditoría |  |  |  |  |
|  |  |  | **Entonces:** |  | deberá registrarse actor, fecha, hora, empleado y resultado; hoy no hay registro automático y la brecha queda pendiente de HU-020. |  |  |  |  |
| **Condición 11** |  |  | **Dado:** |  | que el directorio esté vacío o el filtro no arroje coincidencias |  |  |  |  |
|  |  |  | **Cuando:** |  | se consulte el listado |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará el estado vacío sin acciones de autorización disponibles. |  |  |  |  |
| **Condición 12** |  |  | **Dado:** |  | que la persona navegue con teclado o lector de pantalla |  |  |  |  |
|  |  |  | **Cuando:** |  | recorra la columna de estado y las acciones |  |  |  |  |
|  |  |  | **Entonces:** |  | el estado será textual y los botones tendrán nombre accesible; hoy las acciones usan iconos con descripción y el diálogo presenta el texto completo de la decisión. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Verificar el bloqueo por rol en la interfaz y el 403 del servidor para autorización y revocación. |  |  |  |  |  |  |
| 2 |  |  | Mantener el conmutador “Permiso de Acceso Activo” en la ficha con su explicación funcional para la persona usuaria. |  |  |  |  |  |  |
| 3 |  |  | Mantener la acción dedicada de habilitar o deshabilitar con diálogo de confirmación que explique la consecuencia. |  |  |  |  |  |  |
| 4 |  |  | Reemplazar el patrón GET completo más PUT por una actualización parcial segura que evite sobrescribir datos concurrentes de la ficha. |  |  |  |  |  |  |
| 5 |  |  | Asegurar la persistencia del permiso y su reflejo inmediato en el listado y en el detalle del empleado. |  |  |  |  |  |  |
| 6 |  |  | Comprobar el efecto real del permiso en POST /api/acceso, incluyendo el mensaje de denegación y el registro del intento. |  |  |  |  |  |  |
| 7 |  |  | Definir qué ocurre con la credencial digital y el código QR de un empleado deshabilitado y reflejarlo en la credencial mostrada. |  |  |  |  |  |  |
| 8 |  |  | Registrar la autorización y la revocación en auditoría automática con actor, fecha, hora y resultado (ligada a HU-020). |  |  |  |  |  |  |
| 9 |  |  | Sustituir el anti-passback del navegador por una regla de servidor o dejar documentado que la simulación no es control real de presencia. |  |  |  |  |  |  |
| 10 |  |  | Mostrar confirmaciones y errores con el mensaje real del backend, sin éxito aparente cuando la petición falla. |  |  |  |  |  |  |
| 11 |  |  | Cubrir accesibilidad de la columna de estado y de las acciones: nombres accesibles, contraste y operación por teclado. |  |  |  |  |  |  |
| 12 |  |  | Ejecutar pruebas funcionales de autorización, revocación, cancelación, permisos, persistencia, efecto en el punto de acceso y auditoría. |  |  |  |  |  |  |
| **REGLAS DE NEGOCIO Y CALIDAD** |  |  |  |  |  |  |  |  |  |
|  |  |  |  | Solo los roles SUPER_ADMIN y ADMIN_ACCESOS autorizan o revocan accesos, tanto en la interfaz como en el servidor. La decisión final sobre un ingreso la toma el servidor, no el navegador. La revocación debe reflejarse en el siguiente intento de acceso sin depender de recargas ni reinicios. Ninguna operación de autorización puede informar éxito si la persistencia falló. |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 01-09-2026 |  |  | Revisión de HU-010 contra la implementación real; ampliación de alcance, estado, evidencias, criterios, brechas, reglas y tareas verificables. |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-012 |  | **Nombre:** |  | Buscar empleados |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-009, HU-013 y HU-015 |  |  |  |  |  |  |
| **Módulo:** |  |  | Gestión de empleados |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Buscar empleados registrados en el sistema |  |  |  |  |
|  |  |  | **Para** |  | Localizar rápidamente la información de un empleado específico |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá ofrecer un campo de búsqueda en el directorio de empleados que filtre los registros visibles por nombre, apellido, identificador, documento, cargo, correo o departamento, muestre los resultados en la tabla con paginación e indique claramente cuando no existan coincidencias. |  |  |  |  |  |  |
| **Alcance:** |  |  | Incluye el campo de búsqueda del directorio, el filtrado combinable con el filtro de departamento (HU-013) y de estado, la paginación de resultados y el estado vacío. No incluye el ordenamiento por columnas, la búsqueda en el servidor ni los endpoints de búsqueda por nombre o apellido que existen sin uso en el backend. La edición del resultado corresponde a HU-009 y la exportación a HU-015. |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **Parcial.** La búsqueda es real y filtra en memoria sobre el listado cargado con GET /empleados, en los campos nombre, apellido, id, documento, cargo, correo y departamento; se combina con los filtros de departamento y estado, reinicia la paginación y muestra estado vacío. Brechas: la búsqueda es solo del lado del cliente, por lo que no escala ni aprovecha los endpoints `/empleados/nombre/{nombre}` y `/empleados/apellido/{apellido}` del backend; no existe ordenamiento de resultados; el texto del marcador de posición solo menciona cuatro de los campos buscados. |  |  |  |  |  |  |
| **Precondiciones:** |  |  | La persona debe tener una sesión válida y los empleados deben estar cargados en el directorio (GET /api/empleados). |  |  |  |  |  |  |
| **Flujo principal:** |  |  | 1. La persona abre el directorio de empleados. 2. Escribe el criterio en el campo de búsqueda. 3. El sistema filtra los registros visibles y muestra el resultado. 4. La persona puede refinar con el filtro de departamento o de estado. 5. La persona navega los resultados con la paginación o limpia el criterio para volver al listado completo. |  |  |  |  |  |  |
| **Evidencia:** |  |  | E-11 [`Empleados.tsx:89`](./room911-frontend/src/pages/Empleados.tsx:89) (filtrado en memoria), [`Empleados.tsx:213`](./room911-frontend/src/pages/Empleados.tsx:213) (campo de búsqueda), [`Empleados.tsx:340`](./room911-frontend/src/pages/Empleados.tsx:340) (estado vacío), [`empleadoService.ts:51`](./room911-frontend/src/services/empleadoService.ts:51) (GET /empleados) y [`EmpleadoController.java:56`](./backend_911/backend/src/main/java/com/room911/controller/EmpleadoController.java:56) (endpoints de búsqueda sin uso). |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | que existan empleados registrados |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona escriba un nombre, apellido, documento o identificador existente |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará únicamente los registros que coincidan con el criterio. |  |  |  |  |
| **Condición 02** |  |  | **Dado:** |  | que existan empleados registrados |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona busque por cargo, correo o departamento |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema también aplicará el filtro, aunque el marcador de posición solo mencione los campos principales. |  |  |  |  |
| **Condición 03** |  |  | **Dado:** |  | que no existan coincidencias para el criterio |  |  |  |  |
|  |  |  | **Cuando:** |  | se ejecute la búsqueda |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará el estado vacío explicando que no hay empleados que coincidan con los criterios. |  |  |  |  |
| **Condición 04** |  |  | **Dado:** |  | que el campo de búsqueda esté vacío |  |  |  |  |
|  |  |  | **Cuando:** |  | se consulte el directorio |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará el listado completo paginado, sin exigir un criterio obligatorio. |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | que la búsqueda arroje más resultados que el tamaño de página |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona navegue la paginación |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema paginará los resultados filtrados y reiniciará a la primera página al cambiar el criterio. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que la persona combine búsqueda, departamento y estado |  |  |  |  |
|  |  |  | **Cuando:** |  | se apliquen los tres criterios |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará solo los registros que cumplan todas las condiciones a la vez. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que la persona escriba un criterio con mayúsculas o minúsculas distintas |  |  |  |  |
|  |  |  | **Cuando:** |  | se ejecute la búsqueda |  |  |  |  |
|  |  |  | **Entonces:** |  | la comparación no distinguirá entre mayúsculas y minúsculas. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | que la persona intente ordenar los resultados por una columna |  |  |  |  |
|  |  |  | **Cuando:** |  | se revise la tabla |  |  |  |  |
|  |  |  | **Entonces:** |  | hoy no existe ordenamiento y la capacidad queda pendiente de implementación o de retiro del criterio original. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | que el backend no esté disponible al cargar el directorio |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona abra el módulo |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará el error del servidor y no presentará datos de demostración como resultados. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | que la persona consulte el directorio sin haber cargado aún los datos |  |  |  |  |
|  |  |  | **Cuando:** |  | la solicitud esté en curso |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará el estado de carga y deshabilitará las acciones sobre registros inexistentes. |  |  |  |  |
| **Condición 11** |  |  | **Dado:** |  | que la persona localice un empleado mediante la búsqueda |  |  |  |  |
|  |  |  | **Cuando:** |  | seleccione las acciones de la fila |  |  |  |  |
|  |  |  | **Entonces:** |  | podrá editar la ficha (HU-009), ver el detalle o abrir la credencial sin perder el criterio de búsqueda aplicado. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Mantener el campo de búsqueda del directorio con el filtrado en memoria de los siete campos soportados. |  |  |  |  |  |  |
| 2 |  |  | Corregir el marcador de posición para que describa los campos realmente buscados (id, documento, nombre, apellido, cargo, correo y departamento). |  |  |  |  |  |  |
| 3 |  |  | Verificar que la búsqueda sea insensible a mayúsculas y minúsculas y tolere espacios iniciales o finales. |  |  |  |  |  |  |
| 4 |  |  | Confirmar que la búsqueda se combina con los filtros de departamento y estado y reinicia la paginación al cambiar criterios. |  |  |  |  |  |  |
| 5 |  |  | Mantener el estado vacío informativo cuando no haya coincidencias, sin filas de ejemplo. |  |  |  |  |  |  |
| 6 |  |  | Definir si la búsqueda debe trasladarse al servidor para soportar volúmenes mayores, evaluando los endpoints `/nombre` y `/apellido` ya existentes. |  |  |  |  |  |  |
| 7 |  |  | Implementar o retirar formalmente el ordenamiento de resultados por nombre, documento o departamento. |  |  |  |  |  |  |
| 8 |  |  | Verificar la paginación de resultados filtrados y la indicación de la cantidad de coincidencias. |  |  |  |  |  |  |
| 9 |  |  | Mostrar el error del servidor sin sustituir los resultados por datos de demostración. |  |  |  |  |  |  |
| 10 |  |  | Mantener el criterio de búsqueda al ejecutar acciones sobre un resultado (editar, detalle, credencial). |  |  |  |  |  |  |
| 11 |  |  | Cubrir accesibilidad del campo de búsqueda: etiqueta asociada, anuncio del número de resultados y navegación por teclado. |  |  |  |  |  |  |
| 12 |  |  | Ejecutar pruebas funcionales de búsqueda por cada campo, combinaciones de filtros, paginación, estado vacío y falla del backend. |  |  |  |  |  |  |
| **REGLAS DE NEGOCIO Y CALIDAD** |  |  |  |  |  |  |  |  |  |
|  |  |  |  | La búsqueda nunca presentará datos de demostración ni registros inactivos disfrazados de activos: el listado se alimenta de GET /empleados, que devuelve solo empleados activos. El resultado vacío debe explicarse y no debe interpretarse como falla. Si la búsqueda se traslada al servidor, los endpoints de búsqueda deben protegerse con la misma autenticación que el resto de consultas. |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 01-09-2026 |  |  | Revisión de HU-012 contra la implementación real; ampliación de alcance, estado, evidencias, criterios, brechas, reglas y tareas verificables. |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-013 |  | **Nombre:** |  | Filtrar empleados por departamento |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-003, HU-012 y HU-015 |  |  |  |  |  |  |
| **Módulo:** |  |  | Gestión de empleados |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Filtrar los empleados por departamento |  |  |  |  |
|  |  |  | **Para** |  | Visualizar únicamente los empleados pertenecientes a un área específica |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá ofrecer un selector de departamentos en el directorio de empleados que muestre únicamente los registros del departamento elegido, se combine con la búsqueda y el filtro de estado, se pagine y presente un estado vacío claro cuando el departamento no tenga empleados. |  |  |  |  |  |  |
| **Alcance:** |  |  | Incluye el selector de departamento del directorio, el filtrado combinado, la paginación de resultados y el estado vacío. No incluye la administración del catálogo de departamentos (HU-003), la búsqueda por texto (HU-012) ni la exportación del resultado (HU-015). |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **Parcial.** El filtro existe y funciona: se combina con la búsqueda y el estado, reinicia la paginación y muestra el estado vacío. Brechas: las opciones del selector se derivan de los departamentos presentes en los empleados ya cargados, no del catálogo de departamentos, por lo que un departamento recién creado sin personal no aparece como opción; no se usa el endpoint `/empleados/departamento/{departamentoId}` que existe en el backend; no hay ordenamiento de resultados ni conteo visible de coincidencias. |  |  |  |  |  |  |
| **Precondiciones:** |  |  | La persona debe tener una sesión válida; los empleados deben estar cargados en el directorio y debe existir al menos un departamento con personal asignado para que aparezca como opción. |  |  |  |  |  |  |
| **Flujo principal:** |  |  | 1. La persona abre el directorio de empleados. 2. Selecciona un departamento en el selector. 3. El sistema muestra únicamente los empleados de ese departamento, combinando el criterio con la búsqueda y el estado activo. 4. La persona navega los resultados con la paginación o vuelve a “Todos los departamentos” para ver el listado completo. |  |  |  |  |  |  |
| **Evidencia:** |  |  | E-12 [`Empleados.tsx:87`](./room911-frontend/src/pages/Empleados.tsx:87) (opciones derivadas de los empleados), [`Empleados.tsx:99`](./room911-frontend/src/pages/Empleados.tsx:99) (filtrado en memoria), [`Empleados.tsx:223`](./room911-frontend/src/pages/Empleados.tsx:223) (selector), [`EmpleadoController.java:74`](./backend_911/backend/src/main/java/com/room911/controller/EmpleadoController.java:74) (endpoint por departamento sin uso) y [`EmpleadoRepository.java:25`](./backend_911/backend/src/main/java/com/room911/repository/EmpleadoRepository.java:25) (consulta por departamento). |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | que existan empleados registrados en varios departamentos |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona seleccione un departamento en el filtro |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará únicamente los empleados activos de ese departamento. |  |  |  |  |
| **Condición 02** |  |  | **Dado:** |  | que se seleccione un departamento sin empleados |  |  |  |  |
|  |  |  | **Cuando:** |  | se ejecute el filtro |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará el estado vacío indicando que no hay empleados que coincidan. |  |  |  |  |
| **Condición 03** |  |  | **Dado:** |  | que exista un departamento recién creado sin personal |  |  |  |  |
|  |  |  | **Cuando:** |  | se desplieguen las opciones del selector |  |  |  |  |
|  |  |  | **Entonces:** |  | hoy el departamento no aparecerá como opción porque la lista se deriva de los empleados cargados; el alineamiento con el catálogo de HU-003 queda como tarea pendiente. |  |  |  |  |
| **Condición 04** |  |  | **Dado:** |  | que la persona combine el filtro de departamento con la búsqueda y el estado |  |  |  |  |
|  |  |  | **Cuando:** |  | se apliquen los tres criterios |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará solo los registros que cumplan todas las condiciones a la vez. |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | que la persona cambie el departamento seleccionado |  |  |  |  |
|  |  |  | **Cuando:** |  | se actualice el filtro |  |  |  |  |
|  |  |  | **Entonces:** |  | la paginación se reiniciará a la primera página con los resultados del nuevo criterio. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que la persona seleccione “Todos los departamentos” |  |  |  |  |
|  |  |  | **Cuando:** |  | se restablezca el filtro |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará el listado completo de empleados activos paginado. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que la persona seleccione un departamento y consulte la cantidad de resultados |  |  |  |  |
|  |  |  | **Cuando:** |  | se revise la tabla |  |  |  |  |
|  |  |  | **Entonces:** |  | hoy no se muestra un conteo explícito de coincidencias; la capacidad queda pendiente de implementación. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | que el backend no esté disponible al cargar el directorio |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona abra el módulo |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará el error y el filtro no presentará datos de demostración. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | que la persona filtre por departamento y ejecute una acción sobre un resultado |  |  |  |  |
|  |  |  | **Cuando:** |  | edite la ficha o abra el detalle |  |  |  |  |
|  |  |  | **Entonces:** |  | la acción operará sobre el registro correcto y el cambio de departamento en la ficha se reflejará al actualizar el filtro. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | que la persona navegue con teclado o lector de pantalla |  |  |  |  |
|  |  |  | **Cuando:** |  | recorra el selector de departamentos |  |  |  |  |
|  |  |  | **Entonces:** |  | el selector será operable por teclado, con etiqueta asociada y opciones legibles. |  |  |  |  |
| **Condición 11** |  |  | **Dado:** |  | que el filtro esté aplicado y cambie el conjunto de empleados |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona actualice el directorio |  |  |  |  |
|  |  |  | **Entonces:** |  | los resultados se recalcularán con los datos vigentes y no se mostrarán registros obsoletos. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Mantener el selector de departamentos con su filtro en memoria combinable con búsqueda y estado. |  |  |  |  |  |  |
| 2 |  |  | Alinear las opciones del selector con el catálogo real de departamentos (HU-003) en lugar de derivarlas de los empleados cargados. |  |  |  |  |  |  |
| 3 |  |  | Evaluar el uso del endpoint `/empleados/departamento/{departamentoId}` para filtrar en el servidor. |  |  |  |  |  |  |
| 4 |  |  | Verificar el reinicio de paginación al cambiar el departamento y al combinar criterios. |  |  |  |  |  |  |
| 5 |  |  | Mantener el estado vacío informativo cuando el departamento no tenga empleados. |  |  |  |  |  |  |
| 6 |  |  | Agregar el conteo visible de coincidencias por departamento. |  |  |  |  |  |  |
| 7 |  |  | Verificar que el nombre de departamento mostrado provenga del servidor y no de un valor por defecto como “Sin asignar” cuando el dato existe. |  |  |  |  |  |  |
| 8 |  |  | Confirmar que las acciones sobre un resultado filtrado operan sobre el registro correcto por su identificador. |  |  |  |  |  |  |
| 9 |  |  | Mostrar el error del servidor sin datos de demostración cuando el directorio no pueda cargarse. |  |  |  |  |  |  |
| 10 |  |  | Cubrir accesibilidad del selector: etiqueta, foco visible y operación por teclado. |  |  |  |  |  |  |
| 11 |  |  | Verificar la coherencia del filtro tras crear, editar o deshabilitar empleados. |  |  |  |  |  |  |
| 12 |  |  | Ejecutar pruebas funcionales de filtro por cada departamento, combinaciones, paginación, estado vacío y actualización del directorio. |  |  |  |  |  |  |
| **REGLAS DE NEGOCIO Y CALIDAD** |  |  |  |  |  |  |  |  |  |
|  |  |  |  | El filtro debe operar sobre el catálogo vigente de departamentos y sobre empleados activos. El resultado vacío de un departamento sin personal debe explicarse y no tratarse como error. Si el filtrado se traslada al servidor, el endpoint debe exigir autenticación igual que el resto de consultas. |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 01-09-2026 |  |  | Revisión de HU-013 contra la implementación real; ampliación de alcance, estado, evidencias, criterios, brechas, reglas y tareas verificables. |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-014 |  | **Nombre:** |  | Validar duplicados en empleados |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-008, HU-009 y HU-010 |  |  |  |  |  |  |
| **Módulo:** |  |  | Gestión de empleados |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Validar que no existan empleados duplicados en el sistema |  |  |  |  |
|  |  |  | **Para** |  | Mantener la integridad de la información y evitar registros repetidos |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá garantizar la unicidad del documento y del correo entre los empleados activos en el alta individual, en la edición y en la carga masiva, rechazando o marcando como duplicadas las filas repetidas con un mensaje que identifique el campo conflictivo, tanto en el cliente como en el servidor. |  |  |  |  |  |  |
| **Alcance:** |  |  | Incluye la unicidad de documento y correo en el registro y la edición de empleados, la detección de duplicados dentro del archivo y contra la base de datos en la importación CSV, y los mensajes de rechazo visibles. No incluye la corrección del registro duplicado (que corresponde a HU-009) ni la auditoría de los intentos rechazados (HU-020). |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **Parcial.** El servidor garantiza la unicidad: la entidad declara documento y correo únicos y los servicios de alta y edición verifican con `existsByDocumento` y `existsByCorreo` antes de guardar; la importación CSV omite coincidencias y las cuenta. Brechas: el formulario no valida duplicados antes de enviar y solo muestra el mensaje del servidor tras el intento; la importación responde con un texto fijo sin el detalle de importados y duplicados por fila; los duplicados de empleado responden 400 y no 409 de forma consistente; los intentos rechazados no se registran en auditoría. |  |  |  |  |  |  |
| **Precondiciones:** |  |  | La persona debe tener una sesión válida y el rol SUPER_ADMIN o ADMIN_ACCESOS para crear o editar empleados; para la carga masiva debe existir un departamento activo destino. |  |  |  |  |  |  |
| **Flujo principal:** |  |  | 1. La persona registra o edita un empleado con documento o correo que ya existe. 2. El servidor verifica la unicidad antes de guardar. 3. El sistema rechaza la operación e indica el campo conflictivo. 4. En carga masiva, el servidor omite las filas duplicadas y las cuenta. 5. La persona corrige el dato y reintenta sin generar registros repetidos. |  |  |  |  |  |  |
| **Evidencia:** |  |  | E-13 [`Empleado.java:33`](./backend_911/backend/src/main/java/com/room911/entity/Empleado.java:33) y [`Empleado.java:37`](./backend_911/backend/src/main/java/com/room911/entity/Empleado.java:37) (unicidad en la entidad), [`EmpleadoServiceImpl.java:31`](./backend_911/backend/src/main/java/com/room911/service/impl/EmpleadoServiceImpl.java:31) y [`EmpleadoServiceImpl.java:85`](./backend_911/backend/src/main/java/com/room911/service/impl/EmpleadoServiceImpl.java:85) (verificación en alta y edición), [`EmpleadoFormDrawer.tsx:190`](./room911-frontend/src/pages/EmpleadoFormDrawer.tsx:190) (mensaje del servidor), [`EmpleadoServiceImpl.java:125`](./backend_911/backend/src/main/java/com/room911/service/impl/EmpleadoServiceImpl.java:125) (duplicados en importación) y [`GlobalExceptionHandler.java:65`](./backend_911/backend/src/main/java/com/room911/exception/GlobalExceptionHandler.java:65) (mapeo de errores). |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | que exista un empleado con un documento registrado |  |  |  |  |
|  |  |  | **Cuando:** |  | se intente registrar otro empleado con el mismo documento |  |  |  |  |
|  |  |  | **Entonces:** |  | el servidor rechazará el alta con un mensaje que identifique el documento duplicado y no se creará ningún registro. |  |  |  |  |
| **Condición 02** |  |  | **Dado:** |  | que exista un empleado con un correo registrado |  |  |  |  |
|  |  |  | **Cuando:** |  | se intente registrar otro empleado con el mismo correo |  |  |  |  |
|  |  |  | **Entonces:** |  | el servidor rechazará el alta indicando el correo duplicado. |  |  |  |  |
| **Condición 03** |  |  | **Dado:** |  | que la persona edite un empleado cambiando su documento o correo por el de otro empleado |  |  |  |  |
|  |  |  | **Cuando:** |  | se guarde la ficha |  |  |  |  |
|  |  |  | **Entonces:** |  | la actualización será rechazada y el empleado conservará sus datos originales. |  |  |  |  |
| **Condición 04** |  |  | **Dado:** |  | que la persona reenvíe la ficha sin cambiar documento ni correo |  |  |  |  |
|  |  |  | **Cuando:** |  | el servidor valide la unicidad |  |  |  |  |
|  |  |  | **Entonces:** |  | el propio registro no se considerará duplicado de sí mismo y la actualización procederá si los demás datos son válidos. |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | que la carga masiva contenga una fila con documento o correo ya registrados |  |  |  |  |
|  |  |  | **Cuando:** |  | se procese el archivo |  |  |  |  |
|  |  |  | **Entonces:** |  | la fila se omitirá sin crear un segundo empleado y se contará como duplicada. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que dos filas del mismo archivo repitan documento o correo |  |  |  |  |
|  |  |  | **Cuando:** |  | se procese la importación |  |  |  |  |
|  |  |  | **Entonces:** |  | como máximo se creará un empleado y las filas repetidas se contarán como duplicadas. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que la importación termine |  |  |  |  |
|  |  |  | **Cuando:** |  | se revise el resultado mostrado |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema deberá informar cuántas filas se importaron y cuántas se omitieron por duplicidad; hoy la respuesta es un texto fijo sin detalle y la tarea queda pendiente. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | que el formulario detecte un rechazo por duplicidad |  |  |  |  |
|  |  |  | **Cuando:** |  | se muestre el error |  |  |  |  |
|  |  |  | **Entonces:** |  | el mensaje identificará el campo conflictivo, se mostrará sin borrar los datos diligenciados y no expondrá trazas técnicas. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | que se rechace un alta o una edición por duplicidad |  |  |  |  |
|  |  |  | **Cuando:** |  | se revise la auditoría |  |  |  |  |
|  |  |  | **Entonces:** |  | el intento deberá quedar registrado con actor, fecha, hora y motivo; hoy no hay registro automático y la brecha queda pendiente de HU-020. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | que un empleado sea deshabilitado (borrado lógico) |  |  |  |  |
|  |  |  | **Cuando:** |  | se intente registrar un nuevo empleado con su documento o correo |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema definirá y aplicará una regla explícita sobre la reutilización de datos de registros inactivos, evitando tanto el bloqueo injustificado como la ambigüedad de dos registros con el mismo documento. |  |  |  |  |
| **Condición 11** |  |  | **Dado:** |  | que el servidor no esté disponible al validar el alta |  |  |  |  |
|  |  |  | **Cuando:** |  | la petición falle |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará el error sin informar éxito y sin asumir que el registro es o no duplicado. |  |  |  |  |
| **Condición 12** |  |  | **Dado:** |  | que la persona navegue con teclado o lector de pantalla |  |  |  |  |
|  |  |  | **Cuando:** |  | se presente el error de duplicidad |  |  |  |  |
|  |  |  | **Entonces:** |  | el mensaje será anunciado junto al campo o acción correspondiente con texto comprensible. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Verificar que las restricciones únicas de documento y correo estén vigentes en la base de datos y en la entidad. |  |  |  |  |  |  |
| 2 |  |  | Confirmar la verificación de unicidad en el alta y en la edición, excluyendo el propio registro de la comparación. |  |  |  |  |  |  |
| 3 |  |  | Unificar la respuesta de duplicados de empleado en 409 con mensaje comprensible, igual que en administradores. |  |  |  |  |  |  |
| 4 |  |  | Agregar al formulario una prevalidación de duplicados contra los datos cargados, sin reemplazar la validación del servidor. |  |  |  |  |  |  |
| 5 |  |  | Devolver desde la importación un resultado con importados, omitidos y motivos por fila, en lugar del texto fijo actual. |  |  |  |  |  |  |
| 6 |  |  | Definir la política de reutilización de documento y correo de empleados inactivos y aplicarla en alta, edición e importación. |  |  |  |  |  |  |
| 7 |  |  | Mostrar en la interfaz el campo conflictivo de cada rechazo, conservando los datos diligenciados. |  |  |  |  |  |  |
| 8 |  |  | Registrar en auditoría los intentos rechazados por duplicidad con actor y motivo (ligada a HU-020). |  |  |  |  |  |  |
| 9 |  |  | Proteger la unicidad también ante solicitudes concurrentes, no solo ante la verificación previa en memoria. |  |  |  |  |  |  |
| 10 |  |  | Verificar que la importación masiva no cree registros incompletos al omitir duplicados. |  |  |  |  |  |  |
| 11 |  |  | Cubrir accesibilidad de los mensajes de duplicidad y su anuncio por lectores de pantalla. |  |  |  |  |  |  |
| 12 |  |  | Ejecutar pruebas de duplicados en alta, edición, importación, filas repetidas dentro del archivo, registros inactivos y concurrencia. |  |  |  |  |  |  |
| **REGLAS DE NEGOCIO Y CALIDAD** |  |  |  |  |  |  |  |  |  |
|  |  |  |  | El documento y el correo identifican a la persona y deben ser únicos entre los empleados activos. La validación del cliente es una ayuda y el servidor es la autoridad final. Ningún rechazo por duplicidad puede mostrarse como éxito, y la carga masiva nunca creará un segundo registro con el mismo documento o correo. |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 01-09-2026 |  |  | Revisión de HU-014 contra la implementación real; ampliación de alcance, estado, evidencias, criterios, brechas, reglas y tareas verificables. |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-015 |  | **Nombre:** |  | Exportar listado de empleados |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-012 y HU-013 |  |  |  |  |  |  |
| **Módulo:** |  |  | Gestión de empleados |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Exportar el listado de empleados del sistema |  |  |  |  |
|  |  |  | **Para** |  | Generar reportes externos y compartir información de manera organizada |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá ofrecer en el directorio de empleados una acción de exportación que genere un archivo con el listado — respetando los filtros aplicados — en al menos un formato de intercambio (CSV), con codificación UTF-8, cabecera de columnas y descarga directa, informando el resultado de la operación. |  |  |  |  |  |  |
| **Alcance:** |  |  | Incluye la acción de exportación del directorio completo o filtrado, la generación del archivo, la descarga y los mensajes de resultado. La definición de formatos adicionales (PDF, Excel) queda sujeta a aprobación del alcance del producto. No incluye el informe PDF individual por empleado, que ya existe en el detalle. |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **No cubierta.** El directorio de empleados no ofrece ninguna exportación del listado: sus únicas acciones son carga masiva, nuevo empleado y refrescar. Lo único exportable hoy es el código QR individual por fila y el informe PDF de intentos de acceso de un empleado en su pantalla de detalle, que no sustituyen al listado general. Los criterios de esta historia definen el comportamiento esperado y quedan pendientes hasta implementar la función. |  |  |  |  |  |  |
| **Precondiciones:** |  |  | La persona debe tener una sesión válida y el rol SUPER_ADMIN o ADMIN_ACCESOS; debe existir al menos un empleado activo para que la exportación tenga contenido. |  |  |  |  |  |  |
| **Flujo principal (esperado):** |  |  | 1. La persona abre el directorio de empleados y aplica los filtros deseados. 2. Selecciona la acción **Exportar**. 3. El sistema genera el archivo con las columnas acordadas y los registros visibles según el filtro. 4. El sistema entrega el archivo para descarga y confirma la operación. 5. La operación queda registrada para su trazabilidad. |  |  |  |  |  |  |
| **Evidencia:** |  |  | E-14 [`Empleados.tsx:171`](./room911-frontend/src/pages/Empleados.tsx:171) a [`Empleados.tsx:197`](./room911-frontend/src/pages/Empleados.tsx:197) (acciones del encabezado sin exportación), [`Empleados.tsx:310`](./room911-frontend/src/pages/Empleados.tsx:310) (única exportación existente: QR individual), [`EmpleadoDetalle.tsx:83`](./room911-frontend/src/pages/EmpleadoDetalle.tsx:83) y [`accesoService.ts:16`](./room911-frontend/src/services/accesoService.ts:16) (informe PDF por empleado, no del listado). |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | que existan empleados registrados |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona seleccione **Exportar** |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema generará y descargará un archivo con el listado; hoy la acción no existe y el criterio queda pendiente de implementación. |  |  |  |  |
| **Condición 02** |  |  | **Dado:** |  | que la persona haya aplicado búsqueda o filtros de departamento y estado |  |  |  |  |
|  |  |  | **Cuando:** |  | ejecute la exportación |  |  |  |  |
|  |  |  | **Entonces:** |  | el archivo contendrá únicamente los registros visibles según el filtro vigente. |  |  |  |  |
| **Condición 03** |  |  | **Dado:** |  | que se exporte en formato CSV |  |  |  |  |
|  |  |  | **Cuando:** |  | se abra el archivo |  |  |  |  |
|  |  |  | **Entonces:** |  | el archivo estará codificado en UTF-8, separado por comas y con cabecera de columnas idéntica a la acordada para la importación. |  |  |  |  |
| **Condición 04** |  |  | **Dado:** |  | que la exportación se ejecute |  |  |  |  |
|  |  |  | **Cuando:** |  | se revise el contenido |  |  |  |  |
|  |  |  | **Entonces:** |  | el archivo incluirá los datos acordados de cada empleado (documento, nombres, apellidos, correo, cargo, departamento y estado de acceso) sin información sensible adicional. |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | que el directorio no tenga empleados o el filtro no arroje coincidencias |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona intente exportar |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema indicará que no hay registros para exportar y no descargará un archivo vacío sin aviso. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que la exportación finalice |  |  |  |  |
|  |  |  | **Cuando:** |  | se revise la interfaz |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema confirmará el resultado indicando la cantidad de registros exportados. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que la persona carezca del rol requerido |  |  |  |  |
|  |  |  | **Cuando:** |  | intente exportar |  |  |  |  |
|  |  |  | **Entonces:** |  | no verá la acción y el servidor responderá 403 ante un intento directo. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | que el servidor falle durante la generación |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona confirme la exportación |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará el error, no informará éxito y no descargará un archivo parcial o corrupto. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | que la exportación sea un proceso largo |  |  |  |  |
|  |  |  | **Cuando:** |  | la operación esté en curso |  |  |  |  |
|  |  |  | **Entonces:** |  | la acción mostrará un estado de progreso o de espera y evitará solicitudes duplicadas. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | que se ejecute una exportación |  |  |  |  |
|  |  |  | **Cuando:** |  | se consulte la auditoría |  |  |  |  |
|  |  |  | **Entonces:** |  | la operación deberá quedar registrada con actor, fecha, hora y filtros aplicados; pendiente de la auditoría automática de HU-020. |  |  |  |  |
| **Condición 11** |  |  | **Dado:** |  | que la persona navegue con teclado o lector de pantalla |  |  |  |  |
|  |  |  | **Cuando:** |  | acceda a la acción de exportación |  |  |  |  |
|  |  |  | **Entonces:** |  | la acción tendrá nombre accesible, será operable por teclado y anunciará el resultado. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Definir con negocio el formato o los formatos oficiales de exportación y las columnas incluidas. |  |  |  |  |  |  |
| 2 |  |  | Definir si la exportación respeta los filtros de la vista o es siempre el listado completo, y documentarlo en la HU. |  |  |  |  |  |  |
| 3 |  |  | Diseñar la acción de exportación en el encabezado del directorio con estado de progreso y resultado. |  |  |  |  |  |  |
| 4 |  |  | Implementar el endpoint de exportación protegido con autenticación y roles de gestión de personal. |  |  |  |  |  |  |
| 5 |  |  | Implementar la generación del archivo con codificación UTF-8, separador y cabecera acordados. |  |  |  |  |  |  |
| 6 |  |  | Aplicar los filtros vigentes al conjunto exportado y devolver la cantidad de registros incluidos. |  |  |  |  |  |  |
| 7 |  |  | Implementar la descarga desde el navegador con nombre de archivo reconocible y fecha. |  |  |  |  |  |  |
| 8 |  |  | Manejar el caso sin registros y el error del servidor sin descargar archivos vacíos ni corruptos. |  |  |  |  |  |  |
| 9 |  |  | Registrar la exportación en auditoría con actor, filtros y total de registros (ligada a HU-020). |  |  |  |  |  |  |
| 10 |  |  | Evitar la inclusión de datos sensibles no acordados (contraseñas, tokens o identificadores internos). |  |  |  |  |  |  |
| 11 |  |  | Cubrir accesibilidad de la acción y de los mensajes de resultado. |  |  |  |  |  |  |
| 12 |  |  | Ejecutar pruebas funcionales de exportación completa, filtrada, vacía, sin permisos y con falla del servidor. |  |  |  |  |  |  |
| **REGLAS DE NEGOCIO Y CALIDAD** |  |  |  |  |  |  |  |  |  |
|  |  |  |  | La exportación es una lectura del sistema y no debe alterar registros. Solo debe exponer los datos acordados con negocio, sin credenciales ni identificadores técnicos internos. La acción queda restringida a los roles de gestión de personal y su uso debe quedar trazado. No se informará éxito si el archivo no se generó por completo. |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 01-09-2026 |  |  | Revisión de HU-015 contra la implementación real; declarada no cubierta, con criterios esperados, evidencia de ausencia y tareas de implementación. |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-019 |  | **Nombre:** |  | Consultar estadísticas de accesos |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-010, HU-023 y HU-027 |  |  |  |  |  |  |
| **Módulo:** |  |  | Reportes (Dashboard) |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Visualizar estadísticas de los accesos registrados |  |  |  |  |
|  |  |  | **Para** |  | Analizar el comportamiento del ingreso al ROOM\_911 |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá mostrar, en el panel principal, estadísticas reales de los intentos de acceso: accesos concedidos y denegados del día, la evolución semanal con ambas series y la distribución por departamento, calculadas por el servidor a partir de los intentos registrados y presentadas en gráficos e indicadores comprensibles. |  |  |  |  |  |  |
| **Alcance:** |  |  | Incluye las cuatro consultas del panel (resumen, accesos de la semana, departamentos y últimos accesos), los gráficos de área y de distribución y los indicadores del día. No incluye el filtro por rango de fechas personalizado, la exportación de reportes ni la lectura de intentos individuales, que corresponde al historial (HU-026). Se relaciona con los indicadores generales de HU-027 en la misma pantalla. |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **Parcial.** Las estadísticas son reales: el panel consulta los cuatro endpoints de `/api/dashboard`, el resumen trae accesos del día y denegados del día, la semana agrupa concedidos y denegados por día y la distribución por departamento cuenta el personal activo; los gráficos se renderizan con esos datos. Brechas: no existe filtro de rango de fechas en la interfaz; la serie semanal solo incluye los días con datos (no se rellenan días vacíos); el porcentaje de aforo mostrado es un valor fijo y la tasa de efectividad usa un valor de respaldo cuando no hay accesos; el contador de fallas de sensor está forzado a cero; los intentos sembrados por el inicializador de datos pueden contaminar las estadísticas; si falla la carga, el panel permanece en carga sin mensaje de error. |  |  |  |  |  |  |
| **Precondiciones:** |  |  | La persona debe tener una sesión válida; los intentos de acceso deben estar registrados por la validación del punto de acceso (HU-026) para que las estadísticas reflejen la operación real. |  |  |  |  |  |  |
| **Flujo principal:** |  |  | 1. La persona autenticada abre el panel principal. 2. El sistema consulta en paralelo los cuatro endpoints del dashboard. 3. El sistema muestra los indicadores del día, el gráfico semanal de concedidos y denegados, la distribución por departamento y los últimos accesos. 4. La persona actualiza la vista para refrescar los datos con el último estado del servidor. |  |  |  |  |  |  |
| **Evidencia:** |  |  | E-18 [`dashboardService.ts:54`](./room911-frontend/src/services/dashboardService.ts:54) (cuatro consultas), [`Dashboard.tsx:272`](./room911-frontend/src/pages/Dashboard.tsx:272) (gráfico semanal), [`Dashboard.tsx:250`](./room911-frontend/src/pages/Dashboard.tsx:250) (aforo con valor fijo), [`Dashboard.tsx:72`](./room911-frontend/src/pages/Dashboard.tsx:72) (tasa con respaldo), [`DashboardController.java:22`](./backend_911/backend/src/main/java/com/room911/controller/DashboardController.java:22) (endpoints) y [`DataInitializer.java:131`](./backend_911/backend/src/main/java/com/room911/config/DataInitializer.java:131) (intentos sembrados). |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | que existan intentos de acceso registrados |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona autenticada abra el panel |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará la cantidad de accesos concedidos y denegados del día calculada por el servidor. |  |  |  |  |
| **Condición 02** |  |  | **Dado:** |  | que existan accesos en los últimos siete días |  |  |  |  |
|  |  |  | **Cuando:** |  | se visualice el gráfico semanal |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará dos series — concedidos y denegados — por día, con valores proporcionales a los datos reales. |  |  |  |  |
| **Condición 03** |  |  | **Dado:** |  | que existan varios departamentos con personal |  |  |  |  |
|  |  |  | **Cuando:** |  | se consulte la distribución por departamento |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará la cantidad de empleados activos por departamento calculada por el servidor. |  |  |  |  |
| **Condición 04** |  |  | **Dado:** |  | que la persona desee consultar un rango de fechas distinto del día o de la semana en curso |  |  |  |  |
|  |  |  | **Cuando:** |  | busque el filtro correspondiente |  |  |  |  |
|  |  |  | **Entonces:** |  | hoy no existe filtro de rango de fechas y la capacidad queda pendiente de decisión e implementación. |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | que no existan accesos registrados en el día o en la semana |  |  |  |  |
|  |  |  | **Cuando:** |  | se muestren los indicadores |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema deberá presentar los valores en cero o un estado vacío claro, sin porcentajes de respaldo que simulen actividad; hoy la tasa usa un valor fijo de respaldo y el criterio queda pendiente. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que la persona actualice el panel |  |  |  |  |
|  |  |  | **Cuando:** |  | se recarguen los datos |  |  |  |  |
|  |  |  | **Entonces:** |  | los indicadores reflejarán el estado más reciente del servidor, sin datos retenidos obsoletos. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que un endpoint del panel falle o el servidor no esté disponible |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona abra el panel |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema deberá mostrar un mensaje de error y los indicadores disponibles, sin quedarse en carga indefinida ni mostrar datos de demostración; hoy falla en silencio y el criterio queda pendiente. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | que la base no tenga datos sembrados de prueba |  |  |  |  |
|  |  |  | **Cuando:** |  | se calculen las estadísticas |  |  |  |  |
|  |  |  | **Entonces:** |  | los valores corresponderán únicamente a intentos reales; la siembra de intentos de demostración en el arranque debe evaluarse como brecha. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | que la persona consulte los últimos accesos |  |  |  |  |
|  |  |  | **Cuando:** |  | se muestre la tabla |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema listará los intentos más recientes con empleado, resultado y mensaje, con estado vacío si no existen. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | que la persona navegue con teclado o lector de pantalla |  |  |  |  |
|  |  |  | **Cuando:** |  | recorra los indicadores y gráficos |  |  |  |  |
|  |  |  | **Entonces:** |  | cada gráfico deberá tener un texto alternativo o resumen de datos comprensible y los indicadores serán legibles con contraste adecuado. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Mantener las cuatro consultas del panel contra los endpoints reales de `/api/dashboard` con mapeo estricto del contrato. |  |  |  |  |  |  |
| 2 |  |  | Verificar los cálculos del resumen: empleados activos, con permiso, accesos del día, denegados del día y personal en planta. |  |  |  |  |  |  |
| 3 |  |  | Corregir la serie semanal para incluir los días sin datos con valor cero. |  |  |  |  |  |  |
| 4 |  |  | Sustituir el porcentaje fijo de aforo por un cálculo real o retirarlo hasta existir aforo por departamento. |  |  |  |  |  |  |
| 5 |  |  | Eliminar el valor de respaldo de la tasa de efectividad y mostrar cero o estado vacío cuando no haya accesos. |  |  |  |  |  |  |
| 6 |  |  | Conectar el indicador de fallas de sensor a una fuente real o retirarlo hasta existir telemetría. |  |  |  |  |  |  |
| 7 |  |  | Agregar mensajes de error y estados vacíos a la carga del panel, sin carga indefinida. |  |  |  |  |  |  |
| 8 |  |  | Evaluar con negocio la siembra de datos de demostración en el arranque y su separación de los datos reales. |  |  |  |  |  |  |
| 9 |  |  | Definir con negocio si se requiere el filtro de rango de fechas y documentarlo como alcance aprobado o retirado. |  |  |  |  |  |  |
| 10 |  |  | Verificar la coherencia entre las estadísticas y los intentos registrados en el historial (HU-026). |  |  |  |  |  |  |
| 11 |  |  | Cubrir accesibilidad de indicadores y gráficos: textos alternativos, contraste y navegación por teclado. |  |  |  |  |  |  |
| 12 |  |  | Ejecutar pruebas con datos reales y vacíos, fallas parciales de endpoints, actualización y coherencia con el historial. |  |  |  |  |  |  |
| **REGLAS DE NEGOCIO Y CALIDAD** |  |  |  |  |  |  |  |  |  |
|  |  |  |  | Las estadísticas deben calcularse en el servidor a partir de los intentos reales registrados. Ningún indicador puede mostrar valores de respaldo, datos de demostración ni porcentajes fijos que simulen actividad. Un endpoint fallido debe degradar la vista con un mensaje claro y no con cifras falsas. Los datos personales mostrados se limitan a lo necesario para la lectura operativa. |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 01-09-2026 |  |  | Revisión de HU-019 contra la implementación real; ampliación de alcance, estado, evidencias, criterios, brechas, reglas y tareas verificables. |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-20 |  | **Nombre:** |  | Registrar auditoría de acciones administrativas |  |  |  |  |
| **Complejidad:** |  |  | Alta |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | Todas las historias administrativas vigentes |  |  |  |  |  |  |
| **Módulo:** |  |  | Auditoría |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador responsable del sistema |  |  |  |  |
|  |  |  | **Requiero** |  | Registrar todas las acciones realizadas por los administradores |  |  |  |  |
|  |  |  | **Para** |  | Llevar un control de los cambios efectuados en el sistema |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá registrar en el servidor, de forma automática y sin depender del cliente, las operaciones administrativas relevantes — autenticaciones exitosas y fallidas, creación, edición, eliminación o cambio de estado de administradores, empleados y departamentos, autorizaciones de acceso, importaciones y exportaciones — con actor, fecha, hora, acción, descripción y resultado, y deberá permitir su consulta ordenada cronológicamente. |  |  |  |  |  |  |
| **Alcance:** |  |  | Incluye el modelo de auditoría, su persistencia, la generación automática de los eventos desde el backend y su consulta. No incluye el detalle de cada operación de negocio, que se verifica en su propia historia. La consulta de auditoría no tiene pantalla dedicada hoy; el histórico visible de accesos corresponde a HU-026. |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **Parcial (solo backend y registro manual).** Existe la entidad de auditoría con administrador, acción, descripción y fecha, y existen los endpoints para guardar y consultar por API. Brecha crítica: ningún flujo del backend escribe auditoría automáticamente — no se registran logins, intentos fallidos, ni operaciones CRUD de empleados, departamentos o administradores —; la única escritura posible es una llamada manual al endpoint de registro, que además exige que el cliente envíe el identificador del administrador, algo no confiable para un registro de auditoría. Tampoco existe una pantalla de consulta de auditoría. Los criterios y tareas reflejan el estado real y las brechas. |  |  |  |  |  |  |
| **Precondiciones:** |  |  | La persona debe estar autenticada para consultar la auditoría; la escritura de eventos debe residir en el servidor para ser confiable. |  |  |  |  |  |  |
| **Flujo principal (esperado):** |  |  | 1. Un administrador ejecuta una operación administrativa (crear, editar, eliminar, autorizar, importar, iniciar o cerrar sesión). 2. El servidor registra el evento con actor, fecha, hora, acción y resultado. 3. Un administrador autorizado consulta la auditoría ordenada cronológicamente. 4. La consulta permite revisar la secuencia de acciones sin exponer credenciales ni material sensible. |  |  |  |  |  |  |
| **Evidencia:** |  |  | E-19 [`Auditoria.java:17`](./backend_911/backend/src/main/java/com/room911/entity/Auditoria.java:17) (entidad), [`AuditoriaController.java:20`](./backend_911/backend/src/main/java/com/room911/controller/AuditoriaController.java:20) (endpoints de registro y consulta), [`AuditoriaServiceImpl.java:25`](./backend_911/backend/src/main/java/com/room911/service/impl/AuditoriaServiceImpl.java:25) (guardado con fecha del servidor) y la ausencia de llamadas a auditoría en [`EmpleadoServiceImpl.java`](./backend_911/backend/src/main/java/com/room911/service/impl/EmpleadoServiceImpl.java), [`AccessServiceImpl.java`](./backend_911/backend/src/main/java/com/room911/service/impl/AccessServiceImpl.java) y [`AuthServiceImpl.java`](./backend_911/backend/src/main/java/com/room911/service/impl/AuthServiceImpl.java) (brecha principal). |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | que un administrador inicie sesión de forma exitosa |  |  |  |  |
|  |  |  | **Cuando:** |  | se valide la autenticación en el servidor |  |  |  |  |
|  |  |  | **Entonces:** |  | el evento deberá registrarse con actor, fecha y hora; hoy no se registra y el criterio queda pendiente de implementación. |  |  |  |  |
| **Condición 02** |  |  | **Dado:** |  | que ocurra un intento fallido de autenticación |  |  |  |  |
|  |  |  | **Cuando:** |  | el servidor rechace las credenciales |  |  |  |  |
|  |  |  | **Entonces:** |  | el intento fallido deberá registrarse con fecha y hora, sin almacenar contraseñas; hoy no se registra y queda pendiente. |  |  |  |  |
| **Condición 03** |  |  | **Dado:** |  | que un administrador registre, edite o elimine información de administradores, empleados o departamentos |  |  |  |  |
|  |  |  | **Cuando:** |  | la operación se complete o sea rechazada |  |  |  |  |
|  |  |  | **Entonces:** |  | el servidor deberá almacenar la acción con usuario, fecha, hora, tipo de operación y resultado; hoy la escritura automática no existe y queda pendiente. |  |  |  |  |
| **Condición 04** |  |  | **Dado:** |  | que el registro se realice |  |  |  |  |
|  |  |  | **Cuando:** |  | se revise el evento |  |  |  |  |
|  |  |  | **Entonces:** |  | la fecha y hora provendrán del servidor y el actor de la sesión autenticada, no de datos enviados por el cliente; hoy el cliente envía el identificador del administrador y el criterio queda pendiente. |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | que un administrador autorizado consulte la auditoría |  |  |  |  |
|  |  |  | **Cuando:** |  | acceda a la consulta |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará el historial de acciones ordenado cronológicamente; hoy la consulta existe por API y la pantalla de consulta queda pendiente. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que la persona no esté autenticada |  |  |  |  |
|  |  |  | **Cuando:** |  | intente consultar la auditoría |  |  |  |  |
|  |  |  | **Entonces:** |  | el servidor responderá 401; hoy la consulta exige autenticación y está vigente. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que se consulte la auditoría por administrador |  |  |  |  |
|  |  |  | **Cuando:** |  | se solicite el historial de un administrador específico |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema devolverá únicamente sus eventos; hoy el endpoint existe y se mantiene. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | que no existan eventos registrados |  |  |  |  |
|  |  |  | **Cuando:** |  | se consulte la auditoría |  |  |  |  |
|  |  |  | **Entonces:** |  | la consulta devolverá una lista vacía y la interfaz de consulta deberá mostrar un estado vacío claro. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | que se registre o consulte un evento |  |  |  |  |
|  |  |  | **Cuando:** |  | se revise el contenido almacenado |  |  |  |  |
|  |  |  | **Entonces:** |  | no se almacenarán contraseñas, tokens ni datos sensibles en la descripción del evento. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | que se intente alterar o eliminar un evento de auditoría |  |  |  |  |
|  |  |  | **Cuando:** |  | se revise el modelo |  |  |  |  |
|  |  |  | **Entonces:** |  | la auditoría deberá ser de solo apéndice: el sistema no deberá exponer edición ni eliminación de eventos; hoy no existe modificación por API y la regla se mantiene. |  |  |  |  |
| **Condición 11** |  |  | **Dado:** |  | que la consulta falle por indisponibilidad |  |  |  |  |
|  |  |  | **Cuando:** |  | se solicite el historial |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema responderá con el error del servidor sin ocultar la falla ni sustituir el historial por datos de demostración. |  |  |  |  |
| **Condición 12** |  |  | **Dado:** |  | que se implemente la pantalla de consulta |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona navegue con teclado o lector de pantalla |  |  |  |  |
|  |  |  | **Entonces:** |  | la tabla de eventos tendrá encabezados legibles, paginación y estados anunciados de forma accesible. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Verificar la entidad y la tabla de auditoría con sus campos de administrador, acción, descripción y fecha. |  |  |  |  |  |  |
| 2 |  |  | Implementar la escritura automática de auditoría desde los servicios del backend, comenzando por autenticación exitosa y fallida. |  |  |  |  |  |  |
| 3 |  |  | Extender el registro automático a las operaciones CRUD de administradores, empleados y departamentos. |  |  |  |  |  |  |
| 4 |  |  | Derivar el actor del evento del token de sesión autenticada y eliminar la dependencia del identificador enviado por el cliente. |  |  |  |  |  |  |
| 5 |  |  | Definir el catálogo de acciones y resultados con texto comprensible para negocio. |  |  |  |  |  |  |
| 6 |  |  | Garantizar que la auditoría sea de solo apéndice, sin endpoints de edición o eliminación. |  |  |  |  |  |  |
| 7 |  |  | Prohibir el almacenamiento de contraseñas, tokens o datos sensibles en la descripción de eventos. |  |  |  |  |  |  |
| 8 |  |  | Definir y restringir los roles autorizados para consultar la auditoría. |  |  |  |  |  |  |
| 9 |  |  | Diseñar e implementar la pantalla de consulta de auditoría con filtros por administrador y fecha, paginación y estado vacío. |  |  |  |  |  |  |
| 10 |  |  | Comprobar que los eventos queden registrados aunque la operación de negocio falle parcialmente. |  |  |  |  |  |  |
| 11 |  |  | Cubrir accesibilidad de la consulta: encabezados, contraste, foco y anuncios. |  |  |  |  |  |  |
| 12 |  |  | Ejecutar pruebas de registro automático por tipo de evento, consulta por administrador, permisos, estados vacíos y fallas del servidor. |  |  |  |  |  |  |
| **REGLAS DE NEGOCIO Y CALIDAD** |  |  |  |  |  |  |  |  |  |
|  |  |  |  | La auditoría es evidencia: debe escribirse en el servidor de forma automática, con actor derivado de la sesión y fecha del servidor, y no debe poder editarse ni eliminarse. Ningún evento almacena contraseñas, tokens ni datos sensibles. Mientras el registro automático no exista, ninguna historia administrativa puede declararse completa en sus criterios de auditoría, que quedan marcados como pendientes. |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 01-09-2026 |  |  | Revisión de HU-20 contra la implementación real; documentada la brecha crítica de registro automático, con alcance, evidencias, criterios y tareas verificables. |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-21 |  | **Nombre:** |  | Cambiar el tema visual de la interfaz (claro/oscuro) |  |  |  |  |
| **Complejidad:** |  |  | Baja |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-001 |  |  |  |  |  |  |
| **Módulo:** |  |  | Preferencias de interfaz |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador del sistema Room\_911 |  |  |  |  |
|  |  |  | **Requiero** |  | Cambiar entre el tema claro y el tema oscuro de la interfaz |  |  |  |  |
|  |  |  | **Para** |  | Ajustar la apariencia a mi comodidad visual, al entorno de iluminación y a las necesidades de accesibilidad |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá ofrecer un control de tema con las opciones Claro y Oscuro, aplicar la selección a toda la interfaz mediante variables de estilo, recordar la preferencia en el navegador para las visitas siguientes y mantener la legibilidad y el contraste en ambos temas. |  |  |  |  |  |  |
| **Alcance:** |  |  | Incluye el control de selección de tema, la aplicación global mediante la clase de tema en el documento, la persistencia local de la preferencia y el mantenimiento del contraste. No incluye la configuración general de parámetros del sistema, que no existe en la aplicación, ni las preferencias de tamaño de fuente y alto contraste del modal de accesibilidad, que usan un mecanismo propio. |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **Parcial.** El control existe y funciona: un contexto de tema con las opciones claro y oscuro aplica la clase `dark` sobre el documento y guarda la preferencia en el navegador; las variables de estilo definen ambas paletas y el control marca la opción activa con `aria-pressed`. Brechas: el control solo está disponible en el encabezado del directorio de empleados y no en el resto de las pantallas; coexisten dos mecanismos que manipulan el mismo tema — este control y el modal de accesibilidad, con llaves de almacenamiento distintas — por lo que pueden entrar en conflicto; algunas áreas combinan colores fijos con las variables de tema, lo que puede verse inconsistente en modo oscuro. |  |  |  |  |  |  |
| **Precondiciones:** |  |  | Ninguna especial: el tema se aplica sin depender de sesión ni del backend; basta con que el control esté disponible en la pantalla. |  |  |  |  |  |  |
| **Flujo principal:** |  |  | 1. La persona abre una pantalla con el control de tema visible. 2. Selecciona Claro u Oscuro. 3. El sistema aplica la paleta correspondiente a la interfaz de forma inmediata, sin recargar. 4. La preferencia queda guardada y se restaura en la siguiente visita. |  |  |  |  |  |  |
| **Evidencia:** |  |  | E-20 [`ThemeContext.tsx:12`](./room911-frontend/src/context/ThemeContext.tsx:12) (tema inicial y preferencia guardada), [`ThemeContext.tsx:23`](./room911-frontend/src/context/ThemeContext.tsx:23) (aplicación de la clase `dark`), [`ThemeToggle.tsx:12`](./room911-frontend/src/components/common/ThemeToggle.tsx:12) (control con `aria-pressed`), [`App.tsx:6`](./room911-frontend/src/App.tsx:6) (proveedor global), [`index.css:47`](./room911-frontend/src/styles/index.css:47) (paleta oscura), [`Empleados.tsx:170`](./room911-frontend/src/pages/Empleados.tsx:170) (única ubicación actual del control) y [`AccessibilityModal.tsx:36`](./room911-frontend/src/components/common/AccessibilityModal.tsx:36) (mecanismo paralelo del modal de accesibilidad). |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | que la persona esté en una pantalla con el control de tema visible |  |  |  |  |
|  |  |  | **Cuando:** |  | seleccione Oscuro |  |  |  |  |
|  |  |  | **Entonces:** |  | la interfaz aplicará la paleta oscura de forma inmediata, sin recargar la página. |  |  |  |  |
| **Condición 02** |  |  | **Dado:** |  | que el tema oscuro esté aplicado |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona seleccione Claro |  |  |  |  |
|  |  |  | **Entonces:** |  | la interfaz volverá a la paleta clara de forma inmediata. |  |  |  |  |
| **Condición 03** |  |  | **Dado:** |  | que la persona seleccione un tema |  |  |  |  |
|  |  |  | **Cuando:** |  | cierre y vuelva a abrir la aplicación en el mismo navegador |  |  |  |  |
|  |  |  | **Entonces:** |  | la preferencia se restaurará automáticamente; hoy la preferencia se guarda en el navegador y el criterio está vigente. |  |  |  |  |
| **Condición 04** |  |  | **Dado:** |  | que la persona use la aplicación por primera vez o sin preferencia guardada |  |  |  |  |
|  |  |  | **Cuando:** |  | cargue cualquier pantalla |  |  |  |  |
|  |  |  | **Entonces:** |  | el tema aplicado será el claro por defecto. |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | que el control de tema esté visible |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona lo recorra con teclado o lector de pantalla |  |  |  |  |
|  |  |  | **Entonces:** |  | el grupo tendrá nombre accesible y cada opción indicará si está activa (`aria-pressed`); hoy el control ya cumple y el criterio está vigente. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que la persona cambie de pantalla tras aplicar un tema |  |  |  |  |
|  |  |  | **Cuando:** |  | navegue por la aplicación |  |  |  |  |
|  |  |  | **Entonces:** |  | la paleta deberá mantenerse en todas las vistas; hoy el control solo existe en el directorio de empleados y la disponibilidad global queda pendiente. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que el modal de accesibilidad configure su propio tema o alto contraste |  |  |  |  |
|  |  |  | **Cuando:** |  | se usen ambos mecanismos en la misma sesión |  |  |  |  |
|  |  |  | **Entonces:** |  | el resultado deberá ser coherente y predecible; hoy coexisten dos mecanismos con almacenamiento distinto y su unificación queda pendiente. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | que el tema oscuro esté activo |  |  |  |  |
|  |  |  | **Cuando:** |  | se muestren tablas, formularios, gráficos, diálogos y estados vacíos |  |  |  |  |
|  |  |  | **Entonces:** |  | los textos conservarán contraste suficiente y no habrá elementos ilegibles; hoy existen estilos fijos combinados con variables de tema que deben revisarse. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | que el almacenamiento del navegador no esté disponible |  |  |  |  |
|  |  |  | **Cuando:** |  | la aplicación cargue |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema aplicará el tema claro por defecto sin fallar; hoy el contexto controla la excepción y el criterio está vigente. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | que la persona tenga formularios o listados en curso |  |  |  |  |
|  |  |  | **Cuando:** |  | cambie el tema |  |  |  |  |
|  |  |  | **Entonces:** |  | no se perderá ningún dato diligenciado ni estado de la pantalla. |  |  |  |  |
| **Condición 11** |  |  | **Dado:** |  | que el servidor no esté disponible |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona cambie el tema |  |  |  |  |
|  |  |  | **Entonces:** |  | el cambio seguirá funcionando porque es una preferencia local que no depende del backend. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Mantener el contexto de tema con las opciones claro y oscuro y el valor por defecto claro. |  |  |  |  |  |  |
| 2 |  |  | Mantener la aplicación inmediata de la clase de tema sobre el documento raíz. |  |  |  |  |  |  |
| 3 |  |  | Mantener la persistencia de la preferencia en el navegador con control de excepciones. |  |  |  |  |  |  |
| 4 |  |  | Mantener las variables de estilo de ambas paletas, incluida la variante de alto contraste. |  |  |  |  |  |  |
| 5 |  |  | Generalizar el control de tema para que esté disponible en todas las pantallas administrativas, no solo en el directorio de empleados. |  |  |  |  |  |  |
| 6 |  |  | Unificar el control de tema con las preferencias del modal de accesibilidad en una sola fuente de verdad para la apariencia. |  |  |  |  |  |  |
| 7 |  |  | Revisar los estilos fijos combinados con clases de tema y reemplazarlos por variables para asegurar coherencia en modo oscuro. |  |  |  |  |  |  |
| 8 |  |  | Verificar contraste y legibilidad de tablas, formularios, gráficos, insignias y estados vacíos en ambos temas. |  |  |  |  |  |  |
| 9 |  |  | Evitar parpadeos al cargar aplicando la preferencia guardada antes del primer render. |  |  |  |  |  |  |
| 10 |  |  | Cubrir accesibilidad del control: nombre accesible del grupo, estado activo por opción, foco visible y navegación por teclado. |  |  |  |  |  |  |
| 11 |  |  | Comprobar que el cambio de tema no altere datos diligenciados ni estados en curso. |  |  |  |  |  |  |
| 12 |  |  | Ejecutar pruebas de cambio, persistencia, primera visita, coherencia visual por pantalla y combinación con el modal de accesibilidad. |  |  |  |  |  |  |
| **REGLAS DE NEGOCIO Y CALIDAD** |  |  |  |  |  |  |  |  |  |
|  |  |  |  | El tema es una preferencia local de la persona y no un parámetro del sistema compartido: no requiere sesión ni escritura en el servidor. La aplicación es inmediata y sin pérdida de datos. Los dos mecanismos de apariencia (control de tema y modal de accesibilidad) deben converger en una sola configuración para evitar estados contradictorios. |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 01-09-2026 |  |  | Redefinición de HU-021 aprobada por el responsable de producto: la configuración general no existe y la única preferencia incorporada es el tema claro/oscuro, documentada con su implementación real. |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-22 |  | **Nombre:** |  | Generación de credencial digital |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-008, HU-009, HU-010 y HU-023 |  |  |  |  |  |  |
| **Módulo:** |  |  | Gestión de credenciales |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Generar una credencial digital con un código QR único para cada empleado |  |  |  |  |
|  |  |  | **Para** |  | Identificar al personal y facilitar la validación de acceso al laboratorio ROOM 911 |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá asociar a cada empleado registrado un identificador único de credencial presentado como código QR, permitir visualizar la credencial con la información del empleado y su estado real, y garantizar que el QR pueda validarse en el punto de acceso. La credencial deshabilitada no deberá presentarse como activa. |  |  |  |  |  |  |
| **Alcance:** |  |  | Incluye la vista móvil de credencial por código, el renderizado del QR, la consulta del empleado y el efecto del QR en la validación de acceso (HU-023). No incluye la impresión física ni la fotografía del empleado. Las rutas de credencial son públicas o mixtas según la implementación vigente, lo que se documenta como brecha. |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **Parcial con brechas críticas.** Existe la vista móvil de credencial en `/credencial/:codigoQr` (y `/activar-credencial/:codigoQr` que muestra la misma tarjeta), con QR renderizado en el navegador a partir del código y un reloj del sistema. Brechas: el backend no genera ni persiste un código QR por empleado — el QR real es el documento de identidad o el identificador del empleado —; la consulta del empleado usa un endpoint protegido, por lo que en un teléfono sin sesión falla y cae a un catálogo local fijo que muestra credenciales falsas “ACTIVAS” para cualquier código desconocido; la etiqueta de estado “ACTIVA” está fija y no refleja el estado real del empleado ni su permiso de acceso. |  |  |  |  |  |  |
| **Precondiciones:** |  |  | Debe existir el empleado registrado; para la consulta autenticada se requiere sesión válida. La consulta pública de credencial requiere resolver primero la brecha de seguridad documentada. |  |  |  |  |  |  |
| **Flujo principal:** |  |  | 1. El administrador abre la credencial de un empleado desde el directorio o el detalle. 2. El sistema consulta los datos del empleado. 3. El sistema muestra la tarjeta con nombre, identificador, cargo, departamento y el QR del código de la credencial. 4. La persona presenta el QR en el punto de acceso y la validación se realiza según HU-023. |  |  |  |  |  |  |
| **Evidencia:** |  |  | E-21 [`AppRoutes.tsx:51`](./room911-frontend/src/routes/AppRoutes.tsx:51) (rutas públicas de credencial), [`CredencialDigital.tsx:79`](./room911-frontend/src/pages/CredencialDigital.tsx:79) (consulta del empleado), [`CredencialDigital.tsx:8`](./room911-frontend/src/pages/CredencialDigital.tsx:8) y [`CredencialDigital.tsx:83`](./room911-frontend/src/pages/CredencialDigital.tsx:83) (catálogo local con credenciales falsas), [`CredencialDigital.tsx:158`](./room911-frontend/src/pages/CredencialDigital.tsx:158) (render del QR) y [`AccessServiceImpl.java:114`](./backend_911/backend/src/main/java/com/room911/service/impl/AccessServiceImpl.java:114) (el “código” se resuelve como documento o identificador). |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | que exista un empleado registrado |  |  |  |  |
|  |  |  | **Cuando:** |  | el administrador abra su credencial |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará la tarjeta con los datos del empleado y el código QR asociado. |  |  |  |  |
| **Condición 02** |  |  | **Dado:** |  | que el QR se genere para dos empleados distintos |  |  |  |  |
|  |  |  | **Cuando:** |  | se comparen los códigos |  |  |  |  |
|  |  |  | **Entonces:** |  | cada credencial corresponderá a un identificador único por empleado, sin colisiones. |  |  |  |  |
| **Condición 03** |  |  | **Dado:** |  | que la credencial se consulte desde un dispositivo sin sesión |  |  |  |  |
|  |  |  | **Cuando:** |  | el sistema no pueda obtener los datos del empleado |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema deberá informar que no fue posible verificar la credencial; hoy cae a un catálogo local y muestra credenciales falsas, brecha crítica pendiente de corrección. |  |  |  |  |
| **Condición 04** |  |  | **Dado:** |  | que el empleado esté deshabilitado o sin permiso de acceso |  |  |  |  |
|  |  |  | **Cuando:** |  | se consulte su credencial |  |  |  |  |
|  |  |  | **Entonces:** |  | el estado mostrado deberá reflejar la situación real; hoy la etiqueta “ACTIVA” está fija y el criterio queda pendiente. |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | que la credencial se presente en el punto de acceso |  |  |  |  |
|  |  |  | **Cuando:** |  | el servidor valide el código |  |  |  |  |
|  |  |  | **Entonces:** |  | la validación resolverá al empleado correcto (HU-023) y aplicará las reglas de existencia, cuenta activa y permiso. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que la persona edite los datos del empleado |  |  |  |  |
|  |  |  | **Cuando:** |  | vuelva a consultar la credencial |  |  |  |  |
|  |  |  | **Entonces:** |  | la credencial mostrará la información actualizada, sin datos retenidos. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que el código consultado no corresponda a ningún empleado |  |  |  |  |
|  |  |  | **Cuando:** |  | se abra la ruta de credencial |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará un mensaje de credencial no reconocida y nunca una credencial genérica con datos ficticios. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | que el servidor falle durante la consulta |  |  |  |  |
|  |  |  | **Cuando:** |  | se cargue la credencial |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará el error sin presentar una tarjeta con datos de demostración. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | que la credencial sea pública o mixta |  |  |  |  |
|  |  |  | **Cuando:** |  | se defina su política de acceso |  |  |  |  |
|  |  |  | **Entonces:** |  | el endpoint de consulta deberá exponer solo los datos necesarios para identificar la credencial y proteger el resto; hoy consulta un endpoint administrativo protegido, brecha pendiente. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | que la credencial se genere o consulte |  |  |  |  |
|  |  |  | **Cuando:** |  | se consulte la auditoría |  |  |  |  |
|  |  |  | **Entonces:** |  | los eventos relevantes deberán quedar registrados; hoy no hay registro automático (HU-020). |  |  |  |  |
| **Condición 11** |  |  | **Dado:** |  | que la persona abra la credencial en un móvil |  |  |  |  |
|  |  |  | **Cuando:** |  | se muestre la tarjeta |  |  |  |  |
|  |  |  | **Entonces:** |  | el QR será legible por el lector, la tarjeta se adaptará a la pantalla y los textos tendrán contraste adecuado. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Definir con negocio el modelo de la credencial: identificador único, vigencia, estado y datos expuestos. |  |  |  |  |  |  |
| 2 |  |  | Decidir si el identificador de credencial es el documento o un código QR persistido, e implementarlo en la entidad del empleado. |  |  |  |  |  |  |
| 3 |  |  | Eliminar el catálogo local fijo y el empleado genérico de la vista de credencial; ante código desconocido mostrar credencial no reconocida. |  |  |  |  |  |  |
| 4 |  |  | Resolver la política de acceso de la credencial: endpoint público con datos mínimos o consulta autenticada, sin mezclar ambos. |  |  |  |  |  |  |
| 5 |  |  | Conectar la etiqueta de estado de la credencial al estado real del empleado (activo y con permiso de acceso). |  |  |  |  |  |  |
| 6 |  |  | Verificar que el QR presentado resuelva correctamente en POST /api/acceso/qr. |  |  |  |  |  |  |
| 7 |  |  | Mostrar errores del servidor sin datos de demostración ni estados de carga indefinidos. |  |  |  |  |  |  |
| 8 |  |  | Definir qué muestra la credencial de un empleado deshabilitado y reflejarlo visualmente. |  |  |  |  |  |  |
| 9 |  |  | Registrar los eventos relevantes de credenciales en auditoría (ligada a HU-020). |  |  |  |  |  |  |
| 10 |  |  | Definir la diferencia funcional real entre `/credencial/:codigoQr` y `/activar-credencial/:codigoQr` o unificarlas. |  |  |  |  |  |  |
| 11 |  |  | Verificar la legibilidad del QR desde un lector real y el diseño responsivo de la tarjeta. |  |  |  |  |  |  |
| 12 |  |  | Ejecutar pruebas de credenciales válidas, desconocidas, deshabilitadas, sin sesión, con falla del servidor y validación en el punto de acceso. |  |  |  |  |  |  |
| **REGLAS DE NEGOCIO Y CALIDAD** |  |  |  |  |  |  |  |  |  |
|  |  |  |  | La credencial identifica a una persona y nunca debe mostrarse con datos ficticios ni estado fijo: cualquier presentación de credenciales falsas “ACTIVAS” es una brecha de seguridad prioritaria. El identificador de credencial es único por empleado. La política de acceso de la credencial debe definir qué datos se exponen sin sesión y proteger el resto. |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 01-09-2026 |  |  | Revisión de HU-22 contra la implementación real; documentadas las brechas críticas de credenciales falsas, estado fijo y QR no persistido. |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-23 |  | **Nombre:** |  | Validar acceso mediante código QR |  |  |  |  |
| **Complejidad:** |  |  | Alta |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-010, HU-022, HU-024 y HU-026 |  |  |  |  |  |  |
| **Módulo:** |  |  | Control de acceso |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Sistema de control de acceso |  |  |  |  |
|  |  |  | **Requiero** |  | Leer el código QR de la credencial del empleado |  |  |  |  |
|  |  |  | **Para** |  | Validar automáticamente si el empleado tiene autorización para ingresar al laboratorio |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá leer el código QR presentado por el empleado, enviarlo al servidor y decidir allí la autorización evaluando la existencia del empleado, el estado de su cuenta y su permiso de acceso; el resultado se entregará con los datos del empleado y el motivo, y todo intento quedará registrado. |  |  |  |  |  |  |
| **Alcance:** |  |  | Incluye la lectura del código (lector o entrada manual), los endpoints públicos de validación (documento y QR), la decisión del servidor, el registro del intento y la presentación del resultado (HU-024). Las reglas de horario, zonas y anti-passback existen hoy solo en el simulador del navegador y no forman parte de la decisión del servidor; su incorporación real es una brecha documentada. |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **Parcial.** El servidor sí decide: POST /api/acceso y POST /api/acceso/qr son públicos, resuelven el código (documento, identificador o URL de credencial), evalúan existencia, cuenta activa y permiso, responden con datos del empleado y motivo, y registran el intento automáticamente. Brechas: el simulador decide el resultado en el navegador antes de llamar al servidor y le envía la decisión ya tomada, además de aplicar en el cliente reglas de passback, horarios y zonas que el backend no conoce; el simulador usa un catálogo de contingencia cuando no puede cargar empleados; el endpoint QR está definido pero el simulador no lo utiliza. |  |  |  |  |  |  |
| **Precondiciones:** |  |  | El lector o la terminal debe poder alcanzar el backend; el empleado debe estar registrado para que la validación lo resuelva. Los endpoints de validación son públicos por diseño para los lectores. |  |  |  |  |  |  |
| **Flujo principal:** |  |  | 1. El empleado presenta su credencial con QR en el punto de acceso. 2. El lector envía el código al servidor. 3. El servidor resuelve el código al empleado correspondiente. 4. El servidor evalúa existencia, cuenta activa y permiso de acceso. 5. El servidor responde con el resultado, los datos del empleado y el motivo. 6. El punto de acceso muestra el resultado (HU-024) y el intento queda registrado (HU-026). |  |  |  |  |  |  |
| **Evidencia:** |  |  | E-22 [`AccesoController.java:21`](./backend_911/backend/src/main/java/com/room911/controller/AccesoController.java:21) (endpoints públicos), [`AccessServiceImpl.java:26`](./backend_911/backend/src/main/java/com/room911/service/impl/AccessServiceImpl.java:26) (decisión del servidor), [`AccessServiceImpl.java:144`](./backend_911/backend/src/main/java/com/room911/service/impl/AccessServiceImpl.java:144) (registro del intento), [`SecurityConfig.java:41`](./backend_911/backend/src/main/java/com/room911/config/SecurityConfig.java:41) (publicación de `/api/acceso/**`) y [`SimuladorAcceso.tsx:365`](./room911-frontend/src/pages/SimuladorAcceso.tsx:365) (decisión en el cliente, brecha). |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | que el empleado presente una credencial con código QR válido |  |  |  |  |
|  |  |  | **Cuando:** |  | el lector envíe el código al servidor |  |  |  |  |
|  |  |  | **Entonces:** |  | el servidor obtendrá los datos del empleado correspondiente sin intervención manual. |  |  |  |  |
| **Condición 02** |  |  | **Dado:** |  | que el empleado exista, esté activo y tenga permiso de acceso |  |  |  |  |
|  |  |  | **Cuando:** |  | el servidor valide el código |  |  |  |  |
|  |  |  | **Entonces:** |  | responderá que el acceso es concedido con los datos del empleado. |  |  |  |  |
| **Condición 03** |  |  | **Dado:** |  | que el empleado no exista, esté inactivo o no tenga permiso |  |  |  |  |
|  |  |  | **Cuando:** |  | el servidor valide el código |  |  |  |  |
|  |  |  | **Entonces:** |  | responderá denegado con el motivo correspondiente y registrará el intento. |  |  |  |  |
| **Condición 04** |  |  | **Dado:** |  | que el código presentado sea inválido o no corresponda a ningún empleado |  |  |  |  |
|  |  |  | **Cuando:** |  | el servidor lo valide |  |  |  |  |
|  |  |  | **Entonces:** |  | responderá denegado indicando que el empleado no está registrado y registrará el intento sin empleado asociado. |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | que la petición se envíe sin cuerpo válido o sin código |  |  |  |  |
|  |  |  | **Cuando:** |  | el servidor la procese |  |  |  |  |
|  |  |  | **Entonces:** |  | responderá con un error de validación claro sin exponer detalles internos. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que el servidor no esté disponible |  |  |  |  |
|  |  |  | **Cuando:** |  | el punto de acceso intente validar |  |  |  |  |
|  |  |  | **Entonces:** |  | el punto de acceso deberá mostrar el estado de falla de conexión y no informar un resultado de negocio; hoy el simulador oculta la falla y muestra su decisión local, brecha pendiente. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que la validación se complete con cualquier resultado |  |  |  |  |
|  |  |  | **Cuando:** |  | se consulte el historial de intentos |  |  |  |  |
|  |  |  | **Entonces:** |  | el intento aparecerá registrado con fecha, resultado y mensaje del servidor (HU-026). |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | que el simulador muestre un resultado |  |  |  |  |
|  |  |  | **Cuando:** |  | se compare con la respuesta del servidor |  |  |  |  |
|  |  |  | **Entonces:** |  | la decisión mostrada deberá provenir del servidor; hoy el simulador decide en el navegador y registra después, brecha documentada que impide declarar la historia completa. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | que el negocio requiera reglas de horario, zonas o anti-passback |  |  |  |  |
|  |  |  | **Cuando:** |  | el servidor valide el acceso |  |  |  |  |
|  |  |  | **Entonces:** |  | dichas reglas deberán ejecutarse en el servidor; hoy solo existen en el cliente y quedan como brecha pendiente de aprobación e implementación. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | que el lector o la terminal operen sin sesión administrativa |  |  |  |  |
|  |  |  | **Cuando:** |  | se use el endpoint de validación |  |  |  |  |
|  |  |  | **Entonces:** |  | la validación funcionará porque el endpoint es público por diseño, sin exponer ningún otro dato del sistema. |  |  |  |  |
| **Condición 11** |  |  | **Dado:** |  | que el punto de acceso muestre el resultado |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona lo lea |  |  |  |  |
|  |  |  | **Entonces:** |  | el resultado será comprensible e incluirá el motivo cuando el acceso sea denegado (HU-024). |  |  |  |  |
| **Condición 12** |  |  | **Dado:** |  | que la terminal se use con teclado o lector de pantalla |  |  |  |  |
|  |  |  | **Cuando:** |  | se presente el resultado |  |  |  |  |
|  |  |  | **Entonces:** |  | el estado y el motivo serán textuales con contraste adecuado y anunciados de forma accesible. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Mantener los endpoints públicos de validación por documento y por QR con la decisión exclusiva del servidor. |  |  |  |  |  |  |
| 2 |  |  | Verificar la resolución del código: documento, identificador y URL de credencial, con respuestas claras por caso. |  |  |  |  |  |  |
| 3 |  |  | Conectar el simulador al endpoint QR (`/api/acceso/qr`) y eliminar la decisión previa en el navegador. |  |  |  |  |  |  |
| 4 |  |  | Mostrar el resultado del servidor tal como llega, incluyendo el motivo de la denegación. |  |  |  |  |  |  |
| 5 |  |  | Hacer visible la falla de conexión en la terminal en lugar de ocultarla y mostrar la decisión local. |  |  |  |  |  |  |
| 6 |  |  | Sustituir el catálogo de contingencia del simulador por un estado de error explícito cuando no se puedan cargar los empleados. |  |  |  |  |  |  |
| 7 |  |  | Definir con negocio si las reglas de horario, zonas y anti-passback se migran al servidor y planificar su implementación. |  |  |  |  |  |  |
| 8 |  |  | Confirmar el registro automático del intento con fecha, resultado y mensaje en cada validación (HU-026). |  |  |  |  |  |  |
| 9 |  |  | Verificar que la validación no exponga información sensible del empleado más allá de lo necesario para el resultado. |  |  |  |  |  |  |
| 10 |  |  | Evaluar límites de tasa para el endpoint público y protegerlo contra abuso. |  |  |  |  |  |  |
| 11 |  |  | Cubrir accesibilidad de la terminal de validación: estados textuales, contraste y anuncios. |  |  |  |  |  |  |
| 12 |  |  | Ejecutar pruebas de validación concedida, denegada por cada motivo, código inválido, cuerpo inválido, servidor caído y registro del intento. |  |  |  |  |  |  |
| **REGLAS DE NEGOCIO Y CALIDAD** |  |  |  |  |  |  |  |  |  |
|  |  |  |  | La autorización de un ingreso la decide únicamente el servidor; ninguna decisión tomada en el navegador constituye control de acceso real. Los endpoints de validación son públicos por necesidad operativa de los lectores y deben exponer el mínimo de información. Todo intento — concedido o denegado — debe quedar registrado con el motivo del servidor. |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 01-09-2026 |  |  | Revisión de HU-23 contra la implementación real; documentada la brecha de decisión en el cliente y las reglas de negocio no migradas al servidor. |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-24 |  | **Nombre:** |  | Visualizar resultado de la validación del acceso |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-022 y HU-023 |  |  |  |  |  |  |
| **Módulo:** |  |  | Control de acceso |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Empleado en el punto de acceso |  |  |  |  |
|  |  |  | **Requiero** |  | Visualizar el resultado de la validación del acceso |  |  |  |  |
|  |  |  | **Para** |  | Conocer inmediatamente si el ingreso fue autorizado o rechazado |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá mostrar de forma clara, en la terminal del punto de acceso, el resultado de la validación — concedido, denegado con motivo o falla de conexión — junto con los datos del empleado cuando existan, y permitir reintentar la lectura. |  |  |  |  |  |  |
| **Alcance:** |  |  | Incluye los estados visuales de la terminal (en espera, validando, concedido, denegado, falla), la información del empleado mostrada, el reintento de la lectura y la distinción entre resultado de negocio y error operativo. No incluye la decisión de la validación (HU-023) ni el registro del intento (HU-026). |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **Parcial.** La terminal del simulador presenta los cinco estados con colores e información del empleado: en espera, validando, concedido, denegado y falla de sensor, y el registro de resultados recientes permite revisar los últimos intentos. Brechas: el resultado mostrado se decide en el navegador y no proviene del servidor (HU-023); la “falla de sensor” solo se puede simular con un botón y no refleja hardware real; cuando el backend falla el error queda oculto y se sigue mostrando el resultado local; los datos mostrados pueden provenir de un catálogo de contingencia del propio simulador. |  |  |  |  |  |  |
| **Precondiciones:** |  |  | El punto de acceso debe poder alcanzar el backend para que el resultado mostrado corresponda a la validación real; la credencial del empleado debe existir para mostrar sus datos. |  |  |  |  |  |  |
| **Flujo principal:** |  |  | 1. La terminal muestra el estado de espera para escanear. 2. La persona presenta la credencial. 3. La terminal muestra el estado de validación en curso. 4. Al recibir la respuesta del servidor, la terminal muestra concedido con los datos del empleado o denegado con el motivo. 5. La terminal vuelve al estado de espera para la siguiente lectura y el resultado queda en el registro reciente. |  |  |  |  |  |  |
| **Evidencia:** |  |  | E-23 [`SimuladorAcceso.tsx:204`](./room911-frontend/src/pages/SimuladorAcceso.tsx:204) (estados de la terminal), [`SimuladorAcceso.tsx:658`](./room911-frontend/src/pages/SimuladorAcceso.tsx:658) (render de los cinco estados), [`SimuladorAcceso.tsx:566`](./room911-frontend/src/pages/SimuladorAcceso.tsx:566) (construcción del resultado en el cliente, brecha), [`SimuladorAcceso.tsx:583`](./room911-frontend/src/pages/SimuladorAcceso.tsx:583) (llamada al servidor con error oculto) y [`SimuladorAcceso.tsx:77`](./room911-frontend/src/pages/SimuladorAcceso.tsx:77) (catálogo de contingencia). |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | que la validación haya sido concedida por el servidor |  |  |  |  |
|  |  |  | **Cuando:** |  | la terminal reciba la respuesta |  |  |  |  |
|  |  |  | **Entonces:** |  | mostrará el estado de acceso concedido junto con el nombre, cargo y departamento del empleado. |  |  |  |  |
| **Condición 02** |  |  | **Dado:** |  | que la validación haya sido denegada |  |  |  |  |
|  |  |  | **Cuando:** |  | la terminal reciba la respuesta |  |  |  |  |
|  |  |  | **Entonces:** |  | mostrará el estado de acceso denegado con el motivo entregado por el servidor. |  |  |  |  |
| **Condición 03** |  |  | **Dado:** |  | que el servidor no responda o responda con error |  |  |  |  |
|  |  |  | **Cuando:** |  | la terminal intente validar |  |  |  |  |
|  |  |  | **Entonces:** |  | mostrará un estado de falla de conexión y permitirá reintentar; hoy el error queda oculto y se muestra la decisión local, brecha pendiente. |  |  |  |  |
| **Condición 04** |  |  | **Dado:** |  | que el empleado no esté registrado |  |  |  |  |
|  |  |  | **Cuando:** |  | se muestre el resultado |  |  |  |  |
|  |  |  | **Entonces:** |  | la terminal indicará la denegación sin inventar datos de persona; hoy el catálogo de contingencia puede mostrar datos ficticios, brecha pendiente. |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | que la terminal esté en reposo |  |  |  |  |
|  |  |  | **Cuando:** |  | no exista lectura en curso |  |  |  |  |
|  |  |  | **Entonces:** |  | mostrará el estado de espera para escanear sin residuos del resultado anterior. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que la validación esté en curso |  |  |  |  |
|  |  |  | **Cuando:** |  | la respuesta no haya llegado |  |  |  |  |
|  |  |  | **Entonces:** |  | la terminal mostrará el estado de validación y bloqueará una segunda lectura simultánea. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que un resultado haya sido mostrado |  |  |  |  |
|  |  |  | **Cuando:** |  | la terminal vuelva al reposo |  |  |  |  |
|  |  |  | **Entonces:** |  | el resultado quedará disponible en el registro reciente con su hora y estado, dentro de un contenedor con scroll acotado. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | que se desee repetir una lectura |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona reinicie la validación |  |  |  |  |
|  |  |  | **Entonces:** |  | la terminal limpiará el resultado anterior y quedará lista para un nuevo intento. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | que la terminal muestre cualquier resultado |  |  |  |  |
|  |  |  | **Cuando:** |  | se revise la hora mostrada |  |  |  |  |
|  |  |  | **Entonces:** |  | el registro reciente deberá reflejar la hora real del evento; hoy la hora se genera en el navegador, lo que se documenta como brecha menor. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | que exista una falla de sensor |  |  |  |  |
|  |  |  | **Cuando:** |  | la terminal la detecte |  |  |  |  |
|  |  |  | **Entonces:** |  | mostrará el estado de falla y permitirá reintentar; hoy la falla solo puede simularse con un botón y no hay telemetría real, brecha documentada. |  |  |  |  |
| **Condición 11** |  |  | **Dado:** |  | que la persona navegue con teclado o lector de pantalla |  |  |  |  |
|  |  |  | **Cuando:** |  | la terminal muestre un resultado |  |  |  |  |
|  |  |  | **Entonces:** |  | el estado y el motivo serán textuales, con contraste adecuado y anunciables; los estados ya combinan color y texto, lo que se mantiene como práctica. |  |  |  |  |
| **Condición 12** |  |  | **Dado:** |  | que el acceso sea denegado |  |  |  |  |
|  |  |  | **Cuando:** |  | se muestren los datos |  |  |  |  |
|  |  |  | **Entonces:** |  | la terminal no expondrá información personal más allá de lo necesario para identificar la lectura. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Mantener los cinco estados de la terminal con combinación de color y texto legible. |  |  |  |  |  |  |
| 2 |  |  | Mostrar el resultado proveniente del servidor, incluyendo el motivo de la denegación tal como llega (HU-023). |  |  |  |  |  |  |
| 3 |  |  | Hacer visible la falla de conexión con un estado propio y opción de reintento. |  |  |  |  |  |  |
| 4 |  |  | Eliminar la presentación de datos del catálogo de contingencia como si fueran resultados reales. |  |  |  |  |  |  |
| 5 |  |  | Bloquear lecturas simultáneas mientras una validación está en curso. |  |  |  |  |  |  |
| 6 |  |  | Limpiar el resultado anterior al reiniciar y conservar el histórico reciente con scroll acotado. |  |  |  |  |  |  |
| 7 |  |  | Tomar la hora de los eventos del servidor o del sistema de forma consistente. |  |  |  |  |  |  |
| 8 |  |  | Definir la telemetría real de sensores o retirar la simulación de falla como si fuera funcionalidad. |  |  |  |  |  |  |
| 9 |  |  | Verificar que los datos mostrados correspondan al empleado resuelto por el servidor y no a datos locales. |  |  |  |  |  |  |
| 10 |  |  | Limitar la información personal mostrada en denegaciones. |  |  |  |  |  |  |
| 11 |  |  | Cubrir accesibilidad: contraste, textos alternativos y anuncios de cambio de estado. |  |  |  |  |  |  |
| 12 |  |  | Ejecutar pruebas de los cinco estados, reintento, lecturas simultáneas, servidor caído y coherencia con el registro de intentos. |  |  |  |  |  |  |
| **REGLAS DE NEGOCIO Y CALIDAD** |  |  |  |  |  |  |  |  |  |
|  |  |  |  | Lo que muestra la terminal debe ser exactamente lo que decidió el servidor; un resultado local simulado no constituye validación. El estado de falla nunca debe disfrazarse de resultado de negocio. La terminal presenta el mínimo de datos personales necesario y los mensajes son comprensibles para el empleado. |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 01-09-2026 |  |  | Revisión de HU-24 contra la implementación real; ampliación de alcance, estado, evidencias, criterios, brechas, reglas y tareas verificables. |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-25 |  | **Nombre:** |  | Visualizar el estado del punto de acceso en tiempo real |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-023, HU-024 y HU-026 |  |  |  |  |  |  |
| **Módulo:** |  |  | Control de acceso |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Operador del punto de acceso |  |  |  |  |
|  |  |  | **Requiero** |  | Visualizar en tiempo real el estado del punto de acceso |  |  |  |  |
|  |  |  | **Para** |  | Conocer la disponibilidad del sistema y el estado actual del proceso de validación de ingreso |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá mostrar información operativa del punto de acceso: hora actual, estado del proceso de validación, conteo de intentos realizados y estado real de conexión con los servicios, distinguendo lo medido de lo simulado. |  |  |  |  |  |  |
| **Alcance:** |  |  | Incluye el estado visible de la terminal de validación, los puntos de control disponibles y su estado operativo. Requiere decisiones de negocio previas: un catálogo persistido de puntos de control y una fuente real de telemetría de sensores; sin ellas, la historia no puede implementarse de forma verificable. No incluye la decisión de validación (HU-023) ni el registro de intentos (HU-026). |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **Parcial (demo).** El simulador muestra el estado del proceso de validación en cinco estados y una lista de once puntos de control con departamento, nivel de restricción y tipo; el estado “en línea” del encabezado es decorativo y no refleja ninguna medición. Brechas: no hay reloj en tiempo real en la terminal (el reloj existe en la credencial digital, no aquí); no existe contador real de intentos — solo el tamaño del registro local de la sesión, que se pierde al recargar —; los puntos de control y sus horarios están definidos en el código del navegador; no hay indicación de estado de la API, la base de datos ni la versión del sistema; no hay lectura real de sensores. |  |  |  |  |  |  |
| **Precondiciones:** |  |  | La terminal debe poder alcanzar el backend para que el estado mostrado sea real; la implementación completa requiere un catálogo persistido de puntos de control y una fuente de telemetría aprobada. |  |  |  |  |  |  |
| **Flujo principal (esperado):** |  |  | 1. La persona abre la terminal del punto de acceso. 2. El sistema muestra la hora actual y el estado de la conexión con los servicios. 3. Durante la operación, la terminal refleja el estado del proceso de validación en curso. 4. El conteo de intentos se actualiza con cada validación registrada en el servidor. 5. Ante una falla, la terminal muestra el estado de error de conexión de forma explícita. |  |  |  |  |  |  |
| **Evidencia:** |  |  | E-24 [`SimuladorAcceso.tsx:215`](./room911-frontend/src/pages/SimuladorAcceso.tsx:215) (puntos de control definidos en el cliente), [`SimuladorAcceso.tsx:627`](./room911-frontend/src/pages/SimuladorAcceso.tsx:627) (indicador “en línea” decorativo), [`SimuladorAcceso.tsx:883`](./room911-frontend/src/pages/SimuladorAcceso.tsx:883) (conteo basado en el registro local de la sesión) y [`CredencialDigital.tsx:67`](./room911-frontend/src/pages/CredencialDigital.tsx:67) (único reloj en tiempo real del sistema, fuera de esta pantalla). |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | que el sistema se encuentre en funcionamiento |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona acceda a la terminal del punto de acceso |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará la hora actual actualizada automáticamente; hoy la terminal no tiene reloj y el criterio queda pendiente de implementación. |  |  |  |  |
| **Condición 02** |  |  | **Dado:** |  | que la terminal esté disponible |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona visualice la pantalla principal |  |  |  |  |
|  |  |  | **Entonces:** |  | se mostrará el estado actual del proceso (en espera, validando, concedido, denegado o error), que hoy existe y se mantiene. |  |  |  |  |
| **Condición 03** |  |  | **Dado:** |  | que se realice una validación |  |  |  |  |
|  |  |  | **Cuando:** |  | finalice el proceso |  |  |  |  |
|  |  |  | **Entonces:** |  | el conteo de intentos deberá actualizarse con los intentos registrados en el servidor, no con los de la sesión local; hoy el conteo se reinicia al recargar y queda pendiente. |  |  |  |  |
| **Condición 04** |  |  | **Dado:** |  | que la terminal esté conectada al servidor |  |  |  |  |
|  |  |  | **Cuando:** |  | se revise la información de estado |  |  |  |  |
|  |  |  | **Entonces:** |  | se deberá mostrar el estado real de la API y la versión del sistema; hoy no existe esta información y el criterio queda pendiente. |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | que la conexión con el servidor se pierda |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona revise el estado |  |  |  |  |
|  |  |  | **Entonces:** |  | la terminal indicará el error de conexión de forma explícita; hoy el indicador “en línea” es decorativo y no refleja la conexión, brecha pendiente. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que existan varios puntos de control |  |  |  |  |
|  |  |  | **Cuando:** |  | se consulte el catálogo |  |  |  |  |
|  |  |  | **Entonces:** |  | los puntos deberán provenir de un catálogo persistido y administrable; hoy están definidos en el código del navegador, brecha documentada. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que el negocio requiera telemetría de sensores |  |  |  |  |
|  |  |  | **Cuando:** |  | se muestre el estado operativo del punto |  |  |  |  |
|  |  |  | **Entonces:** |  | el estado deberá provenir de una medición real; hoy no existe lectura de sensores y la capacidad queda sujeta a decisión e implementación. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | que un punto de control tenga restricción de nivel |  |  |  |  |
|  |  |  | **Cuando:** |  | se muestre su información |  |  |  |  |
|  |  |  | **Entonces:** |  | el nivel de restricción y el departamento asociado serán visibles y coherentes con las reglas aplicadas por el servidor cuando existan. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | que la terminal no pueda cargar su información inicial |  |  |  |  |
|  |  |  | **Cuando:** |  | el servidor falle |  |  |  |  |
|  |  |  | **Entonces:** |  | mostrará un estado de error claro sin datos de demostración. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | que la persona navegue con teclado o lector de pantalla |  |  |  |  |
|  |  |  | **Cuando:** |  | se muestre el estado |  |  |  |  |
|  |  |  | **Entonces:** |  | los estados serán textuales con contraste adecuado y los cambios de estado serán anunciados. |  |  |  |  |
| **Condición 11** |  |  | **Dado:** |  | que la terminal opere en distintas resoluciones |  |  |  |  |
|  |  |  | **Cuando:** |  | se ajuste la pantalla |  |  |  |  |
|  |  |  | **Entonces:** |  | la vista se adaptará de forma responsiva y los registros recientes usarán scroll interno acotado. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Definir con negocio el alcance real del monitoreo del punto de acceso: qué se mide, qué se simula y qué se retira. |  |  |  |  |  |  |
| 2 |  |  | Agregar el reloj en tiempo real a la terminal de validación. |  |  |  |  |  |  |
| 3 |  |  | Conectar el indicador de conexión a una verificación real de la API, con estados explícitos en línea y sin conexión. |  |  |  |  |  |  |
| 4 |  |  | Implementar un contador de intentos basado en los registros del servidor (HU-026) en lugar del estado local de la sesión. |  |  |  |  |  |  |
| 5 |  |  | Migrar el catálogo de puntos de control a persistencia con administración y exponerlo por API. |  |  |  |  |  |  |
| 6 |  |  | Exponer un endpoint de estado del sistema (API, base de datos y versión) y mostrarlo en la terminal. |  |  |  |  |  |  |
| 7 |  |  | Definir la fuente de telemetría de sensores o retirar los estados de hardware simulados. |  |  |  |  |  |  |
| 8 |  |  | Mostrar errores de carga sin datos de demostración ni estados de carga indefinidos. |  |  |  |  |  |  |
| 9 |  |  | Mantener el diseño responsivo y el scroll interno acotado del registro de resultados. |  |  |  |  |  |  |
| 10 |  |  | Cubrir accesibilidad: estados textuales, contraste, foco y anuncios de cambio. |  |  |  |  |  |  |
| 11 |  |  | Documentar en esta historia la distinción entre datos reales y simulados para evitar confusiones de negocio. |  |  |  |  |  |  |
| 12 |  |  | Ejecutar pruebas de estados, conexión, conteo de intentos, catálogo de puntos y comportamiento sin servidor. |  |  |  |  |  |  |
| **REGLAS DE NEGOCIO Y CALIDAD** |  |  |  |  |  |  |  |  |  |
|  |  |  |  | Un indicador de estado debe provenir de una medición real: los elementos decorativos no pueden presentarse como estado operativo. Lo simulado debe etiquetarse como simulación. El catálogo de puntos de control es información de negocio y debe persistirse, no vivir en el código del navegador. |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 01-09-2026 |  |  | Revisión de HU-25 contra la implementación real; documentado el carácter demo de los estados, sin reloj, contador ni telemetría reales. |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-26 |  | **Nombre:** |  | Registrar intentos de acceso |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-010, HU-023, HU-024 y HU-027 |  |  |  |  |  |  |
| **Módulo:** |  |  | Control de acceso |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Registrar automáticamente todos los intentos de acceso realizados al laboratorio |  |  |  |  |
|  |  |  | **Para** |  | Mantener un historial de auditoría que permita consultar los ingresos autorizados y rechazados |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá registrar en el servidor cada intento de acceso validado — concedido o denegado — con fecha y hora del servidor, empleado asociado cuando exista, resultado y mensaje del motivo, y deberá permitir su consulta con filtros y la revisión de la terminal del punto de acceso (HU-024). |  |  |  |  |  |  |
| **Alcance:** |  |  | Incluye el registro automático por la validación de acceso, el modelo de datos del intento, las consultas por API (general, por empleado y por rango de fechas), el informe PDF por empleado y la pantalla de historial global con sus filtros. No incluye la auditoría de operaciones administrativas (HU-020) ni la estadística agregada (HU-019 y HU-027). |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **Parcial.** El registro automático existe: cada validación por POST /api/acceso guarda un intento con fecha del servidor, resultado, mensaje y empleado — incluso los intentos de códigos desconocidos quedan registrados sin empleado asociado. La consulta funciona por API y la pantalla de historial lista los intentos con búsqueda de texto y filtro de resultado. Brechas: los filtros de fecha “Desde” y “Hasta” de la pantalla son decorativos y no filtran; el punto de acceso consultado se envía desde el cliente; cuando el servidor falla la lectura no se registra y el error queda oculto; la semilla de arranque crea intentos de demostración que se mezclan con los reales; no existe registro de entrada y salida de planta en este flujo (el historial de presencia es un módulo aparte sin conexión automática). |  |  |  |  |  |  |
| **Precondiciones:** |  |  | El punto de acceso debe poder alcanzar el backend; la consulta del historial requiere una sesión válida. |  |  |  |  |  |  |
| **Flujo principal:** |  |  | 1. El empleado presenta su credencial y el punto de acceso valida (HU-023). 2. El servidor guarda el intento con fecha, resultado y motivo. 3. El administrador abre el historial global. 4. El sistema lista los intentos ordenados del más reciente al más antiguo. 5. El administrador filtra por texto o por resultado, navega con la paginación y exporta el resultado cuando lo necesite. |  |  |  |  |  |  |
| **Evidencia:** |  |  | E-25 [`AccessServiceImpl.java:144`](./backend_911/backend/src/main/java/com/room911/service/impl/AccessServiceImpl.java:144) (registro automático del intento), [`AccessAttempt.java:15`](./backend_911/backend/src/main/java/com/room911/entity/AccessAttempt.java:15) (entidad del intento), [`AccessAttemptController.java:20`](./backend_911/backend/src/main/java/com/room911/controller/AccessAttemptController.java:20) (consultas y filtro por fechas), [`HistorialAccesos.tsx:43`](./room911-frontend/src/pages/HistorialAccesos.tsx:43) (carga del historial), [`HistorialAccesos.tsx:267`](./room911-frontend/src/pages/HistorialAccesos.tsx:267) (filtros de fecha decorativos) y [`DataInitializer.java:131`](./backend_911/backend/src/main/java/com/room911/config/DataInitializer.java:131) (intentos de demostración). |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | que un empleado intente ingresar y el punto de acceso valide |  |  |  |  |
|  |  |  | **Cuando:** |  | el servidor procese la solicitud |  |  |  |  |
|  |  |  | **Entonces:** |  | registrará automáticamente el intento con la fecha y hora del servidor. |  |  |  |  |
| **Condición 02** |  |  | **Dado:** |  | que el acceso sea concedido |  |  |  |  |
|  |  |  | **Cuando:** |  | finalice la validación |  |  |  |  |
|  |  |  | **Entonces:** |  | el intento quedará registrado como exitoso con el empleado asociado. |  |  |  |  |
| **Condición 03** |  |  | **Dado:** |  | que el acceso sea denegado por cuenta inactiva, permiso revocado o datos incompletos |  |  |  |  |
|  |  |  | **Cuando:** |  | finalice la validación |  |  |  |  |
|  |  |  | **Entonces:** |  | el intento quedará registrado con el motivo entregado por el servidor. |  |  |  |  |
| **Condición 04** |  |  | **Dado:** |  | que el código presentado no corresponda a ningún empleado |  |  |  |  |
|  |  |  | **Cuando:** |  | el servidor valide |  |  |  |  |
|  |  |  | **Entonces:** |  | el intento quedará registrado como denegado sin empleado asociado y con el motivo correspondiente. |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | que el servidor no esté disponible durante una lectura |  |  |  |  |
|  |  |  | **Cuando:** |  | el punto de acceso intente validar |  |  |  |  |
|  |  |  | **Entonces:** |  | no habrá registro de ese intento y la terminal deberá indicar la falla; hoy el error queda oculto y la brecha se documenta. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que el administrador consulte el historial |  |  |  |  |
|  |  |  | **Cuando:** |  | ingrese a la pantalla |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará los intentos registrados ordenados del más reciente al más antiguo, con paginación. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que el administrador filtre por texto o por resultado |  |  |  |  |
|  |  |  | **Cuando:** |  | se apliquen los filtros |  |  |  |  |
|  |  |  | **Entonces:** |  | el listado mostrará solo las coincidencias y el estado vacío cuando no las haya. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | que el administrador seleccione un rango de fechas “Desde” y “Hasta” |  |  |  |  |
|  |  |  | **Cuando:** |  | se aplique el filtro |  |  |  |  |
|  |  |  | **Entonces:** |  | el listado deberá limitarse a ese rango; hoy los campos son decorativos y no filtran, brecha pendiente de corrección. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | que no existan intentos registrados |  |  |  |  |
|  |  |  | **Cuando:** |  | se consulte el historial |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará el estado vacío informativo sin filas de ejemplo. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | que los intentos se registren |  |  |  |  |
|  |  |  | **Cuando:** |  | se revise la base de datos |  |  |  |  |
|  |  |  | **Entonces:** |  | los registros corresponderán a validaciones reales; la siembra de intentos de demostración en el arranque debe evaluarse como brecha. |  |  |  |  |
| **Condición 11** |  |  | **Dado:** |  | que el administrador consulte el historial sin sesión válida |  |  |  |  |
|  |  |  | **Cuando:** |  | se solicite el listado |  |  |  |  |
|  |  |  | **Entonces:** |  | el servidor responderá 401 y la interfaz redirigirá al inicio de sesión. |  |  |  |  |
| **Condición 12** |  |  | **Dado:** |  | que el administrador navegue con teclado o lector de pantalla |  |  |  |  |
|  |  |  | **Cuando:** |  | recorra el historial |  |  |  |  |
|  |  |  | **Entonces:** |  | la tabla tendrá encabezados legibles, los filtros estarán etiquetados y el estado vacío será anunciado. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Mantener el registro automático del intento en cada validación, con fecha, resultado y motivo del servidor. |  |  |  |  |  |  |
| 2 |  |  | Verificar el registro de intentos sin empleado asociado para códigos desconocidos. |  |  |  |  |  |  |
| 3 |  |  | Conectar los filtros de fecha “Desde” y “Hasta” de la pantalla al filtrado real, en cliente o mediante el endpoint por fechas existente. |  |  |  |  |  |  |
| 4 |  |  | Mostrar el punto de acceso consultado como información informativa y registrar su origen real, o mover la identificación de la puerta al servidor. |  |  |  |  |  |  |
| 5 |  |  | Hacer visible la falla de conexión del punto de acceso para que las lecturas no validadas sean evidentes. |  |  |  |  |  |  |
| 6 |  |  | Evaluar con negocio la siembra de intentos de demostración y separarla de los datos reales. |  |  |  |  |  |  |
| 7 |  |  | Mantener las consultas por API protegidas con autenticación y roles de gestión de accesos. |  |  |  |  |  |  |
| 8 |  |  | Mantener el informe PDF por empleado con datos del empleado, resultados y fecha de generación. |  |  |  |  |  |  |
| 9 |  |  | Mantener la exportación CSV del historial filtrado y verificar que respete los filtros vigentes. |  |  |  |  |  |  |
| 10 |  |  | Definir la relación entre los intentos registrados y el historial de entrada y salida de planta, hoy módulos desconectados. |  |  |  |  |  |  |
| 11 |  |  | Cubrir accesibilidad del historial: encabezados, etiquetas de filtros, foco y anuncios. |  |  |  |  |  |  |
| 12 |  |  | Ejecutar pruebas de registro en cada escenario de validación, consulta, filtros, paginación, permisos, estado vacío y exportación. |  |  |  |  |  |  |
| **REGLAS DE NEGOCIO Y CALIDAD** |  |  |  |  |  |  |  |  |  |
|  |  |  |  | Todo intento validado se registra en el servidor con su motivo; ningún intento puede registrarse como éxito si el servidor no lo concedió. Los datos de demostración no deben mezclarse con los reales. El historial es material de auditoría de accesos: se consulta con sesión válida y no se altera desde la interfaz. |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 01-09-2026 |  |  | Revisión de HU-26 contra la implementación real; ampliación de alcance, estado, evidencias, criterios, brechas, reglas y tareas verificables. |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-27 |  | **Nombre:** |  | Visualizar indicadores del sistema |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-019 y HU-026 |  |  |  |  |  |  |
| **Módulo:** |  |  | Dashboard |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Consultar indicadores generales del sistema |  |  |  |  |
|  |  |  | **Para** |  | Monitorear el funcionamiento del laboratorio y el comportamiento de los accesos |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá mostrar, en el panel principal y al iniciar sesión, indicadores reales calculados por el servidor: personal registrado y activo, personal con permiso de acceso, en planta, accesos concedidos y denegados del día, evolución semanal y distribución por departamento, con estados vacíos y de error claros. |  |  |  |  |  |  |
| **Alcance:** |  |  | Incluye las tarjetas de indicadores (KPI) del panel y su origen de datos. Comparte pantalla y endpoints con HU-019 (estadísticas de accesos): esta historia cubre los indicadores generales de estado y HU-019 la lectura estadística de los accesos. No incluye la gestión de personal (HU-008 a HU-014) ni la telemetría de sensores (HU-025). |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **Parcial.** Los indicadores principales son reales: personal registrado y porcentaje de activos, accesos concedidos y denegados del día, personal con permiso y en planta provienen del endpoint de resumen del servidor, y el gráfico semanal y la distribución por departamento se calculan en el backend. Brechas: el porcentaje de aforo en planta es un valor fijo sin fuente real; la tasa de efectividad usa un valor de respaldo cuando no hay accesos; el contador de fallas de sensor está forzado a cero y se presenta como “100 % operativo”; si falla la carga del resumen el panel se queda en carga indefinida sin mensaje de error. |  |  |  |  |  |  |
| **Precondiciones:** |  |  | La persona debe tener una sesión válida; los indicadores reflejan los datos vigentes de empleados, departamentos e intentos registrados. |  |  |  |  |  |  |
| **Flujo principal:** |  |  | 1. La persona autenticada inicia sesión y accede al panel. 2. El sistema consulta el resumen y las series del dashboard. 3. El sistema muestra las tarjetas de indicadores con su contexto (porcentajes y comparaciones). 4. La persona actualiza la vista o vuelve a entrar para refrescar los indicadores con los datos más recientes. |  |  |  |  |  |  |
| **Evidencia:** |  |  | E-26 [`Dashboard.tsx:109`](./room911-frontend/src/pages/Dashboard.tsx:109) a [`Dashboard.tsx:266`](./room911-frontend/src/pages/Dashboard.tsx:266) (tarjetas KPI), [`Dashboard.tsx:250`](./room911-frontend/src/pages/Dashboard.tsx:250) (aforo fijo), [`Dashboard.tsx:72`](./room911-frontend/src/pages/Dashboard.tsx:72) (tasa con respaldo), [`Dashboard.tsx:45`](./room911-frontend/src/pages/Dashboard.tsx:45) (error de carga silencioso) y [`DashboardServiceImpl.java:33`](./backend_911/backend/src/main/java/com/room911/service/impl/DashboardServiceImpl.java:33) (cálculo del resumen). |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | que la persona inicie sesión correctamente |  |  |  |  |
|  |  |  | **Cuando:** |  | acceda al panel |  |  |  |  |
|  |  |  | **Entonces:** |  | visualizará los indicadores principales calculados por el servidor: personal registrado, con permiso, en planta y accesos del día. |  |  |  |  |
| **Condición 02** |  |  | **Dado:** |  | que existan registros de acceso |  |  |  |  |
|  |  |  | **Cuando:** |  | el panel sea cargado |  |  |  |  |
|  |  |  | **Entonces:** |  | los indicadores de accesos concedidos y denegados reflejarán las cifras reales del día. |  |  |  |  |
| **Condición 03** |  |  | **Dado:** |  | que existan diferentes departamentos con personal |  |  |  |  |
|  |  |  | **Cuando:** |  | se consulte la distribución |  |  |  |  |
|  |  |  | **Entonces:** |  | se mostrará la cantidad de empleados activos por departamento calculada por el servidor. |  |  |  |  |
| **Condición 04** |  |  | **Dado:** |  | que la persona actualice la página |  |  |  |  |
|  |  |  | **Cuando:** |  | el sistema recargue la información |  |  |  |  |
|  |  |  | **Entonces:** |  | los indicadores reflejarán la información más reciente del servidor. |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | que la base no tenga personal o accesos |  |  |  |  |
|  |  |  | **Cuando:** |  | se muestren los indicadores |  |  |  |  |
|  |  |  | **Entonces:** |  | las cifras se presentarán en cero o con estado vacío claro, sin valores de respaldo que simulen actividad; hoy la tasa usa un valor fijo de respaldo y el criterio queda pendiente. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que el indicador de aforo se muestre |  |  |  |  |
|  |  |  | **Cuando:** |  | se revise su origen |  |  |  |  |
|  |  |  | **Entonces:** |  | el valor deberá provenir de un cálculo real de ocupación; hoy es un porcentaje fijo sin fuente y la tarea queda pendiente de cálculo o retiro. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que el indicador de fallas de sensor se muestre |  |  |  |  |
|  |  |  | **Cuando:** |  | se revise su origen |  |  |  |  |
|  |  |  | **Entonces:** |  | deberá reflejar una medición real; hoy está forzado a cero y se presenta como “100 % operativo”, brecha documentada. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | que el resumen del servidor falle |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona abra el panel |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema deberá mostrar un mensaje de error claro; hoy la pantalla se queda en carga indefinida y el criterio queda pendiente. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | que la persona no esté autenticada |  |  |  |  |
|  |  |  | **Cuando:** |  | intente acceder al panel |  |  |  |  |
|  |  |  | **Entonces:** |  | el servidor responderá 401 y la interfaz redirigirá al inicio de sesión. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | que cambien los datos operativos (altas, accesos, denegaciones) |  |  |  |  |
|  |  |  | **Cuando:** |  | se refresque el panel |  |  |  |  |
|  |  |  | **Entonces:** |  | los indicadores serán coherentes con el historial de intentos (HU-026) y el directorio de personal. |  |  |  |  |
| **Condición 11** |  |  | **Dado:** |  | que la persona navegue con teclado o lector de pantalla |  |  |  |  |
|  |  |  | **Cuando:** |  | recorra las tarjetas de indicadores |  |  |  |  |
|  |  |  | **Entonces:** |  | cada indicador será legible con contraste adecuado y las series tendrán resumen textual accesible. |  |  |  |  |
| **Condición 12** |  |  | **Dado:** |  | que el panel se visualice en móvil, tablet o escritorio |  |  |  |  |
|  |  |  | **Cuando:** |  | se ajuste la resolución |  |  |  |  |
|  |  |  | **Entonces:** |  | las tarjetas y gráficos se adaptarán sin desbordar la página. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Mantener las tarjetas KPI conectadas al endpoint de resumen real con mapeo estricto del contrato. |  |  |  |  |  |  |
| 2 |  |  | Verificar los cálculos del servidor: personal activo, con permiso, en planta, accesos y denegaciones del día. |  |  |  |  |  |  |
| 3 |  |  | Sustituir el porcentaje fijo de aforo por un cálculo real o retirarlo hasta existir aforo por departamento. |  |  |  |  |  |  |
| 4 |  |  | Eliminar el valor de respaldo de la tasa de efectividad y mostrar cero o estado vacío sin datos. |  |  |  |  |  |  |
| 5 |  |  | Conectar el indicador de fallas de sensor a una fuente real o retirarlo hasta existir telemetría. |  |  |  |  |  |  |
| 6 |  |  | Agregar mensaje de error y estado vacío a la carga del panel, sin carga indefinida. |  |  |  |  |  |  |
| 7 |  |  | Verificar la coherencia de los indicadores con el historial de intentos y el directorio de personal. |  |  |  |  |  |  |
| 8 |  |  | Evaluar con negocio la siembra de datos de demostración y su separación de los datos reales. |  |  |  |  |  |  |
| 9 |  |  | Mantener la actualización manual del panel y evaluar la periodicidad acordada de refresco. |  |  |  |  |  |  |
| 10 |  |  | Coordinar esta historia con HU-019 para evitar indicadores duplicados con definiciones distintas. |  |  |  |  |  |  |
| 11 |  |  | Cubrir accesibilidad de indicadores y series: contraste, resúmenes textuales y navegación por teclado. |  |  |  |  |  |  |
| 12 |  |  | Ejecutar pruebas con datos reales, vacíos y con fallas parciales de endpoints, verificando coherencia y actualización. |  |  |  |  |  |  |
| **REGLAS DE NEGOCIO Y CALIDAD** |  |  |  |  |  |  |  |  |  |
|  |  |  |  | Los indicadores se calculan en el servidor a partir de datos reales; ningún KPI puede mostrar valores de respaldo, porcentajes fijos ni estados de hardware sin medición. Un fallo de carga degrada la vista con mensaje claro, nunca con cifras falsas. Los indicadores comparten definiciones con HU-019 y deben mantenerse coherentes entre sí. |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 01-09-2026 |  |  | Revisión de HU-27 contra la implementación real; ampliación de alcance, estado, evidencias, criterios, brechas, reglas y tareas verificables. |  |  |  |  |

| HISTORIA DE USUARIO |  |  |  |  |  |  |  |  |  |
| ----- | :---- | :---: | ----- | :---: | :---- | :---: | :---: | :---: | :---: |
| **Código:** | HU-29 |  | **Nombre:** |  | Exportar historial de accesos en PDF |  |  |  |  |
| **Complejidad:** |  |  | Media |  |  |  |  |  |  |
| **HU Relacionada:** |  |  | HU-019 y HU-026 |  |  |  |  |  |  |
| **Módulo:** |  |  | Historial |  |  |  |  |  |  |
| **Descripción:** |  |  | **Yo como** |  | Administrador |  |  |  |  |
|  |  |  | **Requiero** |  | Exportar el historial de accesos en formato PDF |  |  |  |  |
|  |  |  | **Para** |  | Conservar evidencia y generar reportes de auditoría |  |  |  |  |
| **Requerimiento:** |  |  | El sistema deberá generar, desde el historial de accesos, un documento PDF con los registros visibles según los filtros aplicados, con encabezado institucional, fecha y hora de generación y tabulación clara; adicionalmente deberá existir un informe PDF formal por empleado generado en el servidor. |  |  |  |  |  |  |
| **Alcance:** |  |  | Incluye la exportación del historial global (PDF y CSV) y el informe PDF por empleado generado por el backend. No incluye el registro ni la consulta del historial (HU-026) ni las estadísticas agregadas (HU-019). |  |  |  |  |  |  |
| **Estado frente a la app:** |  |  | **Parcial.** La pantalla del historial ofrece una exportación CSV real — archivo UTF-8 con marca BOM que respeta los filtros de texto y de resultado aplicados — y una exportación PDF que arma un documento HTML en el navegador y abre el diálogo de impresión para “Guardar como PDF”: produce la evidencia, pero no es un PDF generado por el servidor. Además, el backend genera un informe PDF formal por empleado (endpoint protegido con encabezado institucional, datos del empleado, resultados y fecha de generación) accesible desde el detalle del empleado, no desde el historial global. Brechas: el PDF global no incluye fecha de generación ni pie formal, depende del navegador y no es evidencia del servidor; los filtros de fecha del historial son decorativos (HU-026), por lo que el documento puede no reflejar el rango aparente; la exportación no queda registrada en auditoría. |  |  |  |  |  |  |
| **Precondiciones:** |  |  | La persona debe tener una sesión válida para consultar el historial; para el informe PDF por empleado se requiere el rol SUPER_ADMIN o ADMIN_ACCESOS. Deben existir intentos de acceso registrados para que la exportación tenga contenido. |  |  |  |  |  |  |
| **Flujo principal:** |  |  | 1. El administrador abre el historial de accesos y aplica los filtros deseados. 2. Selecciona la exportación CSV o PDF. 3. En CSV, el navegador descarga el archivo con los registros filtrados. 4. En PDF, el sistema abre la vista de impresión con la tabla para guardar como PDF. 5. Alternativamente, desde el detalle de un empleado el administrador genera su informe PDF formal del servidor y lo descarga. |  |  |  |  |  |  |
| **Evidencia:** |  |  | E-28 [`HistorialAccesos.tsx:81`](./room911-frontend/src/pages/HistorialAccesos.tsx:81) (exportación CSV real), [`HistorialAccesos.tsx:116`](./room911-frontend/src/pages/HistorialAccesos.tsx:116) (PDF por impresión del navegador), [`PdfServiceImpl.java:29`](./backend_911/backend/src/main/java/com/room911/service/impl/PdfServiceImpl.java:29) (informe PDF por empleado en el servidor) y [`AccessAttemptController.java:62`](./backend_911/backend/src/main/java/com/room911/controller/AccessAttemptController.java:62) (endpoint protegido del informe). |  |  |  |  |  |  |
| **CRITERIOS DE ACEPTACIÓN** |  |  |  |  |  |  |  |  |  |
| **Condición 01** |  |  | **Dado:** |  | que existan registros de acceso y la persona tenga sesión válida |  |  |  |  |
|  |  |  | **Cuando:** |  | seleccione la exportación PDF |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema abrirá la vista de impresión con la tabla del historial según los filtros vigentes; hoy el comportamiento es el de impresión del navegador y se mantiene. |  |  |  |  |
| **Condición 02** |  |  | **Dado:** |  | que el documento se haya generado |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona lo guarde como PDF |  |  |  |  |
|  |  |  | **Entonces:** |  | contendrá los registros visibles según los filtros de texto y de resultado aplicados. |  |  |  |  |
| **Condición 03** |  |  | **Dado:** |  | que el documento se haya generado |  |  |  |  |
|  |  |  | **Cuando:** |  | se revise su contenido |  |  |  |  |
|  |  |  | **Entonces:** |  | deberá incluir encabezado institucional, fecha y hora de generación y paginación clara; hoy no los incluye y la tarea queda pendiente. |  |  |  |  |
| **Condición 04** |  |  | **Dado:** |  | que la persona aplique filtros de fecha antes de exportar |  |  |  |  |
|  |  |  | **Cuando:** |  | se genere el documento |  |  |  |  |
|  |  |  | **Entonces:** |  | el PDF deberá reflejar el rango seleccionado; hoy los filtros de fecha son decorativos (HU-026) y la brecha condiciona este criterio. |  |  |  |  |
| **Condición 05** |  |  | **Dado:** |  | que no existan registros o el filtro no arroje resultados |  |  |  |  |
|  |  |  | **Cuando:** |  | la persona intente exportar |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema avisará que no hay información disponible sin generar un archivo vacío; hoy existen los avisos y se mantienen. |  |  |  |  |
| **Condición 06** |  |  | **Dado:** |  | que la persona seleccione la exportación CSV |  |  |  |  |
|  |  |  | **Cuando:** |  | se descargue el archivo |  |  |  |  |
|  |  |  | **Entonces:** |  | estará codificado en UTF-8 con separador de comas, cabecera de columnas y solo los registros filtrados; hoy el comportamiento es real y se mantiene. |  |  |  |  |
| **Condición 07** |  |  | **Dado:** |  | que la persona no tenga sesión válida |  |  |  |  |
|  |  |  | **Cuando:** |  | intente consultar o exportar el historial |  |  |  |  |
|  |  |  | **Entonces:** |  | el servidor responderá 401 y la interfaz redirigirá al inicio de sesión. |  |  |  |  |
| **Condición 08** |  |  | **Dado:** |  | que el administrador genere el informe PDF de un empleado desde su detalle |  |  |  |  |
|  |  |  | **Cuando:** |  | se descargue el archivo |  |  |  |  |
|  |  |  | **Entonces:** |  | el PDF incluirá datos del empleado, resultados PERMITIDO o DENEGADO por intento, los mensajes correspondientes y la fecha de generación; hoy lo produce el servidor y se mantiene. |  |  |  |  |
| **Condición 09** |  |  | **Dado:** |  | que el informe se solicite para un empleado sin intentos registrados |  |  |  |  |
|  |  |  | **Cuando:** |  | se genere el PDF |  |  |  |  |
|  |  |  | **Entonces:** |  | incluirá la nota de que no existen intentos registrados, sin fallar. |  |  |  |  |
| **Condición 10** |  |  | **Dado:** |  | que el servidor falle al generar el informe por empleado |  |  |  |  |
|  |  |  | **Cuando:** |  | se confirme la acción |  |  |  |  |
|  |  |  | **Entonces:** |  | el sistema mostrará el error sin informar éxito; el PDF global es una generación del navegador y no depende del servidor. |  |  |  |  |
| **Condición 11** |  |  | **Dado:** |  | que se ejecute una exportación |  |  |  |  |
|  |  |  | **Cuando:** |  | se consulte la auditoría |  |  |  |  |
|  |  |  | **Entonces:** |  | la operación deberá quedar registrada con actor, filtros y total de registros; hoy no hay registro automático y queda pendiente de HU-020. |  |  |  |  |
| **Condición 12** |  |  | **Dado:** |  | que la persona navegue con teclado o lector de pantalla |  |  |  |  |
|  |  |  | **Cuando:** |  | acceda a las acciones de exportación |  |  |  |  |
|  |  |  | **Entonces:** |  | las acciones tendrán nombre accesible y el resultado de la operación será anunciado. |  |  |  |  |
| **TAREAS** |  |  |  |  |  |  |  |  |  |
| **No** |  |  | **Descripción** |  |  |  |  |  |  |
| 1 |  |  | Mantener la exportación CSV real del historial con marca BOM UTF-8 y respeto de los filtros vigentes. |  |  |  |  |  |  |
| 2 |  |  | Reemplazar el PDF por impresión del navegador por un PDF generado en el servidor, con encabezado institucional, fecha y hora de generación y paginación. |  |  |  |  |  |  |
| 3 |  |  | Conectar la exportación a los filtros de fecha reales del historial (ligada a HU-026). |  |  |  |  |  |  |
| 4 |  |  | Nombrar los archivos exportados de forma reconocible, con fecha y rango exportado. |  |  |  |  |  |  |
| 5 |  |  | Mantener los avisos de historial vacío o sin coincidencias antes de exportar. |  |  |  |  |  |  |
| 6 |  |  | Registrar la exportación en auditoría con actor, filtros y total de registros (ligada a HU-020). |  |  |  |  |  |  |
| 7 |  |  | Mantener el informe PDF por empleado del servidor y su acceso desde el detalle, restringido a los roles de gestión de accesos. |  |  |  |  |  |  |
| 8 |  |  | Verificar el contenido del informe por empleado: encabezado, datos del empleado, resultados, mensajes y fecha de generación. |  |  |  |  |  |  |
| 9 |  |  | Manejar los errores del servidor sin informar éxito falso ni descargar archivos parciales. |  |  |  |  |  |  |
| 10 |  |  | Limitar los documentos exportados a los datos acordados, sin información sensible adicional. |  |  |  |  |  |  |
| 11 |  |  | Cubrir accesibilidad de las acciones de exportación y de sus resultados. |  |  |  |  |  |  |
| 12 |  |  | Ejecutar pruebas de exportación con y sin filtros, sin registros, sin sesión, informe por empleado con y sin intentos y falla del servidor. |  |  |  |  |  |  |
| **REGLAS DE NEGOCIO Y CALIDAD** |  |  |  |  |  |  |  |  |  |
|  |  |  |  | La exportación es una lectura y no altera registros. Los documentos solo contienen los datos acordados, sin información sensible. El PDF formal debe generarse en el servidor para constituir evidencia; el “Guardar como PDF” del navegador es una ayuda operativa y no un reporte oficial. Toda exportación debe quedar trazada en auditoría. |  |  |  |  |  |
| **CONTROL DE VERSIONES** |  |  |  |  |  |  |  |  |  |
| **Versión** |  | **Fecha** |  | **Autor** |  | **Revisión** |  | **Descripción** | **Aprobador** |
| 1.1 |  | 01-09-2026 |  |  | Ampliación de HU-029 al formato vigente: alcance, estado, evidencias, criterios, brechas, reglas y tareas verificables. |  |  |  |  |
