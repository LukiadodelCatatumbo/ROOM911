package com.room911.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "auditoria")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Auditoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Administrador que realizo la accion
     */
    @ManyToOne
    @JoinColumn(name = "administrador_id", nullable = false)
    private Administrador administrador;

    /**
     * Accion realizada
     * Crear empleado
     * Actualizar Departamento
     * Eliminar empleado
     */

    @Column(nullable = false, length = 100)
    private String accion;

    /**
     * Descripcion detallada
     */
    @Column(length = 500)
    private String descripcion;

    /**
     * Fecha en que ocurrio la accion
     */
    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime fecha = LocalDateTime.now();
}
