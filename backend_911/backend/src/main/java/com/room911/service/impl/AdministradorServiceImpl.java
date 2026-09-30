package com.room911.service.impl;

import com.room911.dto.AdministradorDTO;
import com.room911.entity.Administrador;
import com.room911.entity.Rol;
import com.room911.exception.EstadoInvalidoException;
import com.room911.exception.RecursoDuplicadoException;
import com.room911.exception.RecursoNoEncontradoException;
import com.room911.repository.AdministradorRepository;
import com.room911.service.interfaces.AuditoriaService;
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
    private final AuditoriaService auditoriaService;

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
                .contrasena(validarLongitudContrasena(dto.getContrasena()))
                .rol(normalizarRol(dto.getRol()))
                .activo(true)
                .fechaCreacion(LocalDateTime.now())
                .build();
        Administrador guardado = administradorRepository.save(administrador);
        auditoriaService.registrarOperacion("Crear administrador",
                "usuario=" + guardado.getUsuario() + ", rol=" + guardado.getRol());
        return guardado;
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

        // Misma unicidad que el alta: sin esto, un PUT puede duplicar el
        // usuario de otro admin (rompe login y atribución de auditoría).
        if (!administrador.getUsuario().equals(dto.getUsuario())
                && administradorRepository.existsByUsuarioAndActivoTrue(dto.getUsuario())) {
            throw new RecursoDuplicadoException("El usuario ya existe");
        }
        if (!administrador.getCorreo().equals(dto.getCorreo())
                && administradorRepository.existsByCorreoAndActivoTrue(dto.getCorreo())) {
            throw new RecursoDuplicadoException("El correo ya existe");
        }

        administrador.setNombre(dto.getNombre());
        administrador.setApellido(dto.getApellido());
        administrador.setCorreo(dto.getCorreo());
        administrador.setUsuario(dto.getUsuario());
        if (dto.getContrasena() != null && !dto.getContrasena().isBlank()) {
            administrador.setContrasena(validarLongitudContrasena(dto.getContrasena()));
        }

        // Misma protección que eliminar(): el sistema no puede quedarse sin
        // SUPER_ADMIN activo por una edición de rol.
        Rol nuevoRol = normalizarRol(dto.getRol());
        if (administrador.getActivo() != null && administrador.getActivo()
                && administrador.getRol() == Rol.SUPER_ADMIN
                && nuevoRol != Rol.SUPER_ADMIN
                && administradorRepository.countByRolAndActivoTrue(Rol.SUPER_ADMIN) <= 1) {
            throw new EstadoInvalidoException("No se puede degradar al último SUPER_ADMIN activo");
        }
        boolean rolCambio = administrador.getRol() != nuevoRol;
        administrador.setRol(nuevoRol);
        administrador.setFechaActualizacion(LocalDateTime.now());
        Administrador guardado = administradorRepository.save(administrador);

        auditoriaService.registrarOperacion("Actualizar administrador",
                "usuario=" + guardado.getUsuario()
                        + (rolCambio ? ", rol=" + guardado.getRol() + " (rol modificado)" : "")
                        + (dto.getContrasena() != null && !dto.getContrasena().isBlank()
                                ? ", contrasena=cambiada" : ""));
        return guardado;
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
        auditoriaService.registrarOperacion("Inhabilitar administrador",
                "usuario=" + administrador.getUsuario() + " (borrado lógico: activo=false)");
    }

    /** Política mínima de contraseñas: se aplica en alta y en cambio voluntario. */
    private String validarLongitudContrasena(String contrasena) {
        if (contrasena == null || contrasena.length() < 8) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres");
        }
        return passwordEncoder.encode(contrasena);
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
