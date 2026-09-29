package com.room911.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
    @Table(
    name = "intento_acceso",
    indexes = {
        @Index(name = "indice_intento_acceso_empleado", columnList = "empleado_id"),
        @Index(name = "indice_intento_acceso_fecha", columnList = "fecha_acceso"),
        @Index(name = "indice_intento_acceso_empleado_fecha", columnList = "empleado_id, fecha_acceso")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_acceso", nullable = false)
    private LocalDateTime fechaAcceso;

    @Column(nullable = false)
    private Boolean exito;

    private String mensaje;

    /**
     * Credencial leída por el lector, se haya o no encontrado el empleado.
     * Permite auditar intentos de empleados no registrados (requisito 4 del reto).
     */
    @Column(name = "documento_intentado", length = 20)
    private String documentoIntentado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;
}
