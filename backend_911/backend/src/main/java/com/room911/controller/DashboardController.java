package com.room911.controller;

import com.room911.dto.AccesosSemanaDTO;
import com.room911.dto.AccessAttemptDTO;
import com.room911.dto.DashboardResumenDTO;
import com.room911.dto.DepartamentoResumenDTO;
import com.room911.service.interfaces.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_ACCESOS', 'ADMIN_SISTEMAS')")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/resumen")
    public DashboardResumenDTO resumen() {

        return dashboardService.obtenerResumen();

    }

    @GetMapping("/accesos-semana")
    public List<AccesosSemanaDTO> accesosSemana() {

        return dashboardService.obtenerAccesosSemana();

    }

    @GetMapping("/departamentos")
    public List<DepartamentoResumenDTO> distribucionDepartamentos() {

        return dashboardService.obtenerDistribucionDepartamentos();

    }

    @GetMapping("/ultimos-accesos")
    public List<AccessAttemptDTO> ultimosAccesos() {

        return dashboardService.obtenerUltimosAccesos();

    }

}
