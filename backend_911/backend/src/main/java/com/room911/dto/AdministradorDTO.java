package com.room911.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdministradorDTO {
    @NotBlank (message = "El nombre es obligatorio")
    @Size (max = 100, message = "El nombre no puede superar 100 caracteres")
    private String nombre;

    @NotBlank (message = "El apellido es obligatorio")
    @Size (max = 100, message = "El apellido no puede superar 100 caracteres")
    private String apellido;

    @Email (message = "Correo invalido")
    @NotBlank (message = "El correo es obligatorio")
    @Size (max = 255, message = "El correo no puede superar 255 caracteres")
    private String correo;

    @NotBlank (message = "El usuario es obligatorio")
    @Size (max = 100, message = "El usuario no puede superar 100 caracteres")
    private String usuario;

    /**
     * Obligatoria al crear; en actualización (PUT) puede venir vacía para
     * conservar la contraseña actual (se valida en AdministradorServiceImpl,
     * que exige mínimo 8 caracteres cuando se envía).
     */
    private String contrasena;

    private String rol;

}
