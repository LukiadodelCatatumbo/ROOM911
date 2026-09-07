package com.room911.service.impl;

import com.room911.dto.AdministradorDTO;
import com.room911.entity.Administrador;
import com.room911.repository.AdministradorRepository;
import com.room911.service.interfaces.AdministradorService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdministradorServiceImpl implements AdministradorService {

    public static final String ROL_POR_DEFECTO = "ADMIN_ACCESOS";
    private static final Set<String> ROLES_VALIDOS = Set.of("SUPER_ADMIN", "ADMIN_ACCESOS", "ADMIN_SISTEMAS");

    private final AdministradorRepository administradorRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public Administrador guardar(AdministradorDTO dto) {
        // La contraseña es obligatoria solo al crear (en PUT es opcional)
        if (dto.getContrasena() == null || dto.getContrasena().isBlank()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }

        if (administradorRepository.existsByUsuarioAndActivoTrue(dto.getUsuario())) {
            throw new RuntimeException("El usuario ya existe");
        }

        if (administradorRepository.existsByCorreoAndActivoTrue(dto.getCorreo())) {
            throw new RuntimeException("El correo ya existe");
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
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
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
                && "SUPER_ADMIN".equals(administrador.getRol())
                && administradorRepository.countByRolAndActivoTrue("SUPER_ADMIN") <= 1) {
            throw new RuntimeException("No se puede inhabilitar al último SUPER_ADMIN activo");
        }

        administrador.setActivo(false);
        administrador.setFechaActualizacion(LocalDateTime.now());
        administradorRepository.save(administrador);
    }

    private String normalizarRol(String rol) {
        if (rol == null || rol.isBlank()) {
            return ROL_POR_DEFECTO;
        }
        String rolNormalizado = rol.trim().toUpperCase();
        if (!ROLES_VALIDOS.contains(rolNormalizado)) {
            throw new IllegalArgumentException("Rol no válido: " + rol);
        }
        return rolNormalizado;
    }
}
