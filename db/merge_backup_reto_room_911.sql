-- Combina los datos de backup_reto_room_911.sql con la base actual.
-- Ejecutar con:
--   psql -h localhost -p 5432 -U postgres -d reto_room_911 \
--     -v ON_ERROR_STOP=1 -f db/merge_backup_reto_room_911.sql
--
-- La migracion es aditiva: conserva los registros actuales y evita duplicados
-- usando las claves naturales disponibles en el modelo de ROOM911.

\set ON_ERROR_STOP on

BEGIN;

CREATE TEMP TABLE _room911_source_departamentos (
    nombre varchar(100) NOT NULL,
    descripcion varchar(255),
    activo boolean NOT NULL,
    fecha_creacion timestamp without time zone NOT NULL,
    fecha_actualizacion timestamp without time zone
) ON COMMIT DROP;

INSERT INTO _room911_source_departamentos
    (nombre, descripcion, activo, fecha_creacion, fecha_actualizacion)
VALUES
    ('Producción', 'Líneas de manufactura y envasado estéril', true, '2026-08-26 09:18:17.55253', NULL),
    ('Control de Calidad', 'Laboratorios de microbiología y físico-química', true, '2026-08-26 09:18:17.552572', NULL),
    ('Investigación y Desarrollo', 'Área de bioseguridad y formulación avanzada', true, '2026-08-26 09:18:17.552594', NULL),
    ('Almacén y Logística', 'Muelle de carga y bodega de materias primas', true, '2026-08-26 09:18:17.552612', NULL),
    ('Administración', 'Gerencia de planta y oficinas corporativas', true, '2026-08-26 09:18:17.552629', NULL),
    ('Recursos Humanos', 'Talento humano, bienestar y capacitación', true, '2026-08-26 09:18:17.552646', NULL);

INSERT INTO departamentos
    (nombre, descripcion, activo, fecha_creacion, fecha_actualizacion)
SELECT s.nombre, s.descripcion, s.activo, s.fecha_creacion, s.fecha_actualizacion
FROM _room911_source_departamentos s
WHERE NOT EXISTS (
    SELECT 1 FROM departamentos d WHERE d.nombre = s.nombre
);

CREATE TEMP TABLE _room911_source_administradores (
    nombre varchar(100) NOT NULL,
    apellido varchar(100) NOT NULL,
    correo varchar(255) NOT NULL,
    usuario varchar(100) NOT NULL,
    contrasena varchar(255) NOT NULL,
    activo boolean NOT NULL,
    fecha_creacion timestamp without time zone NOT NULL,
    fecha_actualizacion timestamp without time zone
) ON COMMIT DROP;

INSERT INTO _room911_source_administradores
    (nombre, apellido, correo, usuario, contrasena, activo, fecha_creacion, fecha_actualizacion)
VALUES
    ('Super', 'Administrador', 'superadmin@pharma911.com', 'superadmin', '$2a$10$1zRWJV0zTwihdd.37i5phuwQoVUaZ/eT9KfSifidipF9vHaSCc9Xq', true, '2026-08-26 09:18:17.91202', NULL),
    ('Dr. Jorge', 'Reyes Montoya', 'j.reyes@pharma911.com', 'j.reyes', '$2a$10$sBNA2BWrPrivr2T84qsRfuC97MHrdBdV4lWITeNR1M2xbz4ZLBvBC', true, '2026-08-26 09:18:18.004444', NULL),
    ('Ing. Andrea', 'Sánchez', 'a.sanchez@pharma911.com', 'a.sanchez', '$2a$10$wHdmDfOyldId4H/7hlVKPOo/EXqcc3KwrmWaSPqT684QsDSMr4ece', true, '2026-08-26 09:18:18.099439', NULL);

INSERT INTO administradores
    (nombre, apellido, correo, usuario, contrasena, activo, fecha_creacion, fecha_actualizacion)
