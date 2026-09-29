-- ============================================================================
-- Fase 20 — Renombrado de columnas de fecha/timestamp
-- ============================================================================
-- Objetivo (decisión del responsable): todas las columnas de tipo timestamp
-- pasan a nombrarse con el prefijo `date_time_` en lugar de `fecha_`.
-- El TIPO de datos NO cambia (timestamp without time zone; en PostgreSQL el
-- tipo `datetime` de MySQL no existe).
--
-- Mapeo:
--   *_fecha_creacion        -> *_date_time_creacion
--   *_fecha_actualizacion   -> *_date_time_actualizacion
--   auditoria.fecha         -> auditoria.date_time
--   historial_acceso.fecha_ingreso -> historial_acceso.date_time_ingreso
--   historial_acceso.fecha_salida  -> historial_acceso.date_time_salida
--   intento_acceso.fecha_acceso    -> intento_acceso.date_time_acceso
--
-- Idempotente: solo renombra si la columna vieja existe y la nueva no.
-- Los índices que referencian las columnas son actualizados automáticamente
-- por PostgreSQL al renombrar (su definición sigue la columna).
-- Ejecutar ANTES de arrancar el backend actualizado:
--   psql "$DB_URL" -f db/v3_renombrado_columnas_fecha.sql
-- ============================================================================

DO $$
DECLARE
    renombre RECORD;
BEGIN
    FOR renombre IN
        SELECT table_name, column_name,
               CASE
                   WHEN column_name = 'fecha' THEN 'date_time'
                   WHEN column_name LIKE 'fecha\_%'
                        THEN 'date_time_' || substring(column_name from 7)
                   ELSE column_name
               END AS nuevo_nombre
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND data_type LIKE 'timestamp%'
          AND (column_name = 'fecha' OR column_name LIKE 'fecha\_%')
    LOOP
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = renombre.table_name
              AND column_name = renombre.nuevo_nombre
        ) THEN
            EXECUTE format(
                'ALTER TABLE public.%I RENAME COLUMN %I TO %I',
                renombre.table_name, renombre.column_name, renombre.nuevo_nombre);
            RAISE NOTICE 'Renombrada %.% -> %', renombre.table_name,
                         renombre.column_name, renombre.nuevo_nombre;
        END IF;
    END LOOP;
END $$;

-- ----------------------------------------------------------------------------
-- Backfill defensivo de rol: el enum Rol (Fase 21) no admite NULL ni textos
-- fuera de {SUPER_ADMIN, ADMIN_ACCESOS, ADMIN_SISTEMAS}. Cualquier fila legacy
-- sin rol recibe el rol por defecto y el casing se normaliza.
-- ----------------------------------------------------------------------------
UPDATE public.administradores
SET rol = UPPER(TRIM(rol))
WHERE rol IS NOT NULL AND UPPER(TRIM(rol)) <> rol;

UPDATE public.administradores
SET rol = 'ADMIN_ACCESOS'
WHERE rol IS NULL OR TRIM(rol) = '';

