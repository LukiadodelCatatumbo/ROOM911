package com.room911.service.interfaces;

import com.room911.dto.AdministradorDTO;
import com.room911.entity.Administrador;

import java.util.List;

public interface AdministradorService {
    Administrador guardar (AdministradorDTO dto);
    List<Administrador> listar();
    Administrador buscarPorId(Long id);
    Administrador actualizar (Long id, AdministradorDTO dto);
    void eliminar(Long id);
}
