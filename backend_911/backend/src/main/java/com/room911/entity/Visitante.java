package com.room911.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "visitantes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Visitante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false, length = 100)
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    @Column(nullable = false, length = 100)
    private String apellido;

    @NotBlank(message = "El documento es obligatorio")
    @Column(nullable = false, unique = true, length = 30)
    private String documento;

    @Email(message = "Correo inválido")
    @Column(length = 120)
    private String correo;

    @Column(length = 20)
    private String telefono;

    @Column(length = 255)
    private String empresa;

    @Builder.Default
    @Column(nullable = false)
    private Boolean activo = true;

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime fechaRegistro = LocalDateTime.now();

    private LocalDateTime fechaActualizacion;
}