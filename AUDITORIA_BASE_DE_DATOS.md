# 🔍 Auditoría de Base de Datos — ROOM911

**Fecha:** 2026-09-03
**Alcance:** Revisión de dominio, normalización, integridad, rendimiento y buenas prácticas del modelo de datos de PostgreSQL (`reto_room_911`).
**Fuentes:** `Reto_room911.docx` (contexto del dominio), esquema real inspeccionado en la BD viva (PostgreSQL 16, `127.0.0.1:5432`), entidades JPA en `backend_911/backend/src/main/java/com/room911/entity/`, `docker-compose.yml` y `db/merge_backup_reto_room_911.sql`.

---

## 1. Dominio y contexto (según el reto)

Laboratorios XYZ necesita controlar el acceso físico de su personal al **ROOM_911**, el área de producción de medicamentos de alto costo, mediante un lector de tarjetas que lee el **número de identificación interno** del trabajador.

**Reglas de negocio que impone el reto:**

| # | Regla | Implicación en el modelo |
|---|-------|--------------------------|
| R1 | Acceso al módulo protegido por usuario/contraseña (`admin_room_911`) | Entidad de administradores con credenciales |
| R2 | Un empleado pertenece a **un** departamento de producción | FK `empleado → departamento` (1:N) |
| R3 | Carga masiva de "N" empleados por CSV a un departamento | Claves naturales confiables (`documento`) para idempotencia |
| R4 | Se puede otorgar/denegar acceso por empleado | Flag de autorización en el empleado |
| R5 | **Todo intento** de acceso se registra con hora y empleado, tenga o no éxito, **incluidos empleados no registrados** | Tabla de intentos con FK opcional + dato del intento fallido |
| R6 | Búsqueda por id, nombre, apellido y filtro por departamento | Índices sobre `nombre`, `apellido`, `departamento_id` |
| R7 | Histórico de intentos por empleado filtrable por **rango de fechas** | Índice sobre la columna de fecha de los intentos |
| R8 | Exportación a PDF del histórico | Solo lectura, pero refuerza R7 |

**Diagrama de dominio actual (implementado):**

```
administradores 1──────∞ auditoria
administradores 1──────∞ departamentos (administrador_id, responsable)
departamentos   1──────∞ empleados
empleados       1──────∞ intento_acceso   (FK opcional: empleado_id NULL)
empleados       1──────∞ historial_acceso (ingreso/salida al cuarto)
```

**Estado real de la BD viva (6 tablas):** `administradores` (2 filas), `auditoria` (0), `departamentos` (6), `empleados` (18), `historial_acceso` (0), `intento_acceso` (14). Las tablas `admin_users` y `visitantes` que aparecen en `backup_reto_room_911.sql` **ya no existen** en la BD viva (fueron eliminadas del código).

---

## 2. Hallazgos

### 🔴 Críticos

#### H1. Falta columna para el documento intentado en intentos de no registrados (R5 incumplida a medias)
`intento_acceso` tiene `empleado_id` nullable (correcto), pero cuando el empleado **no está registrado**, el documento leído por el lector se concatena dentro del texto libre de `message`:

> `guardarIntento(null, false, "Empleado no registrado (" + tokenOValor + ")")` — `AccessServiceImpl.java:36`

Esto sobrecarga semánticamente la columna (`message` mezcla resultado + dato), impide buscar/contar intentos por credencial, y viola la atomicidad de valores que exige 1NF. **El reto exige expresamente conservar el récord de intentos de empleados no registrados**, y ese dato debe ser un campo propio y consultable.

**Recomendación:** agregar `documento_intentado varchar(20)` a `intento_acceso` y poblarlo en todos los casos (registrado o no).

#### H2. Cero índices de consulta: la BD solo tiene PKs y UNIQUEs
La BD viva tiene **11 índices, todos de PK/UNIQUE**. No existe ni un solo índice secundario, y PostgreSQL **no crea índices automáticos sobre FKs**. Las operaciones centrales del reto son full-scan:

| Consulta (caso de uso del reto) | Columna sin índice |
|---|---|
| Histórico de intentos de un empleado (R6/R7) | `intento_acceso.empleado_id` |
| Filtro de histórico por rango de fechas (R7) | `intento_acceso.acceso_date` |
| Histórico de sesiones por empleado | `historial_acceso.empleado_id` |
| Búsqueda/filtro por departamento (R6) | `empleados.departamento_id` |
| Auditoría por administrador | `auditoria.administrador_id` |
| Búsqueda por nombre / apellido (R6) | `empleados.nombre`, `empleados.apellido` |

