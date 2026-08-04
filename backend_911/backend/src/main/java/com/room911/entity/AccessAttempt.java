package com.room911.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "intento_acceso")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "acceso_date", nullable = false)
    private LocalDateTime fechaAcceso;

    @Column(nullable = false)
    private Boolean exito;

    private String message;

    @ManyToOne
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;
}
