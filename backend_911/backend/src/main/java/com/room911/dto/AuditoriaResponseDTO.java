package com.room911.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditoriaResponseDTO {
    private Long id;
    private Long administradorId;
    private String nombreAdministrador;
    private String accion;
    private String descripcion;
    private LocalDateTime fecha;
}
