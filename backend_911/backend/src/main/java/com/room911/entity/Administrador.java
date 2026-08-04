package com.room911.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "administradores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Administrador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @NotBlank (message = "El nombre es obligatorio")
    @Column  (nullable = false, length = 100)
    private String nombre;

    @NotBlank (message = "El apellido es obligatorio")
    @Column  (nullable = false, length = 100)
    private String apellido;

    @Email(message = "Correo invalido")
    @Column  (nullable = false, unique = true)
    private String correo;

    @NotBlank (message = "El usuario es obligatorio")
    @Column  (nullable = false, unique = true, length = 100)
    private String usuario;

    @NotBlank (message = "La contraseña es obligatoria")
    @Column (nullable = false)
    private String contrasena;

    @Builder.Default
    @Column (nullable = false)
    private Boolean activo = true;

    @Builder.Default
    @Column (nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();
    private LocalDateTime fechaActualizacion;

}
