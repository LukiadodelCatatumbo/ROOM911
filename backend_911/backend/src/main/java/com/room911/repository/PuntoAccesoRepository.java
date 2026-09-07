package com.room911.repository;

import com.room911.entity.PuntoAcceso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PuntoAccesoRepository extends JpaRepository<PuntoAcceso, Long> {
    Optional<PuntoAcceso> findByCodigo(String codigo);

    Optional<PuntoAcceso> findByNombre(String nombre);

    List<PuntoAcceso> findAllByActivoTrueOrderByNombreAsc();
}
