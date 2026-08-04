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
            TO_CHAR(acceso_date, 'Dy') AS dia,
            COUNT(*) AS cantidad
        FROM intento_acceso
        WHERE acceso_date >= :inicio
        GROUP BY TO_CHAR(acceso_date, 'Dy')
        ORDER BY MIN(acceso_date)
        """, nativeQuery = true)
    List<Object[]> obtenerAccesosUltimos7Dias(
            @Param("inicio") LocalDateTime inicio
    );

}