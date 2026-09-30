package com.room911.repository;


import com.room911.entity.HistorialAcceso;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HistorialAccesoRepository  extends JpaRepository<HistorialAcceso, Long> {
    // EntityGraph: evita N+1 al hidratar empleado y su departamento en los mapeos a DTO
    @Override
    @EntityGraph(attributePaths = {"empleado", "empleado.departamento"})
    List<HistorialAcceso> findAll();

    /**
     * Permite consultar el historial de un empleado
     */
    @EntityGraph(attributePaths = {"empleado", "empleado.departamento"})
    List<HistorialAcceso> findByEmpleadoId(Long empleadoId);

    /** Anti-passback: ¿tiene el empleado un ingreso sin salida registrada? */
    boolean existsByEmpleadoIdAndFechaSalidaIsNull(Long empleadoId);

    @Override
    @EntityGraph(attributePaths = {"empleado", "empleado.departamento"})
    Optional<HistorialAcceso> findById(Long id);

    /**
     * Personas dentro de la planta: ingresos sin salida registrada
     */
    long countByFechaSalidaIsNull();
}
