package com.room911.mapper;

import com.room911.dto.DepartamentoResponseDTO;
import com.room911.entity.Departamento;

public class DepartamentoMapper {

    public static DepartamentoResponseDTO toDTO(Departamento departamento){
        return DepartamentoResponseDTO.builder()
                .id(departamento.getId())
                .nombre(departamento.getNombre())
                .descripcion(departamento.getDescripcion())
                .activo(departamento.getActivo())
                .fechaCreacion(departamento.getFechaCreacion())
                .fechaActualizacion(departamento.getFechaActualizacion())
                .build();
    }

}
