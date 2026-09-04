-- ============================================================================
-- v2_arreglos_seguros.sql — Auditoría BD ROOM911 (2026-09-03)
-- Aplica los hallazgos H1, H2 y H5 de AUDITORIA_BASE_DE_DATOS.md:
--   H1: columna documento_intentado en intento_acceso (+ backfill)
--   H2: índices secundarios para las consultas del reto
--   H5: índices únicos parciales (WHERE activo) compatibles con borrado lógico
--
-- Idempotente: se puede ejecutar varias veces.
-- Requisito tras cada arranque limpio de BD (mientras no exista Flyway):
--   psql -h 127.0.0.1 -U postgres -d reto_room_911 -f db/v2_arreglos_seguros.sql
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- H1: documento_intentado — credencial leída por el lector, registrada o no
-- ---------------------------------------------------------------------------
ALTER TABLE intento_acceso
    ADD COLUMN IF NOT EXISTS documento_intentado varchar(20);

-- Backfill: intentos de empleados no registrados (el documento quedó
-- concatenado en mensaje: "Empleado no registrado (1020304050)")
UPDATE intento_acceso
SET documento_intentado = substring(mensaje from '\(([^)]*)\)$')
WHERE documento_intentado IS NULL
  AND mensaje LIKE 'Empleado no registrado (%)';

-- Backfill: intentos de empleados registrados
UPDATE intento_acceso i
SET documento_intentado = e.documento
FROM empleados e
WHERE i.empleado_id = e.id
  AND i.documento_intentado IS NULL;

-- ---------------------------------------------------------------------------
-- H2: índices secundarios (PostgreSQL no indexa FKs automáticamente)
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS indice_intento_acceso_empleado
    ON intento_acceso (empleado_id);
CREATE INDEX IF NOT EXISTS indice_intento_acceso_fecha
    ON intento_acceso (fecha_acceso);
-- Cubre el histórico por empleado filtrado por rango de fechas (requisito 6)
CREATE INDEX IF NOT EXISTS indice_intento_acceso_empleado_fecha
    ON intento_acceso (empleado_id, fecha_acceso);
CREATE INDEX IF NOT EXISTS indice_historial_acceso_empleado
    ON historial_acceso (empleado_id);
CREATE INDEX IF NOT EXISTS indice_empleados_departamento
    ON empleados (departamento_id);
CREATE INDEX IF NOT EXISTS indice_auditoria_administrador
    ON auditoria (administrador_id);
CREATE INDEX IF NOT EXISTS indice_empleados_nombre
    ON empleados (nombre);
CREATE INDEX IF NOT EXISTS indice_empleados_apellido
    ON empleados (apellido);

-- ---------------------------------------------------------------------------
-- H5: únicos parciales — solo entre filas activas, para no bloquear el
-- re-registro de documentos/correos de registros desactivados lógicamente
-- ---------------------------------------------------------------------------

-- empleados.documento
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint
               WHERE conname = 'uk5l7j8378rxvcv2yq3kic8f17i'
                 AND conrelid = 'empleados'::regclass) THEN
        ALTER TABLE empleados DROP CONSTRAINT uk5l7j8378rxvcv2yq3kic8f17i;
    END IF;
END $$;

-- empleados.correo
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint
               WHERE conname = 'ukh1yoynfig4dn2d3vff3luwyj'
                 AND conrelid = 'empleados'::regclass) THEN
        ALTER TABLE empleados DROP CONSTRAINT ukh1yoynfig4dn2d3vff3luwyj;
    END IF;
END $$;

-- administradores.usuario
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint
               WHERE conname = 'uk7tuduhy89ravpc4ejxkwj0p1q'
                 AND conrelid = 'administradores'::regclass) THEN
        ALTER TABLE administradores DROP CONSTRAINT uk7tuduhy89ravpc4ejxkwj0p1q;
    END IF;
END $$;

-- administradores.correo
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint
               WHERE conname = 'uk7316o5l539qjngk19733jdgxm'
                 AND conrelid = 'administradores'::regclass) THEN
        ALTER TABLE administradores DROP CONSTRAINT uk7316o5l539qjngk19733jdgxm;
    END IF;
END $$;

-- departamentos.nombre
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint
               WHERE conname = 'uk9vfgma390a16fkev3ryhnyrvh'
                 AND conrelid = 'departamentos'::regclass) THEN
        ALTER TABLE departamentos DROP CONSTRAINT uk9vfgma390a16fkev3ryhnyrvh;
    END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS unico_empleados_documento
    ON empleados (documento) WHERE activo;
CREATE UNIQUE INDEX IF NOT EXISTS unico_empleados_correo
    ON empleados (correo) WHERE activo;
CREATE UNIQUE INDEX IF NOT EXISTS unico_administradores_usuario
    ON administradores (usuario) WHERE activo;
CREATE UNIQUE INDEX IF NOT EXISTS unico_administradores_correo
    ON administradores (correo) WHERE activo;
CREATE UNIQUE INDEX IF NOT EXISTS unico_departamentos_nombre
    ON departamentos (nombre) WHERE activo;

COMMIT;

-- Verificación rápida
SELECT indexname FROM pg_indexes
WHERE schemaname = 'public'
  AND (indexname LIKE 'unico_%' OR indexname LIKE 'indice_%')
ORDER BY indexname;