SELECT s.nombre, s.apellido, s.correo, s.usuario, s.contrasena,
       s.activo, s.fecha_creacion, s.fecha_actualizacion
FROM _room911_source_administradores s
WHERE NOT EXISTS (
    SELECT 1
    FROM administradores a
    WHERE a.correo = s.correo OR a.usuario = s.usuario
);

CREATE TEMP TABLE _room911_source_empleados (
    nombre varchar(100) NOT NULL,
    apellido varchar(100) NOT NULL,
    documento varchar(20) NOT NULL,
    correo varchar(255) NOT NULL,
    cargo varchar(100) NOT NULL,
    departamento_nombre varchar(100) NOT NULL,
    activo boolean NOT NULL,
    acceso_permitido boolean NOT NULL,
    fecha_creacion timestamp without time zone NOT NULL,
    fecha_actualizacion timestamp without time zone
) ON COMMIT DROP;

INSERT INTO _room911_source_empleados
    (nombre, apellido, documento, correo, cargo, departamento_nombre,
     activo, acceso_permitido, fecha_creacion, fecha_actualizacion)
VALUES
    ('Carlos', 'Mendoza', '1020304050', 'c.mendoza@pharma911.com', 'Operador de Envasado Estéril', 'Producción', true, true, '2026-07-27 09:18:18.319958', NULL),
    ('Dra. Elena', 'Ramos', '2030405060', 'e.ramos@pharma911.com', 'Analista Microbiológica Senior', 'Control de Calidad', true, true, '2026-08-01 09:18:18.320058', NULL),
    ('Dr. Julián', 'Castro', '3040506070', 'j.castro@pharma911.com', 'Especialista en Bioseguridad N3', 'Investigación y Desarrollo', true, true, '2026-08-06 09:18:18.320085', NULL),
    ('Martín', 'Morales', '4050607080', 'm.morales@pharma911.com', 'Supervisor de Recepción', 'Almacén y Logística', true, true, '2026-08-11 09:18:18.320108', NULL),
    ('Diana', 'Valencia', '5060708090', 'd.valencia@pharma911.com', 'Coordinadora de Auditoría BPF', 'Administración', true, true, '2026-08-16 09:18:18.320128', NULL),
    ('Laura', 'Gómez', '6070809010', 'l.gomez@pharma911.com', 'Técnica de Muestreo', 'Control de Calidad', false, false, '2026-08-18 09:18:18.320148', NULL),
    ('Andrés', 'Pineda', '7080901020', 'a.pineda@pharma911.com', 'Técnico de Mantenimiento Electromecánico', 'Producción', true, true, '2026-08-21 09:18:18.320168', NULL),
    ('Sofía', 'Herrera', '8090102030', 's.herrera@pharma911.com', 'Especialista en Capacitación BPF', 'Recursos Humanos', true, true, '2026-08-23 09:18:18.320189', NULL);

INSERT INTO empleados
    (nombre, apellido, documento, correo, cargo, departamento_id,
     activo, acceso_permitido, fecha_creacion, fecha_actualizacion)
SELECT s.nombre, s.apellido, s.documento, s.correo, s.cargo, d.id,
       s.activo, s.acceso_permitido, s.fecha_creacion, s.fecha_actualizacion
FROM _room911_source_empleados s
JOIN departamentos d ON d.nombre = s.departamento_nombre
WHERE NOT EXISTS (
    SELECT 1
    FROM empleados e
    WHERE e.documento = s.documento OR e.correo = s.correo
);

CREATE TEMP TABLE _room911_source_intentos (
    exito boolean NOT NULL,
    acceso_date timestamp without time zone NOT NULL,
    message varchar(255),
    empleado_documento varchar(20) NOT NULL
) ON COMMIT DROP;

INSERT INTO _room911_source_intentos
    (exito, acceso_date, message, empleado_documento)
