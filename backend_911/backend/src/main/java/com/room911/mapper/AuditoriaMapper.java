package com.room911.mapper;

import com.room911.dto.AuditoriaResponseDTO;
import com.room911.entity.Auditoria;

public class AuditoriaMapper {
    private AuditoriaMapper(){
    }

    public static AuditoriaResponseDTO toDTO(Auditoria auditoria){
        return AuditoriaResponseDTO.builder()
                .id(auditoria.getId())
                .administradorId(auditoria.getAdministrador().getId())
                .nombreAdministrador(auditoria.getAdministrador().getNombre())
                .accion(auditoria.getDescripcion())
                .fecha(auditoria.getFecha())
                .build();
    }
}


