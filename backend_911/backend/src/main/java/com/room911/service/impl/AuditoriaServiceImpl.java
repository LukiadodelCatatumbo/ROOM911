package com.room911.service.impl;

import com.room911.dto.AuditoriaDTO;
import com.room911.dto.AuditoriaResponseDTO;
import com.room911.entity.Administrador;
import com.room911.entity.Auditoria;
import com.room911.mapper.AuditoriaMapper;
import com.room911.repository.AdministradorRepository;
import com.room911.repository.AuditoriaRepository;
import com.room911.service.interfaces.AuditoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditoriaServiceImpl implements AuditoriaService {

    private final AuditoriaRepository auditoriaRepository;
    private final AdministradorRepository administradorRepository;

    @Override
    public AuditoriaResponseDTO guardar(AuditoriaDTO dto) {

        Administrador administrador = administradorRepository
                .findById(dto.getAdministradorId())
                .orElseThrow(() ->
                        new RuntimeException("Administrador no encontrado"));

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
                        new RuntimeException("Registro de auditoría no encontrado"));

        return AuditoriaMapper.toDTO(auditoria);
    }

    @Override
    public List<AuditoriaResponseDTO> buscarPorAdministrador(Long administradorId) {

        return auditoriaRepository.findByAdministradorId(administradorId)
                .stream()
                .map(AuditoriaMapper::toDTO)
                .toList();
    }

}