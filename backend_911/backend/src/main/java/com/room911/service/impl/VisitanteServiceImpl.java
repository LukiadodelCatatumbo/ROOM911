package com.room911.service.impl;

import com.room911.dto.VisitanteDTO;
import com.room911.dto.VisitanteResponseDTO;
import com.room911.entity.Visitante;
import com.room911.mapper.VisitanteMapper;
import com.room911.repository.VisitanteRepository;
import com.room911.service.interfaces.VisitanteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VisitanteServiceImpl implements VisitanteService {

    private final VisitanteRepository visitanteRepository;

    @Override
    public VisitanteResponseDTO guardar(VisitanteDTO dto) {
        if (visitanteRepository.existsByDocumento(dto.getDocumento())) {
            throw new RuntimeException("El documento ya se encuentra registrado.");
        }

        Visitante visitante = Visitante.builder()
                .nombre(dto.getNombre())
                .apellido(dto.getApellido())
                .documento(dto.getDocumento())
                .correo(dto.getCorreo())
                .telefono(dto.getTelefono())
                .empresa(dto.getEmpresa())
                .activo(true)
                .fechaRegistro(LocalDateTime.now())
                .build();

        Visitante guardado = visitanteRepository.save(visitante);

        return VisitanteMapper.toDTO(guardado);
    }

    @Override
    public List<VisitanteResponseDTO> listar() {
        return visitanteRepository.findAll()
                .stream()
                .filter(Visitante::getActivo)
                .map(VisitanteMapper::toDTO)
                .toList();
    }

    @Override
    public VisitanteResponseDTO buscarPorId(Long id) {
        Visitante visitante = visitanteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visitante no encontrado"));

        if (!visitante.getActivo()) {
            throw new RuntimeException("El visitante se encuentra inactivo");
        }
        return VisitanteMapper.toDTO(visitante);
    }

    @Override
    public VisitanteResponseDTO actualizar(Long id, VisitanteDTO dto) {
        Visitante visitante = visitanteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visitante no encontrado"));

        visitante.setNombre(dto.getNombre());
        visitante.setApellido(dto.getApellido());
        visitante.setDocumento(dto.getDocumento());
        visitante.setCorreo(dto.getCorreo());
        visitante.setTelefono(dto.getTelefono());
        visitante.setEmpresa(dto.getEmpresa());
        visitante.setFechaActualizacion(LocalDateTime.now());

        Visitante actualizado = visitanteRepository.save(visitante);
        return VisitanteMapper.toDTO(actualizado);
    }

    @Override
    public void eliminar(Long id) {
        Visitante visitante = visitanteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visitante no encontrado"));

        /**
         * No se elimina de la base de datos,
         * se marca inactivo para conservar
         * el historial y evitar problemas de integridad
         */

        visitante.setActivo(false);
        visitante.setFechaActualizacion(LocalDateTime.now());

        visitanteRepository.save(visitante);
    }
}