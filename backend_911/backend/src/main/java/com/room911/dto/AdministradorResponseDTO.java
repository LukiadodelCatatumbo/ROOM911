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
public class AdministradorResponseDTO {

    private Long id;

    private String nombre;

    private String apellido;

    private String correo;

    private String usuario;

    private Boolean activo;

    private LocalDateTime fechaCreacion;

    private LocalDateTime fechaActualizacion;
}