package com.room911.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessResponseDTO {

    private Boolean permitido;
    private String mensaje;
    private String nombreEmpleado;
    private String cargo;
    private String departamento;
    private Boolean activo;
    private String documento;
}
