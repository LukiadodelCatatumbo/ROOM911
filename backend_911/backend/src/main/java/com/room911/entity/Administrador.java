package com.room911.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    @Column  (nullable = false)
    private String correo;

    @NotBlank (message = "El usuario es obligatorio")
    @Column  (nullable = false, length = 100)
    private String usuario;

    @NotBlank (message = "La contraseña es obligatoria")
    @Column (nullable = false)
    private String contrasena;

    @NotNull(message = "El rol es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column (nullable = false, length = 30)
    private Rol rol;

    @Builder.Default
    @Column (nullable = false)
    private Boolean activo = true;

    @Builder.Default
    @Column(name = "date_time_creacion", nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Column(name = "date_time_actualizacion")
    private LocalDateTime fechaActualizacion;

}
