package com.room911.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class HistorialAccesoDTO {
    @NotNull(message = "El empleado es obligatorio")
    private Long empleadoId;

    private Boolean accesoPermitido;
    private String observaciones;
}
