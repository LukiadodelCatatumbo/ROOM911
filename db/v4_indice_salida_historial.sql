-- ============================================================================
-- Fase 26 — Índice sobre historial_acceso.date_time_salida
-- ============================================================================
-- Objetivo: countByFechaSalidaIsNull (aforo del dashboard, se consulta en cada
-- actualización del panel) y la nueva lista /historial-acceso/en-planta
-- filtran por `date_time_salida IS NULL`. En PostgreSQL un índice b-tree
-- también sirve para IS NULL; sin él ambas consultas son full scan.
--
-- Idempotente. El backend también declara el índice vía @Index
-- (HistorialAcceso), pero ddl-auto=update no siempre lo crea en bases
-- existentes, por eso esta migración manual.
--
-- Ejecutar con:
--   psql "$DB_URL" -f db/v4_indice_salida_historial.sql
-- ============================================================================

CREATE INDEX IF NOT EXISTS indice_historial_acceso_salida
    ON historial_acceso (date_time_salida);
