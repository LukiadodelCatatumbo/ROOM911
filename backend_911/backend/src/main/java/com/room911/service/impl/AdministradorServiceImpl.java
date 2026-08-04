package com.room911.service.impl;

import com.room911.dto.AdministradorDTO;
import com.room911.entity.Administrador;
import com.room911.repository.AdministradorRepository;
import com.room911.service.interfaces.AdministradorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdministradorServiceImpl implements AdministradorService {
    private final AdministradorRepository  administradorRepository;

    @Override
    public Administrador guardar (AdministradorDTO dto){
        if (administradorRepository.existsByUsuario(dto.getUsuario())){
            throw new RuntimeException("El usuario ya existe");
        }

        if (administradorRepository.existsByCorreo(dto.getCorreo())){
            throw new RuntimeException("El correo ya existe");
    }
        Administrador administrador = Administrador.builder()
                .nombre(dto.getNombre())
                .apellido(dto.getApellido())
                .correo(dto.getCorreo())
                .usuario(dto.getUsuario())
                .contrasena(dto.getContrasena())
                .activo(true)
                .fechaCreacion(LocalDateTime.now())
                .build();
        return administradorRepository.save(administrador);

    }

    @Override
    public List<Administrador> listar(){
        return administradorRepository.findAll();
    }

    @Override
    public Administrador buscarPorId(Long id){
        return administradorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
    }

    @Override
    public Administrador actualizar (Long id, AdministradorDTO dto){
        Administrador administrador = buscarPorId(id);


        administrador.setNombre(dto.getNombre());
        administrador.setApellido(dto.getApellido());
        administrador.setCorreo(dto.getCorreo());
        administrador.setUsuario(dto.getUsuario());
        administrador.setContrasena(dto.getContrasena());
        administrador.setFechaActualizacion(LocalDateTime.now());
        return administradorRepository.save(administrador);
    }

    @Override
    public void eliminar (Long id){
        Administrador administrador = buscarPorId(id);
        administradorRepository.delete(administrador);

    }
}