**Recomendación (DDL):**

```sql
CREATE INDEX indice_intento_acceso_empleado  ON intento_acceso (empleado_id);
CREATE INDEX indice_intento_acceso_fecha     ON intento_acceso (acceso_date);
-- El índice compuesto cubre ambas consultas del histórico:
CREATE INDEX indice_intento_acceso_empleado_fecha ON intento_acceso (empleado_id, acceso_date);
CREATE INDEX indice_historial_acceso_empleado ON historial_acceso (empleado_id);
CREATE INDEX indice_empleados_departamento    ON empleados (departamento_id);
CREATE INDEX indice_auditoria_administrador   ON auditoria (administrador_id);
CREATE INDEX indice_empleados_nombre          ON empleados (nombre);
CREATE INDEX indice_empleados_apellido        ON empleados (apellido);
```

#### H3. Esquema gestionado con `ddl-auto=update` y sin herramienta de migraciones
`spring.jpa.hibernate.ddl-auto` está por defecto en `update` (application.properties y docker-compose). Esto significa que el esquema real lo va "adivinando" Hibernate: es la causa de que el dump `backup_reto_room_911.sql` esté **desalineado con la BD viva** (el dump no tiene `administradores.rol`, ni `departamentos.administrador_id/codigo/nivel_restriccion/capacidad_maxima`, y contiene tablas muertas `admin_users` y `visitantes`), y de que el script `db/merge_backup_reto_room_911.sql` opere contra un esquema que ya no coincide. `update` nunca borra columnas ni ajusta tipos: el esquema solo deriva.

**Recomendación:** adoptar **Flyway** (ya viene con Spring Boot):
1. `V1__baseline.sql` — esquema actual verificado contra la BD viva.
2. `V2__indices.sql` — índices de H2.
3. `V3__data_quality.sql` — constraints de H4/H5 y renombrados de H6.
4. Fijar `ddl-auto=validate` (nunca `update`) en compose y properties.

---

### 🟠 Importantes

#### H4. Sin integridad de dominio (CHECKs) ni catálogos
Evidencia en datos vivos: `cargo = 'LO QUE QUIERA'`, `nombre = 'lo que sea'`, y `rol` con valores libres (`SUPER_ADMIN`, `ADMIN_SISTEMAS`) aunque AGENTS.md define los roles `ADMIN | OPERADOR | AUDITOR`.

- **`empleados.cargo`** es texto libre de 100 caracteres sin catálogo. Para una farmacéutica (BPF) el cargo es un dato controlado. Crear tabla catálogo `cargos(id, nombre UNIQUE)` y FK desde `empleados` (normalización correcta del dominio), o al mínimo un CHECK sobre valores permitidos.
- **`administradores.rol`** sin restricción → `CHECK (rol IN ('ADMIN','OPERADOR','AUDITOR'))` o tabla catálogo de roles.
- **`departamentos.nivel_restriccion`** sin dominio definido → CHECK o enum.
- **Faltan CHECKs estructurales:** `fecha_salida >= fecha_ingreso` en `historial_acceso`; `acceso_date <= now()` en `intento_acceso`; `capacidad_maxima > 0`.
- **`correo`** sin validación de formato (se valida en DTO, pero la BD es la última línea de defensa para cargas masivas).

#### H5. UNIQUEs globales chocan con el borrado lógico
Todas las tablas usan borrado lógico (`activo=false`), pero los UNIQUE de `documento`, `correo`, `usuario` y `departamentos.nombre` son globales. **Un empleado desactivado bloquea para siempre la re-contratación/re-registro con el mismo documento**, y la carga masiva CSV (R3) fallará en ese escenario.

**Recomendación:** convertir a índices únicos parciales:

```sql
ALTER TABLE empleados DROP CONSTRAINT uk5l7j8378rxvcv2yq3kic8f17i;
CREATE UNIQUE INDEX unico_empleados_documento ON empleados (documento) WHERE activo;
CREATE UNIQUE INDEX unico_empleados_correo    ON empleados (correo)    WHERE activo;
-- mismo patrón para administradores(usuario, correo) y departamentos(nombre)
```
*(Nota: Hibernate no modela índices parciales; otra razón para migrar a Flyway, H3.)*

