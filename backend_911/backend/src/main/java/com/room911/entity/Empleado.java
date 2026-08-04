package com.room911.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "empleados")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Empleado {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false, length = 100)
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    @Column(nullable = false, length = 100)
    private String apellido;

    @NotBlank(message = "El documento es obligatorio")
    @Column(nullable = false, unique = true, length = 20)
    private String documento;

    @NotBlank(message = "El email es obligatorio")
    @Column(nullable = false, unique = true)
    private String correo;

    @NotBlank(message = "El cargo es obligatorio")
    @Column(nullable = false, length = 100)
    private String cargo;

    @OneToMany(mappedBy = "empleado")
    private List<AccessAttempt> accessAttempts;
    
    @OneToMany(mappedBy = "empleado")
    private List<HistorialAcceso> historialAccesos;

    /**
     * Aqui se relacionan muchos empleados que pertenecen a un departamento,
     * por lo que se utiliza ManyToOne
     */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departamento_id", nullable = false)
    private Departamento departamento;

    @Builder.Default
    @Column(nullable = false)
    private Boolean activo = true;

    @Builder.Default
    @Column(name = "acceso_permitido", nullable = false)
    private Boolean accesoPermitido = true;

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    private LocalDateTime fechaActualizacion;
}
