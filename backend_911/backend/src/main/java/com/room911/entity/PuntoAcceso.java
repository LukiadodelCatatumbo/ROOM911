package com.room911.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Punto físico de control de acceso (esclusa, torniquete, biométrico...).
 * El backend valida cada solicitud contra este catálogo: departamento
 * autorizado, franja horaria y nivel de restricción. Sin este registro,
 * la validación de {@code puerta} sería solo cosmética en el frontend.
 */
@Entity
@Table(
    name = "puntos_acceso",
    uniqueConstraints = @UniqueConstraint(name = "uk_punto_codigo", columnNames = "codigo"),
    indexes = @Index(name = "indice_punto_departamento", columnList = "departamento_id")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PuntoAcceso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Código estable usado por lectores y simulador (ej: DOOR-PROD-01). */
    @NotBlank(message = "El código del punto es obligatorio")
    @Column(nullable = false, length = 30, unique = true)
    private String codigo;

    @NotBlank(message = "El nombre del punto es obligatorio")
    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(length = 255)
    private String ubicacion;

    @Column(name = "nivel_restriccion", length = 20)
    private String nivelRestriccion;

    @Column(length = 30)
    private String tipo;

    /** Los puntos de zona común (o sin departamento) son de acceso general. */
    @Builder.Default
    @Column(name = "zona_comun", nullable = false)
    private Boolean zonaComun = false;

    /** Franja permitida en formato "HH:mm" (zona America/Bogota). */
    @Column(name = "hora_inicio", length = 5)
    private String horaInicio;

    @Column(name = "hora_fin", length = 5)
    private String horaFin;

    @Column(name = "nombre_horario", length = 100)
    private String nombreHorario;

    /** Departamento autorizado. Null = acceso general (zona común). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departamento_id")
    private Departamento departamento;

    @Builder.Default
    @Column(nullable = false)
    private Boolean activo = true;

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    private LocalDateTime fechaActualizacion;
}
