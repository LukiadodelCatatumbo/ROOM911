package com.room911.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class HistorialAccesoResponseDTO {
    private Long id;
    private Long empleadoId;
    private String nombreEmpleado;
    private String documento;
    private String departamento;
    private LocalDateTime fechaIngreso;
    private LocalDateTime fechaSalida;
    private Boolean accesoPermitido;
    private String observaciones;
}
