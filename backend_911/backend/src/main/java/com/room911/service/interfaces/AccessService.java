package com.room911.service.interfaces;

import com.room911.dto.AccessRequestDTO;
import com.room911.dto.AccessResponseDTO;

public interface AccessService {
    AccessResponseDTO validarAcceso(AccessRequestDTO dto);
}
