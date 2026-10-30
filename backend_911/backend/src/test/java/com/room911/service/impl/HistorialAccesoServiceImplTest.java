package com.room911.service.impl;

import com.room911.dto.HistorialAccesoDTO;
import com.room911.dto.HistorialAccesoResponseDTO;
import com.room911.entity.Departamento;
import com.room911.entity.Empleado;
import com.room911.entity.HistorialAcceso;
import com.room911.exception.EstadoInvalidoException;
import com.room911.repository.EmpleadoRepository;
import com.room911.repository.HistorialAccesoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Módulo administrativo de historial: registro de salidas (Fase 25) y
 * coherencia con el anti-passback (no permite un segundo ingreso abierto).
 */
@ExtendWith(MockitoExtension.class)
class HistorialAccesoServiceImplTest {

    @Mock
    private HistorialAccesoRepository historialAccesoRepository;
    @Mock
    private EmpleadoRepository empleadoRepository;

    private HistorialAccesoServiceImpl historialAccesoService;

    private Empleado empleado;
    private HistorialAcceso ingresoAbierto;

    @BeforeEach
    void setUp() {
        historialAccesoService =
                new HistorialAccesoServiceImpl(historialAccesoRepository, empleadoRepository);

        empleado = Empleado.builder()
                .id(7L)
                .nombre("Carlos")
                .apellido("Mendoza")
                .documento("1020304050")
                .activo(true)
                .departamento(Departamento.builder().id(1L).nombre("Producción").build())
                .build();

        ingresoAbierto = HistorialAcceso.builder()
                .id(11L)
                .empleado(empleado)
                .fechaIngreso(LocalDateTime.now().minusHours(2))
                .accesoPermitido(true)
                .observaciones("Ingreso automático: Esclusa de Prueba")
                .build();
    }

    @Test
    @DisplayName("registrarSalida cierra el ingreso abierto")
    void registrarSalidaCierraIngreso() {
        when(historialAccesoRepository.findById(11L)).thenReturn(Optional.of(ingresoAbierto));
        when(historialAccesoRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        HistorialAccesoResponseDTO salida = historialAccesoService.registrarSalida(11L);

        assertNotNull(salida.getFechaSalida());
        assertEquals(11L, salida.getId());
    }

    @Test
    @DisplayName("registrarSalida rechaza un ingreso ya cerrado")
    void registrarSalidaDuplicadaRechazada() {
        ingresoAbierto.setFechaSalida(LocalDateTime.now().minusMinutes(5));
        when(historialAccesoRepository.findById(11L)).thenReturn(Optional.of(ingresoAbierto));

        assertThrows(EstadoInvalidoException.class,
                () -> historialAccesoService.registrarSalida(11L));
        verify(historialAccesoRepository, never()).save(any());
    }

    @Test
    @DisplayName("guardar rechaza un segundo ingreso abierto (anti-passback)")
    void guardarRechazaSegundoIngresoAbierto() {
        when(empleadoRepository.findById(7L)).thenReturn(Optional.of(empleado));
        when(historialAccesoRepository.existsByEmpleadoIdAndFechaSalidaIsNull(7L)).thenReturn(true);

        HistorialAccesoDTO dto = new HistorialAccesoDTO();
        dto.setEmpleadoId(7L);

        assertThrows(EstadoInvalidoException.class, () -> historialAccesoService.guardar(dto));
        verify(historialAccesoRepository, never()).save(any());
    }

    @Test
    @DisplayName("listarEnPlanta devuelve solo ingresos sin salida")
    void listarEnPlantaMapeaIngresosAbiertos() {
        when(historialAccesoRepository.findByFechaSalidaIsNullOrderByFechaIngresoDesc())
                .thenReturn(List.of(ingresoAbierto));

        List<HistorialAccesoResponseDTO> enPlanta = historialAccesoService.listarEnPlanta();

        assertEquals(1, enPlanta.size());
        assertEquals("Carlos Mendoza", enPlanta.get(0).getNombreEmpleado());
        assertEquals("Producción", enPlanta.get(0).getDepartamento());
    }
}
