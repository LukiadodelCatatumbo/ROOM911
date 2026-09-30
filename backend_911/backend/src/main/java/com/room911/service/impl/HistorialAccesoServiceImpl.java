package com.room911.service.impl;

import com.room911.dto.HistorialAccesoDTO;
import com.room911.dto.HistorialAccesoResponseDTO;
import com.room911.entity.Empleado;
import com.room911.entity.HistorialAcceso;
import com.room911.exception.EstadoInvalidoException;
import com.room911.exception.RecursoNoEncontradoException;
import com.room911.mapper.HistorialAccesoMapper;
import com.room911.repository.EmpleadoRepository;
import com.room911.repository.HistorialAccesoRepository;
import com.room911.service.interfaces.HistorialAccesoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class HistorialAccesoServiceImpl implements HistorialAccesoService {
    private final HistorialAccesoRepository historialAccesoRepository;
    private final EmpleadoRepository empleadoRepository;

    @Override
    public HistorialAccesoResponseDTO guardar(HistorialAccesoDTO dto){
        Empleado empleado = empleadoRepository.findById(dto.getEmpleadoId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Empleado no encontrado"));

        HistorialAcceso historial = HistorialAcceso.builder()
                .empleado(empleado)
                .fechaIngreso(LocalDateTime.now())
                // Columna NOT NULL: un registro de ingreso se considera permitido por defecto
                .accesoPermitido(dto.getAccesoPermitido() != null ? dto.getAccesoPermitido() : true)
                .observaciones(dto.getObservaciones())
                .build();
        HistorialAcceso guardado = historialAccesoRepository.save(historial);
        return HistorialAccesoMapper.toDTO(guardado);
    }

    @Override
    public List<HistorialAccesoResponseDTO> listar(){
        return historialAccesoRepository.findAll()
                .stream()
                .map(HistorialAccesoMapper::toDTO)
                .toList();
    }

    @Override
    public HistorialAccesoResponseDTO buscarPorId(Long id){
        HistorialAcceso historial = historialAccesoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Historial de acceso no encontrado"));
        return HistorialAccesoMapper.toDTO(historial);
    }

    @Override
    public List<HistorialAccesoResponseDTO> listarPorEmpleado(Long empleadoId) {
        return historialAccesoRepository.findByEmpleadoId(empleadoId)
                .stream()
                .map(HistorialAccesoMapper::toDTO)
                .toList();
    }

    @Override
    public HistorialAccesoResponseDTO registrarSalida(Long id){
        HistorialAcceso historial = historialAccesoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Historial de acceso no encontrado"));

        if (historial.getFechaSalida() != null){
            throw new EstadoInvalidoException("La salida ya fue registrada");
        }

        historial.setFechaSalida(LocalDateTime.now());
        HistorialAcceso actualizado = historialAccesoRepository.save(historial);
        return HistorialAccesoMapper.toDTO(actualizado);
    }
}
