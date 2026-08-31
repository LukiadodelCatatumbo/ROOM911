package com.room911.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
    private String nombre;

    @NotBlank (message = "El apellido es obligatorio")
    private String apellido;

    @Email (message = "Correo invalido")
    @NotBlank (message = "El correo es obligatorio")
    private String correo;

    @NotBlank (message = "El usuario es obligatorio")
    private String usuario;

    /**
     * Obligatoria al crear; en actualización (PUT) puede venir vacía para
     * conservar la contraseña actual (se valida en AdministradorServiceImpl).
     */
    private String contrasena;

    private String rol;

}
