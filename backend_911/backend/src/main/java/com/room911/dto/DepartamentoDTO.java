package com.room911.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartamentoDTO {
    @NotBlank(message = "El nombre del departamento es obligatorio")
    private String nombre;

    private String descripcion;
}
