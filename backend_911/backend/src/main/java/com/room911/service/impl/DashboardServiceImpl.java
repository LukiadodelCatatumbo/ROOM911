package com.room911.service.impl;

import com.room911.dto.DashboardResumenDTO;
import com.room911.repository.AccessAttemptRepository;
import com.room911.repository.DepartamentoRepository;
import com.room911.repository.EmpleadoRepository;
import com.room911.service.interfaces.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.room911.dto.AccesosSemanaDTO;
import java.util.List;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final EmpleadoRepository empleadoRepository;

    private final DepartamentoRepository departamentoRepository;

    private final AccessAttemptRepository accessAttemptRepository;

    @Override
    public DashboardResumenDTO obtenerResumen() {

        LocalDateTime inicio =
                LocalDate.now().atStartOfDay();

        LocalDateTime fin =
                LocalDate.now().atTime(23,59,59);

        long empleados =
                empleadoRepository.countByActivoTrue();

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

        return new DashboardResumenDTO(

                empleados,

                departamentos,

                accesosHoy,

                denegadosHoy

        );

    }

    @Override
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
                        ((Number) r[1]).longValue()
                ))
                .toList();
    }
}