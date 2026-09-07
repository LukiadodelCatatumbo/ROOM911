package com.room911.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessRequestDTO {
    @NotBlank (message = "El documento es obligatorio")
    private String documento;

    /**
     * Punto de acceso solicitado: código estable (ej: DOOR-PROD-01) o nombre.
     * Opcional por compatibilidad con lectores antiguos; si se informa,
     * el backend lo valida (punto registrado, horario y zona). Si se omite,
     * se aplica solo la validación de identidad.
     */
    private String puerta;
}
