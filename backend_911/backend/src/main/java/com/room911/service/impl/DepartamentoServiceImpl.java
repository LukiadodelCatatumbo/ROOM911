package com.room911.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.room911.dto.DepartamentoDTO;
import com.room911.dto.DepartamentoResponseDTO;
import com.room911.entity.Departamento;
import com.room911.mapper.DepartamentoMapper;
import com.room911.repository.DepartamentoRepository;
import com.room911.repository.EmpleadoRepository;
import com.room911.service.interfaces.DepartamentoService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DepartamentoServiceImpl implements DepartamentoService {

    private final DepartamentoRepository departamentoRepository;
    private final EmpleadoRepository empleadoRepository;

    private DepartamentoResponseDTO toDTO(Departamento departamento) {
        long activos = empleadoRepository.countByDepartamentoIdAndActivoTrue(departamento.getId());
        return DepartamentoMapper.toDTO(departamento, activos);
    }

    @Override
    public DepartamentoResponseDTO guardar(DepartamentoDTO dto) {

        if (departamentoRepository.existsByNombre(dto.getNombre())) {
            throw new RuntimeException("El departamento ya existe");
        }

        Departamento departamento = Departamento.builder()
                .nombre(dto.getNombre())
                .codigo(dto.getCodigo())
                .descripcion(dto.getDescripcion())
                .responsable(dto.getResponsable())
                .nivelRestriccion(dto.getNivelRestriccion())
                .capacidadMaxima(dto.getCapacidadMaxima())
                .activo(true)
                .fechaCreacion(LocalDateTime.now())
                .build();

        Departamento guardado = departamentoRepository.save(departamento);

        return toDTO(guardado);
    }

    @Override
    public List<DepartamentoResponseDTO> listar() {

        return departamentoRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();

    }

    @Override
    public DepartamentoResponseDTO buscarPorId(Long id) {

        Departamento departamento = departamentoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Departamento no encontrado"));

        return toDTO(departamento);

    }

    @Override
    public DepartamentoResponseDTO actualizar(Long id, DepartamentoDTO dto) {

        Departamento departamento = departamentoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Departamento no encontrado"));

        if (!departamento.getNombre().equals(dto.getNombre())
                && departamentoRepository.existsByNombre(dto.getNombre())) {
            throw new RuntimeException("El departamento ya existe");
        }

        departamento.setNombre(dto.getNombre());
        departamento.setCodigo(dto.getCodigo());
        departamento.setDescripcion(dto.getDescripcion());
        departamento.setResponsable(dto.getResponsable());
        departamento.setNivelRestriccion(dto.getNivelRestriccion());
        departamento.setCapacidadMaxima(dto.getCapacidadMaxima());
        departamento.setFechaActualizacion(LocalDateTime.now());

        Departamento actualizado = departamentoRepository.save(departamento);

        return toDTO(actualizado);

    }

    @Override
    public void eliminar(Long id) {

        Departamento departamento = departamentoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Departamento no encontrado"));

        /**
         * Aqui se uso el metodo de eliminacion logica, en lugar de eliminar el registro de la base de datos, se cambia el estado del registro a inactivo.
         * Esto permite mantener un historial de los registros eliminados y evitar problemas de integridad referencial con otras tablas que puedan estar relacionadas con este registro.
         */
        departamento.setActivo(false);
        departamento.setFechaActualizacion(LocalDateTime.now());

        departamentoRepository.save(departamento);

    }

    @Override
public void activar(Long id) {

    Departamento departamento = departamentoRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Departamento no encontrado"));

    departamento.setActivo(true);
    departamento.setFechaActualizacion(LocalDateTime.now());

    departamentoRepository.save(departamento);

}

}