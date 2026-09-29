package com.room911.mapper;

import com.room911.dto.AccessAttemptDTO;
import com.room911.entity.AccessAttempt;
import com.room911.entity.Departamento;
import com.room911.entity.Empleado;

public class AccessAttemptMapper {

    private AccessAttemptMapper() {
    }

    public static AccessAttemptDTO toDTO(AccessAttempt accessAttempt) {

        Empleado empleado = accessAttempt.getEmpleado();
        Departamento departamento = empleado != null
                ? empleado.getDepartamento()
                : null;

        return AccessAttemptDTO.builder()
                .id(accessAttempt.getId())
                .fechaAcceso(accessAttempt.getFechaAcceso())
                .exito(accessAttempt.getExito())
                .mensaje(accessAttempt.getMensaje())
                .empleadoId(empleado != null ? empleado.getId() : null)
                .nombreEmpleado(
                        empleado != null
                                ? empleado.getNombre() + " " + empleado.getApellido()
                                : "Empleado no registrado"
                )
                .documento(empleado != null ? empleado.getDocumento() : "-")
                .cargo(empleado != null ? empleado.getCargo() : "-")
                .departamento(departamento != null ? departamento.getNombre() : "-")
                .build();
    }
}
