package com.room911.repository;

import com.room911.dto.AccesosSemanaDTO;
import com.room911.entity.AccessAttempt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccessAttemptRepository extends JpaRepository<AccessAttempt, Long> {

    // EntityGraph: evita N+1 al hidratar empleado y su departamento en los mapeos a DTO
    @Override
    @EntityGraph(attributePaths = {"empleado", "empleado.departamento"})
    List<AccessAttempt> findAll();

    /**
     * Listado paginado con filtros opcionales (paginación de servidor).
     * Los joins LEFT son para el filtro de texto; el grafo hidrata el mapper.
     * patron siempre llega con '%' como comodín (y '%' si no hay texto: LIKE
     * sobre todo). Los filtros opcionales usan COALESCE(:param, columna) en
     * vez de ":param IS NULL" porque PostgreSQL no puede inferir el tipo de
     * un parámetro sin contexto (falla con "could not determine data type").
     */
    @EntityGraph(attributePaths = {"empleado", "empleado.departamento"})
    @Query("""
        SELECT a FROM AccessAttempt a
        LEFT JOIN a.empleado e
        LEFT JOIN e.departamento d
        WHERE a.exito = COALESCE(:exito, a.exito)
        AND a.fechaAcceso >= COALESCE(:desde, a.fechaAcceso)
        AND a.fechaAcceso <= COALESCE(:hasta, a.fechaAcceso)
        AND (LOWER(COALESCE(a.mensaje, '')) LIKE LOWER(:patron)
             OR LOWER(COALESCE(a.documentoIntentado, '')) LIKE LOWER(:patron)
             OR LOWER(COALESCE(e.nombre, '')) LIKE LOWER(:patron)
             OR LOWER(COALESCE(e.apellido, '')) LIKE LOWER(:patron)
             OR LOWER(COALESCE(e.documento, '')) LIKE LOWER(:patron)
             OR LOWER(COALESCE(d.nombre, '')) LIKE LOWER(:patron))
        """)
    Page<AccessAttempt> buscarConFiltros(
            @Param("exito") Boolean exito,
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta,
            @Param("patron") String patron,
            Pageable pageable
    );

    @Override
    @EntityGraph(attributePaths = {"empleado", "empleado.departamento"})
    Optional<AccessAttempt> findById(Long id);

    @EntityGraph(attributePaths = {"empleado", "empleado.departamento"})
    List<AccessAttempt> findByEmpleadoId(Long empleadoId);

    @EntityGraph(attributePaths = {"empleado", "empleado.departamento"})
    List<AccessAttempt> findByEmpleadoIdAndFechaAccesoBetween(
            Long empleadoId,
            LocalDateTime inicio,
            LocalDateTime fin
    );

    @EntityGraph(attributePaths = {"empleado", "empleado.departamento"})
    List<AccessAttempt> findTop10ByOrderByFechaAccesoDesc();

    long countByFechaAccesoBetween(
            LocalDateTime inicio,
            LocalDateTime fin
    );

    @Query("""
        SELECT COUNT(a)
        FROM AccessAttempt a
        WHERE a.exito = :exito
        AND a.fechaAcceso BETWEEN :inicio AND :fin
    """)
    long countByExitoAndFechaAccesoBetween(
            @Param("exito") boolean exito,
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin
    );

    @Query(value = """
        SELECT
            TO_CHAR(fecha_acceso, 'Dy') AS dia,
            SUM(CASE WHEN exito = true THEN 1 ELSE 0 END) AS concedidos,
            SUM(CASE WHEN exito = false THEN 1 ELSE 0 END) AS denegados
        FROM intento_acceso
        WHERE fecha_acceso >= :inicio
        GROUP BY TO_CHAR(fecha_acceso, 'Dy')
        ORDER BY MIN(fecha_acceso)
        """, nativeQuery = true)
    List<Object[]> obtenerAccesosUltimos7Dias(
            @Param("inicio") LocalDateTime inicio
    );

}