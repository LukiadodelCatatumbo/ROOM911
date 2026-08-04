package com.room911.mapper;

import com.room911.dto.EmpleadoResponseDTO;
import com.room911.entity.Empleado;

/**
 * Mapper ayuda a convertir la entidad Empleado
 * en un EmpleadoResponse
 */
public class EmpleadoMapper {
    private EmpleadoMapper() {
    }

    public static EmpleadoResponseDTO toDTO(Empleado empleado){
        if (empleado == null){
            return null;
        }

        return EmpleadoResponseDTO.builder()
                .id(empleado.getId())
                .nombre(empleado.getNombre())
                .apellido(empleado.getApellido())
                .documento(empleado.getDocumento())
                .correo(empleado.getCorreo())
                .cargo(empleado.getCargo())
                .departamentoId(empleado.getDepartamento().getId())
                .nombreDepartamento(empleado.getDepartamento().getNombre())
                .activo(empleado.getActivo())
                .accesoPermitido(empleado.getAccesoPermitido())
                .fechaCreacion(empleado.getFechaCreacion())
                .fechaActualizacion(empleado.getFechaActualizacion())
                .build();
    }
}
