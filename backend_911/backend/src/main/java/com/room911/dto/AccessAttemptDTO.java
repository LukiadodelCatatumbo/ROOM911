package com.room911.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessAttemptDTO {
    private Long id;
    private LocalDateTime fechaAcceso;
    @NotNull(message = "El resultado del intento es obligatorio")
    private Boolean exito;
    @Size(max = 255, message = "El mensaje no puede superar 255 caracteres")
    private String mensaje;
    private Long empleadoId;
    private String nombreEmpleado;
    private String documento;
    private String cargo;
    private String departamento;
}
