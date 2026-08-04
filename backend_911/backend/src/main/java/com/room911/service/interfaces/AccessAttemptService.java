package com.room911.service.interfaces;

import com.room911.dto.AccessAttemptDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface AccessAttemptService {
    AccessAttemptDTO save(AccessAttemptDTO dto);
    List<AccessAttemptDTO> findAll();
    AccessAttemptDTO findById(Long id);

    List<AccessAttemptDTO> findByEmpleado(Long empleadoId);
    List<AccessAttemptDTO> findByEmpleadoAndFecha(
            Long empleadoId,
            LocalDateTime inicio,
            LocalDateTime fin
    );
}