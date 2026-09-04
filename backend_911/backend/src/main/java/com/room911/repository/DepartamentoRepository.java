package com.room911.repository;

import com.room911.entity.Departamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartamentoRepository extends JpaRepository<Departamento, Long> {
    Optional<Departamento> findByNombre(String nombre);

    // Unicidad solo entre filas activas (índice único parcial WHERE activo)
    boolean existsByNombreAndActivoTrue(String nombre);
}
