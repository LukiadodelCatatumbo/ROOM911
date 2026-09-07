package com.room911.repository;

import com.room911.dto.AccesosSemanaDTO;
import com.room911.entity.AccessAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AccessAttemptRepository extends JpaRepository<AccessAttempt, Long> {

    List<AccessAttempt> findByEmpleadoId(Long empleadoId);

    List<AccessAttempt> findByEmpleadoIdAndFechaAccesoBetween(
            Long empleadoId,
            LocalDateTime inicio,
            LocalDateTime fin
    );

    long countByFechaAccesoBetween(
            LocalDateTime inicio,
            LocalDateTime fin
    );

    List<AccessAttempt> findTop10ByOrderByFechaAccesoDesc();

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