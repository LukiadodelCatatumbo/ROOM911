package com.room911.service.impl;

import com.room911.dto.AdministradorDTO;
import com.room911.entity.Administrador;
import com.room911.entity.Rol;
import com.room911.exception.EstadoInvalidoException;
import com.room911.exception.RecursoDuplicadoException;
import com.room911.exception.RecursoNoEncontradoException;
import com.room911.repository.AdministradorRepository;
import com.room911.service.interfaces.AdministradorService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdministradorServiceImpl implements AdministradorService {

    public static final Rol ROL_POR_DEFECTO = Rol.ADMIN_ACCESOS;

    private final AdministradorRepository administradorRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public Administrador guardar(AdministradorDTO dto) {
        // La contraseña es obligatoria solo al crear (en PUT es opcional)
        if (dto.getContrasena() == null || dto.getContrasena().isBlank()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }

        if (administradorRepository.existsByUsuarioAndActivoTrue(dto.getUsuario())) {
            throw new RecursoDuplicadoException("El usuario ya existe");
        }

        if (administradorRepository.existsByCorreoAndActivoTrue(dto.getCorreo())) {
            throw new RecursoDuplicadoException("El correo ya existe");
        }
        Administrador administrador = Administrador.builder()
                .nombre(dto.getNombre())
                .apellido(dto.getApellido())
                .correo(dto.getCorreo())
                .usuario(dto.getUsuario())
                .contrasena(passwordEncoder.encode(dto.getContrasena()))
                .rol(normalizarRol(dto.getRol()))
                .activo(true)
                .fechaCreacion(LocalDateTime.now())
                .build();
        return administradorRepository.save(administrador);
    }

    @Override
    public List<Administrador> listar() {
        return administradorRepository.findAll();
    }

    @Override
    public Administrador buscarPorId(Long id) {
        return administradorRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Administrador no encontrado"));
    }

    @Override
    public Administrador actualizar(Long id, AdministradorDTO dto) {
        Administrador administrador = buscarPorId(id);

        administrador.setNombre(dto.getNombre());
        administrador.setApellido(dto.getApellido());
        administrador.setCorreo(dto.getCorreo());
        administrador.setUsuario(dto.getUsuario());
        if (dto.getContrasena() != null && !dto.getContrasena().isBlank()) {
            administrador.setContrasena(passwordEncoder.encode(dto.getContrasena()));
        }
        administrador.setRol(normalizarRol(dto.getRol()));
        administrador.setFechaActualizacion(LocalDateTime.now());
        return administradorRepository.save(administrador);
    }

    @Override
    public void eliminar (Long id){
        // Borrado lógico: se inhabilita la cuenta, nunca se borra físicamente
        // (la trazabilidad de auditoría exige conservar al administrador).
        Administrador administrador = buscarPorId(id);

        if (administrador.getActivo() != null && administrador.getActivo()
                && administrador.getRol() == Rol.SUPER_ADMIN
                && administradorRepository.countByRolAndActivoTrue(Rol.SUPER_ADMIN) <= 1) {
            throw new EstadoInvalidoException("No se puede inhabilitar al último SUPER_ADMIN activo");
        }

        administrador.setActivo(false);
        administrador.setFechaActualizacion(LocalDateTime.now());
        administradorRepository.save(administrador);
    }

    private Rol normalizarRol(String rol) {
        if (rol == null || rol.isBlank()) {
            return ROL_POR_DEFECTO;
        }
        try {
            return Rol.valueOf(rol.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Rol no válido: " + rol);
        }
    }
}
