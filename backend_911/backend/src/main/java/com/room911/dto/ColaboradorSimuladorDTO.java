package com.room911.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Vista mínima y pública para el simulador/terminal: solo lo necesario
 * para listar y validar (nunca documento ni correo). La credencial de
 * validación es el id numérico, que el servicio resuelve por PK.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ColaboradorSimuladorDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String cargo;
    private String departamento;
    private Boolean activo;
    private Boolean accesoPermitido;
}
