package com.room911.service.interfaces;

import com.room911.dto.AccessAttemptDTO;
import com.room911.dto.PaginaResponseDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface AccessAttemptService {
    AccessAttemptDTO save(AccessAttemptDTO dto);

    /** Listado paginado de servidor con filtros opcionales. */
    PaginaResponseDTO<AccessAttemptDTO> listar(
            int pagina,
            int tamano,
            Boolean exito,
            LocalDate desde,
            LocalDate hasta,
            String texto
    );

    AccessAttemptDTO findById(Long id);

    List<AccessAttemptDTO> findByEmpleado(Long empleadoId);
    List<AccessAttemptDTO> findByEmpleadoAndFecha(
            Long empleadoId,
            LocalDateTime inicio,
            LocalDateTime fin
    );
}