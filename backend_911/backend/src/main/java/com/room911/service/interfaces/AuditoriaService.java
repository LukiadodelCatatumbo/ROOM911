package com.room911.service.interfaces;

import com.room911.dto.AuditoriaDTO;
import com.room911.dto.AuditoriaResponseDTO;

import java.util.List;

public interface AuditoriaService {
    AuditoriaResponseDTO guardar(AuditoriaDTO dto);
    List<AuditoriaResponseDTO> listar();
    AuditoriaResponseDTO buscarPorId(Long id);
    List<AuditoriaResponseDTO> buscarPorAdministrador(Long administradorId);

    /**
     * HU-020: registra automáticamente una operación administrativa con el
     * actor autenticado (del contexto de seguridad), acción y descripción.
     * Si no hay administrador autenticado (p. ej. proceso interno), se omite
     * el registro sin interrumpir la operación.
     */
    void registrarOperacion(String accion, String descripcion);
}
