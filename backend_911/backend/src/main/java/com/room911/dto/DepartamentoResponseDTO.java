package com.room911.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DepartamentoResponseDTO {
    private Long id;
    private String nombre;
    private String codigo;
    private String descripcion;
    private String responsable;
    private String nivelRestriccion;
    private Integer capacidadMaxima;
    private Long empleadosCount;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}
