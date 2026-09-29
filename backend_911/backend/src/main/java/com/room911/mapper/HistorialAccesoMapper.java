package com.room911.mapper;

import com.room911.dto.HistorialAccesoResponseDTO;
import com.room911.entity.Departamento;
import com.room911.entity.Empleado;
import com.room911.entity.HistorialAcceso;

public class HistorialAccesoMapper {

    private HistorialAccesoMapper() {
    }

    public static HistorialAccesoResponseDTO toDTO(HistorialAcceso historial) {

        Empleado empleado = historial.getEmpleado();
        Departamento departamento = empleado != null
                ? empleado.getDepartamento()
                : null;

        return HistorialAccesoResponseDTO.builder()
                .id(historial.getId())
                .empleadoId(empleado != null ? empleado.getId() : null)
                .nombreEmpleado(
                        empleado != null
                                ? empleado.getNombre() + " " + empleado.getApellido()
                                : null
                )
                .documento(empleado != null ? empleado.getDocumento() : null)
                .departamento(departamento != null ? departamento.getNombre() : null)
                .fechaIngreso(historial.getFechaIngreso())
                .fechaSalida(historial.getFechaSalida())
                .accesoPermitido(historial.getAccesoPermitido())
                .observaciones(historial.getObservaciones())
                .build();
    }
}
