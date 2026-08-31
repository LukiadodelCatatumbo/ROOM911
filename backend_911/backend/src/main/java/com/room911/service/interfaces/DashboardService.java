package com.room911.service.interfaces;

import com.room911.dto.AccesosSemanaDTO;
import com.room911.dto.AccessAttemptDTO;
import com.room911.dto.DashboardResumenDTO;
import com.room911.dto.DepartamentoResumenDTO;

import java.util.List;

public interface DashboardService {
    DashboardResumenDTO obtenerResumen();

    List<AccesosSemanaDTO> obtenerAccesosSemana();

    List<DepartamentoResumenDTO> obtenerDistribucionDepartamentos();

    List<AccessAttemptDTO> obtenerUltimosAccesos();
}
