package com.room911.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

/**
 * DTO utilizado para registrar o actualizar un empleado
 * Tiene solo la informacion necesaria para crear
 * un empleado, evitando exponer directamente la entidad
 */
public class EmpleadoResponseDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String documento;
    private String correo;
    private String cargo;
    private Long departamentoId;
    private String nombreDepartamento;
    private Boolean activo;
    private Boolean accesoPermitido;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}
