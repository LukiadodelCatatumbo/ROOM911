package com.room911.service.interfaces;

import com.room911.dto.AuditoriaDTO;
import com.room911.dto.AuditoriaResponseDTO;

import java.util.List;

public interface AuditoriaService {
    AuditoriaResponseDTO guardar(AuditoriaDTO dto);
    List<AuditoriaResponseDTO> listar();
    AuditoriaResponseDTO buscarPorId(Long id);
    List<AuditoriaResponseDTO> buscarPorAdministrador(Long administradorId);
}
