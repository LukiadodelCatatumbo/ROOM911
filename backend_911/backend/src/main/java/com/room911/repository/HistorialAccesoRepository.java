package com.room911.repository;


import com.room911.entity.HistorialAcceso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistorialAccesoRepository  extends JpaRepository<HistorialAcceso, Long> {
    /**
     * Permite consultar el historial de un empleado
     */
    List<HistorialAcceso> findByEmpleadoId(Long empleadoId);
}
