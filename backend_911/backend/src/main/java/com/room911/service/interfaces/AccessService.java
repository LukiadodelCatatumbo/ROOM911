package com.room911.service.interfaces;

import com.room911.dto.AccessRequestDTO;
import com.room911.dto.AccessResponseDTO;
import com.room911.dto.ColaboradorSimuladorDTO;
import com.room911.dto.PuntoAccesoSimuladorDTO;

import java.util.List;

public interface AccessService {
    AccessResponseDTO validarAcceso(AccessRequestDTO dto);

    /**
     * Puerta de salida (Fase 27): cierra el ingreso abierto del empleado.
     * Sin validación de punto, horario ni zona: salir siempre debe ser posible.
     */
    AccessResponseDTO registrarSalida(AccessRequestDTO dto);

    /** Lista pública mínima para el simulador (sin documento ni correo). */
    List<ColaboradorSimuladorDTO> listarColaboradores();

    /** Catálogo autoritativo de puntos de acceso y sus franjas horarias. */
    List<PuntoAccesoSimuladorDTO> listarPuntos();
}
