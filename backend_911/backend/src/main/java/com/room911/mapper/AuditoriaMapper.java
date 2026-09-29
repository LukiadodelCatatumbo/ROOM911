package com.room911.mapper;

import com.room911.dto.AuditoriaResponseDTO;
import com.room911.entity.Administrador;
import com.room911.entity.Auditoria;

public class AuditoriaMapper {
    private AuditoriaMapper(){
    }

    public static AuditoriaResponseDTO toDTO(Auditoria auditoria){
        Administrador administrador = auditoria.getAdministrador();
        return AuditoriaResponseDTO.builder()
                .id(auditoria.getId())
                .administradorId(administrador != null ? administrador.getId() : null)
                .nombreAdministrador(administrador != null ? administrador.getNombre() : null)
                .accion(auditoria.getAccion())
                .descripcion(auditoria.getDescripcion())
                .fecha(auditoria.getFecha())
                .build();
    }
}
