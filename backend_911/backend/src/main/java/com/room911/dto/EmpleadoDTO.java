package com.room911.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
    @Size(max = 100, message = "El nombre no puede superar 100 caracteres")
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    @Size(max = 100, message = "El apellido no puede superar 100 caracteres")
    private String apellido;

    @NotBlank(message = "El documento es obligatorio")
    @Pattern(regexp = "\\d{10}", message = "La cédula colombiana debe tener exactamente 10 dígitos")
    private String documento;

    @Email(message = "Correo invalido")
    @NotBlank(message = "El correo es obligatorio")
    @Size(max = 255, message = "El correo no puede superar 255 caracteres")
    private String correo;

    @NotBlank(message = "El cargo es obligatorio")
    @Size(max = 100, message = "El cargo no puede superar 100 caracteres")
    private String cargo;

    /**
     * Se recibe solo el id del departamento para
     * evitar enviar toda la informacion de la peticion
     */
    @NotNull(message = "El departamento es obligatoio")
    private Long departamentoId;

    private Boolean accesoPermitido;
}
