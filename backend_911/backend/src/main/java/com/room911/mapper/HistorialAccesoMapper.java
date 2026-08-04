package com.room911.mapper;

import com.room911.dto.HistorialAccesoResponseDTO;
import com.room911.entity.HistorialAcceso;

public class HistorialAccesoMapper {

    private HistorialAccesoMapper() {
    }

    public static HistorialAccesoResponseDTO toDTO(HistorialAcceso historial) {

        return HistorialAccesoResponseDTO.builder()

                .id(historial.getId())

                .empleadoId(
                        historial.getEmpleado().getId()
                )

                .nombreEmpleado(
                        historial.getEmpleado().getNombre()
                                + " "
                                + historial.getEmpleado().getApellido()
                )

                .documento(
                        historial.getEmpleado().getDocumento()
                )

                .departamento(
                        historial.getEmpleado()
                                .getDepartamento()
                                .getNombre()
                )

                .fechaIngreso(
                        historial.getFechaIngreso()
                )

                .fechaSalida(
                        historial.getFechaSalida()
                )

                .accesoPermitido(
                        historial.getAccesoPermitido()
                )

                .observaciones(
                        historial.getObservaciones()
                )

                .build();
    }
}