package com.room911.service.impl;

import com.room911.dto.AccesosSemanaDTO;
import com.room911.dto.AccessAttemptDTO;
import com.room911.dto.DashboardResumenDTO;
import com.room911.dto.DepartamentoResumenDTO;
import com.room911.mapper.AccessAttemptMapper;
import com.room911.repository.AccessAttemptRepository;
import com.room911.repository.DepartamentoRepository;
import com.room911.repository.EmpleadoRepository;
import com.room911.repository.HistorialAccesoRepository;
import com.room911.service.interfaces.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final EmpleadoRepository empleadoRepository;

    private final DepartamentoRepository departamentoRepository;

    private final AccessAttemptRepository accessAttemptRepository;

    private final HistorialAccesoRepository historialAccesoRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardResumenDTO obtenerResumen() {

        LocalDateTime inicio =
                LocalDate.now().atStartOfDay();

        LocalDateTime fin =
                LocalDate.now().atTime(23,59,59);

        long empleados =
                empleadoRepository.countByActivoTrue();

        long empleadosConPermiso =
                empleadoRepository.countByActivoTrueAndAccesoPermitidoTrue();

        long departamentos =
                departamentoRepository.count();

        long accesosHoy =
                accessAttemptRepository
                        .countByFechaAccesoBetween(
                                inicio,
                                fin
                        );

        long denegadosHoy =
                accessAttemptRepository
                        .countByExitoAndFechaAccesoBetween(
                                false,
                                inicio,
                                fin
                        );

        long enPlanta =
                historialAccesoRepository.countByFechaSalidaIsNull();

        return new DashboardResumenDTO(

                empleados,

                empleadosConPermiso,

                departamentos,

                accesosHoy,

                denegadosHoy,

                enPlanta

        );

    }

    @Override
    @Transactional(readOnly = true)
    public List<AccesosSemanaDTO> obtenerAccesosSemana() {

        LocalDateTime inicio =
                LocalDate.now()
                        .minusDays(6)
                        .atStartOfDay();

        List<Object[]> resultados =
                accessAttemptRepository
                        .obtenerAccesosUltimos7Dias(inicio);

        return resultados.stream()
                .map(r -> new AccesosSemanaDTO(
                        r[0].toString().trim(),
                        ((Number) r[1]).longValue(),
                        ((Number) r[2]).longValue()
                ))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartamentoResumenDTO> obtenerDistribucionDepartamentos() {
        return empleadoRepository.obtenerResumenDepartamentos();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccessAttemptDTO> obtenerUltimosAccesos() {
        return accessAttemptRepository.findTop10ByOrderByFechaAccesoDesc()
                .stream()
                .map(AccessAttemptMapper::toDTO)
                .toList();
    }
}