#### H6. Nomenclatura inconsistente y nombres generados por Hibernate
- Mezcla español/inglés **dentro de la misma tabla**: `intento_acceso` tenía `exito` (español), `message` (inglés) y `acceso_date` (híbrido). El reto pedía explícitamente *"Usar nombres de campos en inglés"*, pero el proyecto decidió unificar **a español** (decisión del 2026-09-03).
- Constraints con nombres de hash sin sentido (`uk7316o5l539qjngk19733jdgxm`, `fk1dvvcamb3oxb2d9xqd9taug0u`) ilegibles en logs y errores de integridad.
- Redundancia conceptual: `activo` + `acceso_permitido` en `empleados` es defendible (existencia vs. autorización), pero debe documentarse; en `intento_acceso.exito` vs `historial_acceso.acceso_permitido` se duplica el mismo concepto con nombres distintos.

**Resolución (2026-09-03):** unificación a español aplicada extremo a extremo — BD (`message`→`mensaje`, `acceso_date`→`fecha_acceso`), entidades, DTOs (`LoginRequestDTO.username/password`→`usuario/contrasena`, `AccessAttemptDTO.message`→`mensaje`, `DepartamentoResponseDTO.empleadosCount`→`cantidadEmpleados`), frontend (tipos, servicios y páginas) y constraints legibles (`unico_*`, `indice_*`, `fecha_acceso_not_null`). Se conserva `token` (término técnico estándar del header `Authorization`).

#### H7. `timestamp without time zone` en toda la BD
Para un sistema de **auditoría de acceso físico** (y en farmacéutica sujeto a BPF/GxP), la zona horaria importa: el servidor, la BD y el lector deben ser comparables. `LocalDateTime` + `timestamp` descarta la zona silenciosamente.

**Recomendación:** migrar las columnas temporales a `timestamptz` (y en Java, `Instant`/`OffsetDateTime`), o como mínimo fijar y documentar `UTC` en `application.properties` (`hibernate.jdbc.time_zone=UTC`).

---

### 🟡 Menores

#### H8. Backup y script de merge desalineados / obsoletos
`backup_reto_room_911.sql` contiene tablas muertas (`admin_users`, `visitantes` — esta última además con su feature recién eliminada del código según el git status) y un esquema antiguo de `administradores`/`departamentos`. Cualquier restauración romperá el backend. Regenerar el dump desde la BD viva tras aplicar las migraciones, y documentar cuál es el artefacto canónico.

#### H9. FKs sin política ON DELETE explícita
Todas las FKs quedan en `NO ACTION` por defecto. Con borrado lógico es correcto, pero conviene declararlo explícito (`ON DELETE RESTRICT`) para que la intención sea contractual y no accidental. Un borrado duro de departamento con empleados hoy fallaría con un error críptico de nombre hash.

#### H10. `fecha_actualizacion` mantenida a mano
Se setea manualmente en cada `ServiceImpl`. Funciona, pero es frágil (cualquier nuevo camino de escritura lo olvida). Usar `@PreUpdate`/`@UpdateTimestamp` (o auditoría JPA `@EnableJpaAuditing` con `@LastModifiedDate`) para garantizarlo a nivel de persistencia.

#### H11. `auditoria` sin datos y sin retención definida
La tabla de auditoría (0 filas) es el insumo de trazabilidad BPF; verificar que los servicios de escritura la alimenten realmente. Además, `intento_acceso` y `auditoria` crecerán sin límite: definir partición por mes o política de archivado, y `descripcion`/`message` podrían ser `text` con límite validado.

#### H12. Calidad de datos de prueba
Datos basura en producción de prueba (`'lo que sea'`, `'LO QUE QUIERA'`, títulos mezclados con nombres: `nombre='Dr. Julián'`). Recomendar limpieza + separar título/nombre si se quiere formalidad, y validar en los DTOs de carga masiva CSV (que hoy admite cualquier cosa en `nombre` y `cargo`).

---

## 3. Evaluación de normalización

| Forma normal | Estado | Comentario |
|---|---|---|
| 1NF | ✅ Cumple estructuralmente | Sin grupos repetidos ni columnas multivaluadas… **excepto** la sobrecarga de `message` (H1), que es una violación semántica. |
| 2NF | ✅ Cumple | Todas las tablas tienen PK simple; no hay dependencias parciales. |
| 3NF | ⚠️ Cumple con excepciones de dominio | No hay dependencias transitivas graves. `cargo` como texto libre y `departamentos.responsable` (texto) junto a `administrador_id` (FK a la persona responsable real) son candidatos a catálogo/FK para eliminar redundancia e inconsistencia. |

