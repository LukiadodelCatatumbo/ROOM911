package com.room911.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {

    private Boolean loginCorrecto;

    private String mensaje;

    private String token;

    private String usuario;

    private String nombre;

    private String correo;

    private String rol;

}
