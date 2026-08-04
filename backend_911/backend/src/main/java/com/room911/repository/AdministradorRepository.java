package com.room911.repository;

import com.room911.entity.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Long> {
    Optional<Administrador> findByUsuario(String usuario);
    Optional<Administrador> findByCorreo(String correo);
    boolean existsByUsuario(String usuario);
    boolean existsByCorreo(String correo);
}

