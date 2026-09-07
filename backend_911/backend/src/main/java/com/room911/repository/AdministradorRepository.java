package com.room911.repository;

import com.room911.entity.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Long> {
    Optional<Administrador> findByUsuario(String usuario);
    Optional<Administrador> findByCorreo(String correo);

    // Unicidad solo entre filas activas (índices únicos parciales WHERE activo)
    boolean existsByUsuarioAndActivoTrue(String usuario);
    boolean existsByCorreoAndActivoTrue(String correo);

    long countByRolAndActivoTrue(String rol);
}

