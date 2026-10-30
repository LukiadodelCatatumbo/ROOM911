package com.room911.service.impl;

import com.room911.dto.AccessRequestDTO;
import com.room911.dto.AccessResponseDTO;
import com.room911.entity.Departamento;
import com.room911.entity.Empleado;
import com.room911.entity.HistorialAcceso;
import com.room911.entity.PuntoAcceso;
import com.room911.repository.AccessAttemptRepository;
import com.room911.repository.EmpleadoRepository;
import com.room911.repository.HistorialAccesoRepository;
import com.room911.repository.PuntoAccesoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Semántica de la Fase 25 (historial automático del acceso):
 * todo acceso concedido abre un ingreso; el anti-passback deniega
 * mientras exista un ingreso abierto; los denegados no abren ingreso.
 */
@ExtendWith(MockitoExtension.class)
class AccessServiceImplTest {

    @Mock
    private EmpleadoRepository empleadoRepository;
    @Mock
    private AccessAttemptRepository accessAttemptRepository;
    @Mock
    private PuntoAccesoRepository puntoAccesoRepository;
    @Mock
    private HistorialAccesoRepository historialAccesoRepository;

    private AccessServiceImpl accessService;

    private Empleado empleado;
    private PuntoAcceso punto;

    @BeforeEach
    void setUp() {
        accessService = new AccessServiceImpl(
                empleadoRepository,
                accessAttemptRepository,
                puntoAccesoRepository,
                historialAccesoRepository);

        Departamento produccion = Departamento.builder()
                .id(1L)
                .nombre("Producción")
                .build();

        empleado = Empleado.builder()
                .id(7L)
                .nombre("Carlos")
                .apellido("Mendoza")
                .documento("1020304050")
                .departamento(produccion)
                .activo(true)
                .accesoPermitido(true)
                .build();

        // Zona común y franja completa: el test se concentra en la Fase 25,
        // no en horario ni zona (cubierto por la lógica de negocio previa).
        punto = PuntoAcceso.builder()
                .id(3L)
                .codigo("DOOR-TEST-01")
                .nombre("Esclusa de Prueba")
                .zonaComun(true)
                .horaInicio("00:00")
                .horaFin("23:59")
                .activo(true)
                .build();
    }

    private AccessRequestDTO peticion() {
        return AccessRequestDTO.builder()
                .documento("1020304050")
                .puerta("DOOR-TEST-01")
                .build();
    }

    @Test
    @DisplayName("Acceso concedido abre un ingreso automático en historial_acceso")
    void accesoConcedidoAbreIngresoAutomatico() {
        when(empleadoRepository.findByDocumento("1020304050")).thenReturn(Optional.of(empleado));
        when(historialAccesoRepository.existsByEmpleadoIdAndFechaSalidaIsNull(7L)).thenReturn(false);
        when(puntoAccesoRepository.findByCodigo("DOOR-TEST-01")).thenReturn(Optional.of(punto));

        AccessResponseDTO respuesta = accessService.validarAcceso(peticion());

        assertTrue(respuesta.getPermitido());

        ArgumentCaptor<HistorialAcceso> captor = ArgumentCaptor.forClass(HistorialAcceso.class);
        verify(historialAccesoRepository).save(captor.capture());
        HistorialAcceso ingreso = captor.getValue();
        assertEquals(empleado, ingreso.getEmpleado());
        assertEquals(Boolean.TRUE, ingreso.getAccesoPermitido());
        assertTrue(ingreso.getObservaciones().contains("Ingreso automático"));
        assertEquals(punto.getNombre(), ingreso.getObservaciones().replace("Ingreso automático: ", ""));
    }

    @Test
    @DisplayName("Anti-passback: ingreso abierto deniega el acceso y no abre otro ingreso")
    void antiPassbackDeniegaYNoAbreIngreso() {
        when(empleadoRepository.findByDocumento("1020304050")).thenReturn(Optional.of(empleado));
        when(historialAccesoRepository.existsByEmpleadoIdAndFechaSalidaIsNull(7L)).thenReturn(true);

        AccessResponseDTO respuesta = accessService.validarAcceso(peticion());

        assertFalse(respuesta.getPermitido());
        assertTrue(respuesta.getMensaje().contains("requiere registro de salida"));
        verify(historialAccesoRepository, never()).save(any());
        verify(accessAttemptRepository).save(any());
    }