VALUES
    (true, '2026-08-26 05:18:18.454832', 'Acceso autorizado: Esclusa 1 Producción A', '1020304050'),
    (true, '2026-08-26 06:18:18.454892', 'Acceso autorizado: Lector Biométrico Lab QC', '2030405060'),
    (false, '2026-08-26 07:18:18.454916', 'Acceso denegado: Credencial inactiva en sistema', '6070809010'),
    (true, '2026-08-26 08:18:18.454938', 'Acceso autorizado: Lab B-2 Bioequivalencia', '3040506070'),
    (true, '2026-08-26 08:33:18.454958', 'Acceso autorizado: Torniquete Muelle de Carga', '4050607080'),
    (true, '2026-08-26 08:58:18.454984', 'Acceso autorizado: Torniquete Entrada Principal', '1020304050'),
    (true, '2026-08-25 09:18:18.455024', 'Acceso autorizado: Entrada Principal', '5060708090'),
    (true, '2026-08-24 09:18:18.455043', 'Acceso autorizado: Lab QC', '2030405060'),
    (true, '2026-08-23 09:18:18.455062', 'Acceso autorizado: Lab B-2', '3040506070');

INSERT INTO intento_acceso
    (exito, acceso_date, message, empleado_id)
SELECT s.exito, s.acceso_date, s.message, e.id
FROM _room911_source_intentos s
JOIN empleados e ON e.documento = s.empleado_documento
WHERE NOT EXISTS (
    SELECT 1
    FROM intento_acceso i
    WHERE i.exito = s.exito
      AND i.acceso_date = s.acceso_date
      AND i.message IS NOT DISTINCT FROM s.message
      AND i.empleado_id = e.id
);

-- El backup no contiene filas de admin_users, auditoria, historial_acceso ni
-- visitantes; se conservan intactas las filas que ya existan en esas tablas.

SELECT setval(pg_get_serial_sequence('admin_users', 'id'),
              GREATEST(COALESCE(MAX(id), 1), 1), COUNT(*) > 0)
FROM admin_users;
SELECT setval(pg_get_serial_sequence('administradores', 'id'),
              GREATEST(COALESCE(MAX(id), 1), 1), COUNT(*) > 0)
FROM administradores;
SELECT setval(pg_get_serial_sequence('auditoria', 'id'),
              GREATEST(COALESCE(MAX(id), 1), 1), COUNT(*) > 0)
FROM auditoria;
SELECT setval(pg_get_serial_sequence('departamentos', 'id'),
              GREATEST(COALESCE(MAX(id), 1), 1), COUNT(*) > 0)
FROM departamentos;
SELECT setval(pg_get_serial_sequence('empleados', 'id'),
              GREATEST(COALESCE(MAX(id), 1), 1), COUNT(*) > 0)
FROM empleados;
SELECT setval(pg_get_serial_sequence('historial_acceso', 'id'),
              GREATEST(COALESCE(MAX(id), 1), 1), COUNT(*) > 0)
FROM historial_acceso;
SELECT setval(pg_get_serial_sequence('intento_acceso', 'id'),
              GREATEST(COALESCE(MAX(id), 1), 1), COUNT(*) > 0)
FROM intento_acceso;
SELECT setval(pg_get_serial_sequence('visitantes', 'id'),
              GREATEST(COALESCE(MAX(id), 1), 1), COUNT(*) > 0)
FROM visitantes;

COMMIT;

SELECT 'admin_users' AS tabla, COUNT(*) AS registros FROM admin_users
UNION ALL SELECT 'administradores', COUNT(*) FROM administradores
UNION ALL SELECT 'auditoria', COUNT(*) FROM auditoria
UNION ALL SELECT 'departamentos', COUNT(*) FROM departamentos
UNION ALL SELECT 'empleados', COUNT(*) FROM empleados
UNION ALL SELECT 'historial_acceso', COUNT(*) FROM historial_acceso
UNION ALL SELECT 'intento_acceso', COUNT(*) FROM intento_acceso
UNION ALL SELECT 'visitantes', COUNT(*) FROM visitantes
ORDER BY tabla;
