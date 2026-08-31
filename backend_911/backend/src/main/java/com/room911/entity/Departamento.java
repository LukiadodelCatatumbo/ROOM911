package com.room911.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "departamentos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Departamento {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank (message = "El nombre del departamento es obligatorio")
    @Column (nullable = false, unique = true, length = 100)
    private String nombre;

    @Column(length = 20)
    private String codigo;

    @Column(length = 255)
    private String descripcion;

    @Column(length = 100)
    private String responsable;

    @Column(name = "nivel_restriccion", length = 20)
    private String nivelRestriccion;

    @Column(name = "capacidad_maxima")
    private Integer capacidadMaxima;

    @Builder.Default
    @Column(nullable = false)
    private Boolean activo = true;

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    private LocalDateTime fechaActualizacion;
}
