package com.room911.mapper;

import com.room911.dto.AdministradorResponseDTO;
import com.room911.entity.Administrador;

public class AdministradorMapper {

    public static AdministradorResponseDTO toDTO(Administrador administrador){

        return AdministradorResponseDTO.builder()
                .id(administrador.getId())
                .nombre(administrador.getNombre())
                .apellido(administrador.getApellido())
                .correo(administrador.getCorreo())
                .usuario(administrador.getUsuario())
                .activo(administrador.getActivo())
                .fechaCreacion(administrador.getFechaCreacion())
                .fechaActualizacion(administrador.getFechaActualizacion())
                .build();
    }
}