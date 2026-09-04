package com.room911.mapper;

import com.room911.dto.DepartamentoResponseDTO;
import com.room911.entity.Departamento;

public class DepartamentoMapper {

    public static DepartamentoResponseDTO toDTO(Departamento departamento, long cantidadEmpleados){
        return DepartamentoResponseDTO.builder()
                .id(departamento.getId())
                .nombre(departamento.getNombre())
                .codigo(departamento.getCodigo())
                .descripcion(departamento.getDescripcion())
                .responsable(departamento.getResponsable())
                .nivelRestriccion(departamento.getNivelRestriccion())
                .capacidadMaxima(departamento.getCapacidadMaxima())
                .cantidadEmpleados(cantidadEmpleados)
                .activo(departamento.getActivo())
                .fechaCreacion(departamento.getFechaCreacion())
                .fechaActualizacion(departamento.getFechaActualizacion())
                .build();
    }

}
