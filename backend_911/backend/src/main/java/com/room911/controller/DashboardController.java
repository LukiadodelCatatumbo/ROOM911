package com.room911.controller;

import com.room911.dto.AccesosSemanaDTO;
import com.room911.dto.DashboardResumenDTO;
import com.room911.service.interfaces.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin("*")
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

}