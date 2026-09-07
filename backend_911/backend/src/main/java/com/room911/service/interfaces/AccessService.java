package com.room911.service.interfaces;

import com.room911.dto.AccessRequestDTO;
import com.room911.dto.AccessResponseDTO;
import com.room911.dto.ColaboradorSimuladorDTO;

import java.util.List;

public interface AccessService {
    AccessResponseDTO validarAcceso(AccessRequestDTO dto);

    /** Lista pública mínima para el simulador (sin documento ni correo). */
    List<ColaboradorSimuladorDTO> listarColaboradores();
}
