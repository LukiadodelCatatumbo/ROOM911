package com.room911.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
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
    @Size(max = 100, message = "El nombre no puede superar 100 caracteres")
    private String nombre;

    @Size(max = 20, message = "El código no puede superar 20 caracteres")
    private String codigo;

    @Size(max = 255, message = "La descripción no puede superar 255 caracteres")
    private String descripcion;

    @Size(max = 100, message = "El responsable no puede superar 100 caracteres")
    private String responsable;

    @Size(max = 20, message = "El nivel de restricción no puede superar 20 caracteres")
    private String nivelRestriccion;

    @PositiveOrZero(message = "La capacidad máxima no puede ser negativa")
    private Integer capacidadMaxima;
}
