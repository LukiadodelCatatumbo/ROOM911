package com.room911.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResumenDTO {
    private Long empleados;
    private Long departamentos;
    private Long accesosHoy;
    private Long denegadosHoy;
}