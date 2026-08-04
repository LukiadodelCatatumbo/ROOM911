package com.room911.service.interfaces;

import com.room911.dto.VisitanteDTO;
import com.room911.dto.VisitanteResponseDTO;

import java.util.List;

public interface VisitanteService {

    VisitanteResponseDTO guardar(VisitanteDTO dto);

    List<VisitanteResponseDTO> listar();

    VisitanteResponseDTO buscarPorId(Long id);

    VisitanteResponseDTO actualizar(Long id, VisitanteDTO dto);

    void eliminar(Long id);

}