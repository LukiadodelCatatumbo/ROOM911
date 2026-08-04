package com.room911.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmpleadoDTO {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    private String apellido;

    @NotBlank(message = "El documento es obligatorio")
    private String documento;

    @Email(message = "Correo invalido")
    @NotBlank(message = "El correo es obligatorio")
    private String correo;

    @NotBlank(message = "El cargo es obligatorio")
    private String cargo;

    /**
     * Se recibe solo el id del departamento para
     * evitar enviar toda la informacion de la peticion
     */
    @NotNull(message = "El departamento es obligatoio")
    private Long departamentoId;

    private Boolean accesoPermitido;
}
