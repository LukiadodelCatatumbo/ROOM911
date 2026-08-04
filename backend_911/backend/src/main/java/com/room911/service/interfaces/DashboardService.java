package com.room911.service.interfaces;

import com.room911.dto.AccesosSemanaDTO;
import com.room911.dto.DashboardResumenDTO;

import java.util.List;

public interface DashboardService {
    DashboardResumenDTO obtenerResumen();

    List<AccesosSemanaDTO> obtenerAccesosSemana();
}