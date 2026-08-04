package com.room911.mapper;

import com.room911.dto.AccessAttemptDTO;
import com.room911.entity.AccessAttempt;

public class AccessAttemptMapper {

    private AccessAttemptMapper() {
    }

    public static AccessAttemptDTO toDTO(AccessAttempt accessAttempt) {

        return AccessAttemptDTO.builder()

                .id(accessAttempt.getId())

                .fechaAcceso(accessAttempt.getFechaAcceso())

                .exito(accessAttempt.getExito())

                .message(accessAttempt.getMessage())

                .empleadoId(
                        accessAttempt.getEmpleado() != null
                                ? accessAttempt.getEmpleado().getId()
                                : null
                )

                .nombreEmpleado(
                        accessAttempt.getEmpleado() != null
                                ? accessAttempt.getEmpleado().getNombre()
                                + " "
                                + accessAttempt.getEmpleado().getApellido()
                                : "Empleado no registrado"
                )

                .documento(
                        accessAttempt.getEmpleado() != null
                                ? accessAttempt.getEmpleado().getDocumento()
                                : "-"
                )

                .cargo(
                        accessAttempt.getEmpleado() != null
                                ? accessAttempt.getEmpleado().getCargo()
                                : "-"
                )

                .departamento(
                        accessAttempt.getEmpleado() != null
                                ? accessAttempt.getEmpleado()
                                        .getDepartamento()
                                        .getNombre()
                                : "-"
                )

                .build();

    }

}