    @Test
    @DisplayName("Intento denegado por credencial no abre ingreso")
    void denegadoPorPermisoNoAbreIngreso() {
        empleado.setAccesoPermitido(false);
        when(empleadoRepository.findByDocumento("1020304050")).thenReturn(Optional.of(empleado));

        AccessResponseDTO respuesta = accessService.validarAcceso(peticion());

        assertFalse(respuesta.getPermitido());
        verify(historialAccesoRepository, never()).save(any());
        verify(accessAttemptRepository).save(any());
    }

    @Test
    @DisplayName("Credencial no registrada: se audita la evidencia y no hay ingreso")
    void noRegistradoGuardaEvidenciaSinIngreso() {
        when(empleadoRepository.findByDocumento("9999999999")).thenReturn(Optional.empty());

        AccessResponseDTO respuesta = accessService.validarAcceso(
                AccessRequestDTO.builder().documento("9999999999").puerta("DOOR-TEST-01").build());

        assertFalse(respuesta.getPermitido());
        verify(historialAccesoRepository, never()).save(any());

        ArgumentCaptor<com.room911.entity.AccessAttempt> captor =
                ArgumentCaptor.forClass(com.room911.entity.AccessAttempt.class);
        verify(accessAttemptRepository).save(captor.capture());
        assertEquals("9999999999", captor.getValue().getDocumentoIntentado());
        assertFalse(captor.getValue().getExito());
    }

    // ===================== Puerta de salida (Fase 27) =====================

    @Test
    @DisplayName("Puerta de salida: cierra el ingreso abierto más reciente")
    void salidaCierraIngresoAbierto() {
        when(empleadoRepository.findByDocumento("1020304050")).thenReturn(Optional.of(empleado));
        HistorialAcceso ingreso = HistorialAcceso.builder()
                .id(11L)
                .empleado(empleado)
                .fechaIngreso(LocalDateTime.now().minusHours(2))
                .accesoPermitido(true)
                .observaciones("Ingreso automático: Esclusa de Prueba")
                .build();
        when(historialAccesoRepository.findFirstByEmpleadoIdAndFechaSalidaIsNullOrderByFechaIngresoDesc(7L))
                .thenReturn(Optional.of(ingreso));

        AccessResponseDTO respuesta = accessService.registrarSalida(peticion());

        assertTrue(respuesta.getPermitido());
        assertNotNull(ingreso.getFechaSalida());
        assertTrue(ingreso.getObservaciones().contains("Salida registrada"));
        verify(historialAccesoRepository).save(ingreso);
        verify(accessAttemptRepository).save(any());
    }

    @Test
    @DisplayName("Puerta de salida: sin ingreso abierto se rechaza y no cierra nada")
    void salidaSinIngresoAbiertoSeRechaza() {
        when(empleadoRepository.findByDocumento("1020304050")).thenReturn(Optional.of(empleado));
        when(historialAccesoRepository.findFirstByEmpleadoIdAndFechaSalidaIsNullOrderByFechaIngresoDesc(7L))
                .thenReturn(Optional.empty());

        AccessResponseDTO respuesta = accessService.registrarSalida(peticion());

        assertFalse(respuesta.getPermitido());
        assertTrue(respuesta.getMensaje().contains("no tiene un ingreso abierto"));
        verify(historialAccesoRepository, never()).save(any());
        verify(accessAttemptRepository).save(any());
    }

    @Test
    @DisplayName("Puerta de salida: credencial no registrada audita la evidencia")
    void salidaNoRegistradoGuardaEvidencia() {
        when(empleadoRepository.findByDocumento("9999999999")).thenReturn(Optional.empty());

        AccessResponseDTO respuesta = accessService.registrarSalida(
                AccessRequestDTO.builder().documento("9999999999").build());

        assertFalse(respuesta.getPermitido());
        verify(historialAccesoRepository, never()).save(any());

        ArgumentCaptor<com.room911.entity.AccessAttempt> captor =
                ArgumentCaptor.forClass(com.room911.entity.AccessAttempt.class);
        verify(accessAttemptRepository).save(captor.capture());
        assertEquals("9999999999", captor.getValue().getDocumentoIntentado());
        assertFalse(captor.getValue().getExito());
    }
}
