package com.room911.mapper;

import com.room911.dto.VisitanteResponseDTO;
import com.room911.entity.Visitante;

public class VisitanteMapper {

    private VisitanteMapper() {
    }

    public static VisitanteResponseDTO toDTO(Visitante visitante) {

        return VisitanteResponseDTO.builder()
                .id(visitante.getId())
                .nombre(visitante.getNombre())
                .apellido(visitante.getApellido())
                .documento(visitante.getDocumento())
                .correo(visitante.getCorreo())
                .telefono(visitante.getTelefono())
                .empresa(visitante.getEmpresa())
                .activo(visitante.getActivo())
                .fechaRegistro(visitante.getFechaRegistro())
                .fechaActualizacion(visitante.getFechaActualizacion())
                .build();
    }
}