**Conclusión:** la estructura general está razonablemente normalizada (sin desnormalizar ni sobre-fragmentar). Las oportunidades reales no son de formas normales sino de **integridad de dominio (catálogos y CHECKs), índices y gestión del esquema**.

---

## 4. Plan de acción propuesto (orden recomendado)

> **Estado (2026-09-03):** ejecutados los pasos **1, 2, 4, 6 y 8** sobre la BD viva y el código
> (ver "Ejecución" al final del documento). Pendientes 3, 5, 7 y 9.

| # | Acción | Hallazgo | Riesgo de aplicar | Esfuerzo |
|---|---|---|---|---|
| 1 | ✅ Crear `documento_intentado` en `intento_acceso` y poblar desde `AccessServiceImpl` | H1 | Bajo | Bajo |
| 2 | ✅ Crear los 8 índices secundarios | H2 | Muy bajo | Bajo |
| 3 | Introducir Flyway con `V1__baseline` y fijar `ddl-auto=validate` | H3 | Medio (requiere probar arranque limpio) | Medio |
| 4 | ✅ Índices únicos parciales `WHERE activo` | H5 | Bajo | Bajo |
| 5 | CHECKs de dominio + catálogo `cargos` (y roles) | H4 | Bajo | Medio |
| 6 | ✅ Nomenclatura unificada a español + constraints legibles | H6 | Medio (toca entidades + DTOs + frontend) | Medio |
| 7 | Migrar a `timestamptz` / fijar UTC | H7 | Medio | Medio |
| 8 | ✅ Regenerar dump y marcar el merge script como deprecado | H8 | Nulo | Bajo |
| 9 | `@UpdateTimestamp` para `fecha_actualizacion` | H10 | Nulo | Bajo |

Los pasos 1, 2, 4 y 8 son seguros, incrementales y no rompen contrato API (el paso 1 **agrega** un campo; revisar el DTO/interfaz TS si se expone).

### Ejecución (2026-09-03)

- **H1:** columna `documento_intentado varchar(20)` agregada a `intento_acceso` (con backfill de los 14 intentos existentes desde `message` y `empleados.documento`), mapeada en `AccessAttempt` y poblada en `AccessServiceImpl.guardarIntento()`, `AccessAttemptServiceImpl.save()` y las semillas de `DataInitializer`.
- **H2:** 8 índices secundarios creados (`indice_intento_acceso_empleado`, `indice_intento_acceso_fecha`, `indice_intento_acceso_empleado_fecha`, `indice_historial_acceso_empleado`, `indice_empleados_departamento`, `indice_auditoria_administrador`, `indice_empleados_nombre`, `indice_empleados_apellido`) y declarados en los `@Table` de las entidades para instalaciones frescas.
- **H5:** 5 constraints únicas globales con nombre hash eliminadas y reemplazadas por índices únicos parciales `unico_* ... WHERE activo`. La validación de duplicados en `EmpleadoServiceImpl`, `AdministradorServiceImpl` y `DepartamentoServiceImpl` pasó a usar `existsBy*AndActivoTrue`, consistente con el nuevo esquema.
- **H8:** `backup_reto_room_911.sql` regenerado desde la BD corregida; `db/merge_backup_reto_room_911.sql` marcado como obsoleto.
- **H6:** unificación a español extremo a extremo: columnas `intento_acceso.message`→`mensaje` y `acceso_date`→`fecha_acceso`; DTOs y contrato JSON (`mensaje`, `usuario`, `contrasena`, `cantidadEmpleados`); frontend (auth, accesos, dashboard, departamentos, administradores y simulador) actualizado en consecuencia, con compatibilidad de lectura para sesiones previas guardadas en localStorage. Se conserva `token` como término técnico estándar.
- Script aplicado y reproducible: `db/v2_arreglos_seguros.sql` (idempotente).
- Compilación verificada: `./mvnw compile` OK (JDK 17). Frontend sin cambios.

---

## 5. Qué está bien (para no romperlo)

- Identidades `GENERATED BY DEFAULT AS IDENTITY` (estándar moderno de PG, correcto).
- Contraseñas con BCrypt ($2a$10$) en semillas.
- Borrado lógico consistente en todas las maestras.
- FK obligatoria `empleados.departamento_id NOT NULL` — coherente con R2.
- `intento_acceso.empleado_id` nullable — coherente con R5 para no registrados.
- Variables de entorno con defaults y `.env` fuera del control de versiones (solo `.env.example` está commiteado).
- Credenciales por defecto de la BD cambiadas en el entorno real (no se usa `postgres_password` del compose).
