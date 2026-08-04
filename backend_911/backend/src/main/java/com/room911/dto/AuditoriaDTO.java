package com.room911.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditoriaDTO {
    @NotNull(message = "El administrador es obligatorio")
    private Long administradorId;

    @NotBlank(message = "La accion es obligatoria")
    private String accion;

    private String descripcion;
}
