package com.room911.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "historial_acceso",
    indexes = @Index(name = "indice_historial_acceso_empleado", columnList = "empleado_id")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistorialAcceso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_time_ingreso", nullable = false)
    private LocalDateTime fechaIngreso;

    @Column(name = "date_time_salida")
    private LocalDateTime fechaSalida;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empleado_id", nullable = false)
    private Empleado empleado;

    @Builder.Default
    @Column(nullable = false)
    private Boolean accesoPermitido = true;

    @Column(length = 255)
    private String observaciones;
    
}
