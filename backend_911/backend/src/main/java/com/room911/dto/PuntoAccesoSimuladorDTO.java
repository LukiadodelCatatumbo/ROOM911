package com.room911.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Punto de acceso proyectado para el simulador/lectores (GET /api/acceso/puntos).
 * Fuente única del catálogo: la tabla puntos_acceso sembrada por DataInitializer.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PuntoAccesoSimuladorDTO {
    private String codigo;
    private String nombre;
    private String ubicacion;
    private String nivelRestriccion;
    private String tipo;
    private Boolean zonaComun;
    private String departamento;
    private String horaInicio;
    private String horaFin;
    private String nombreHorario;
}
