package com.room911.service.impl;

import com.room911.dto.AuditoriaDTO;
import com.room911.dto.AuditoriaResponseDTO;
import com.room911.entity.Administrador;
import com.room911.entity.Auditoria;
import com.room911.exception.RecursoNoEncontradoException;
import com.room911.mapper.AuditoriaMapper;
import com.room911.repository.AdministradorRepository;
import com.room911.repository.AuditoriaRepository;
import com.room911.service.interfaces.AuditoriaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuditoriaServiceImpl implements AuditoriaService {

    private final AuditoriaRepository auditoriaRepository;
    private final AdministradorRepository administradorRepository;

    @Override
    public AuditoriaResponseDTO guardar(AuditoriaDTO dto) {

        Administrador administrador = administradorRepository
                .findById(dto.getAdministradorId())
                .orElseThrow(() ->
                        new RecursoNoEncontradoException("Administrador no encontrado"));

        Auditoria auditoria = Auditoria.builder()
                .administrador(administrador)
                .accion(dto.getAccion())
                .descripcion(dto.getDescripcion())
                .fecha(LocalDateTime.now())
                .build();

        Auditoria guardada = auditoriaRepository.save(auditoria);

        return AuditoriaMapper.toDTO(guardada);
    }

    @Override
    public List<AuditoriaResponseDTO> listar() {

        return auditoriaRepository.findAll()
                .stream()
                .map(AuditoriaMapper::toDTO)
                .toList();
    }

    @Override
    public AuditoriaResponseDTO buscarPorId(Long id) {

        Auditoria auditoria = auditoriaRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException("Registro de auditoría no encontrado"));

        return AuditoriaMapper.toDTO(auditoria);
    }

    @Override
    public List<AuditoriaResponseDTO> buscarPorAdministrador(Long administradorId) {

        return auditoriaRepository.findByAdministradorId(administradorId)
                .stream()
                .map(AuditoriaMapper::toDTO)
                .toList();
    }

    /**
     * HU-020: la columna administrador es NOT NULL, así que solo se registra
     * cuando hay un administrador autenticado resoluble; los campos se
     * truncan a los limites de columna (accion 100, descripcion 500) para
     * que el registro de auditoría nunca tumbe la operación que audita.
     */
    @Override
    public void registrarOperacion(String accion, String descripcion) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName() == null) {
            log.debug("Operación '{}' sin actor autenticado: no se audita", accion);
            return;
        }

        Administrador administrador = administradorRepository
                .findByUsuario(auth.getName())
                .orElse(null);
        if (administrador == null) {
            log.debug("Actor '{}' no es un administrador del sistema: no se audita '{}'",
                    auth.getName(), accion);
            return;
        }

        auditoriaRepository.save(Auditoria.builder()
                .administrador(administrador)
                .accion(truncar(accion, 100))
                .descripcion(descripcion != null ? truncar(descripcion, 500) : null)
                .fecha(LocalDateTime.now())
                .build());
    }

    private String truncar(String valor, int maximo) {
        return valor.length() <= maximo ? valor : valor.substring(0, maximo - 1) + "…";
    }

}