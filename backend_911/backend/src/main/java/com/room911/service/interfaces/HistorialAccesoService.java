package com.room911.service.interfaces;

import com.room911.dto.HistorialAccesoDTO;
import com.room911.dto.HistorialAccesoResponseDTO;

import java.util.List;

public interface HistorialAccesoService {
    HistorialAccesoResponseDTO guardar(HistorialAccesoDTO dto);
    List<HistorialAccesoResponseDTO> listar();
    HistorialAccesoResponseDTO buscarPorId(Long id);
    List<HistorialAccesoResponseDTO> listarPorEmpleado(Long empleadoId);
    HistorialAccesoResponseDTO registrarSalida(Long id);
}
