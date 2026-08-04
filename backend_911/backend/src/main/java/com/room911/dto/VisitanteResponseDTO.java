package com.room911.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitanteResponseDTO {

    private Long id;
    private String nombre;
    private String apellido;
    private String documento;
    private String correo;
    private String telefono;
    private String empresa;
    private Boolean activo;
    private LocalDateTime fechaRegistro;
    private LocalDateTime fechaActualizacion;
}