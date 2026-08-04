package com.room911.dto;

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
    private Boolean exito;
    private String message;
    private Long empleadoId;
    private String nombreEmpleado;
    private String documento;
    private String cargo;
    private String departamento;
}
