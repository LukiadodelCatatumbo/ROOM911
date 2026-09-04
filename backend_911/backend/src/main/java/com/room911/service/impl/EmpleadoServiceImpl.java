package com.room911.service.impl;

import com.opencsv.CSVReader;
import com.room911.dto.EmpleadoDTO;
import com.room911.dto.EmpleadoResponseDTO;
import com.room911.entity.Departamento;
import com.room911.entity.Empleado;
import com.room911.mapper.EmpleadoMapper;
import com.room911.repository.DepartamentoRepository;
import com.room911.repository.EmpleadoRepository;
import com.room911.service.interfaces.EmpleadoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmpleadoServiceImpl implements EmpleadoService {

    private final EmpleadoRepository empleadoRepository;
    private final DepartamentoRepository departamentoRepository;

    @Override
    public EmpleadoResponseDTO guardar(EmpleadoDTO dto) {
        if (empleadoRepository.existsByDocumentoAndActivoTrue(dto.getDocumento())) {
            throw new RuntimeException("El documento ya esta registrado");
        }

        if (empleadoRepository.existsByCorreoAndActivoTrue(dto.getCorreo())) {
            throw new RuntimeException("El correo ya esta registrado");
        }

        Departamento departamento = departamentoRepository.findById(dto.getDepartamentoId())
                .orElseThrow(() -> new RuntimeException("Departamento no encontrado"));

        Empleado empleado = Empleado.builder()
                .nombre(dto.getNombre())
                .apellido(dto.getApellido())
                .documento(dto.getDocumento())
                .correo(dto.getCorreo())
                .cargo(dto.getCargo())
                .departamento(departamento)
                .activo(true)
                .accesoPermitido(dto.getAccesoPermitido() != null ? dto.getAccesoPermitido() : true)
                .fechaCreacion(LocalDateTime.now())
                .build();
        Empleado guardado = empleadoRepository.save(empleado);
        log.info("Empleado registrado exitosamente: {} con ID {}", guardado.getNombre(), guardado.getId());
        return EmpleadoMapper.toDTO(guardado);
    }

    @Override
    public List<EmpleadoResponseDTO> listar() {
        List<Empleado> empleados = empleadoRepository.findByActivoTrue();
        log.debug("Empleados activos encontrados: {}", empleados.size());

        return empleados.stream()
                .map(EmpleadoMapper::toDTO)
                .toList();
    }

    @Override
    public EmpleadoResponseDTO buscarPorId(Long id) {
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        if (!empleado.getActivo()) {
            throw new RuntimeException("El empleado se encuentra inactivo");
        }

        return EmpleadoMapper.toDTO(empleado);
    }

    @Override
    public EmpleadoResponseDTO actualizar(Long id, EmpleadoDTO dto) {
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        if (!empleado.getDocumento().equals(dto.getDocumento())
                && empleadoRepository.existsByDocumentoAndActivoTrue(dto.getDocumento())) {
            throw new RuntimeException("El documento ya esta registrado");
        }

        if (!empleado.getCorreo().equals(dto.getCorreo())
                && empleadoRepository.existsByCorreoAndActivoTrue(dto.getCorreo())) {
            throw new RuntimeException("El correo ya esta registrado");
        }

        Departamento departamento = departamentoRepository.findById(dto.getDepartamentoId())
                .orElseThrow(() -> new RuntimeException("Departamento no encontrado"));
        empleado.setNombre(dto.getNombre());
        empleado.setApellido(dto.getApellido());
        empleado.setDocumento(dto.getDocumento());
        empleado.setCorreo(dto.getCorreo());
        empleado.setCargo(dto.getCargo());
        empleado.setDepartamento(departamento);
        if (dto.getAccesoPermitido() != null) {
            empleado.setAccesoPermitido(dto.getAccesoPermitido());
        }
        empleado.setFechaActualizacion(LocalDateTime.now());

        Empleado actualizado = empleadoRepository.save(empleado);
        log.info("Empleado actualizado exitosamente con ID {}", actualizado.getId());
        return EmpleadoMapper.toDTO(actualizado);
    }

    @Override
    public void eliminar(Long id) {
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        empleado.setActivo(false);
        empleado.setFechaActualizacion(LocalDateTime.now());
        empleadoRepository.save(empleado);
        log.info("Empleado con ID {} marcado como inactivo (eliminación lógica)", id);
    }

    @Override
    public void importarCSV(MultipartFile archivo, Long departamentoId) {
        Departamento departamento = departamentoRepository.findById(departamentoId)
                .orElseThrow(() -> new RuntimeException("Departamento no encontrado"));

        try (CSVReader csvReader = new CSVReader(new InputStreamReader(archivo.getInputStream()))) {
            String[] datos;
            boolean esHeader = true;
            int importados = 0;
            int duplicados = 0;

            while ((datos = csvReader.readNext()) != null) {
                if (esHeader) {
                    esHeader = false;
                    continue;
                }
                if (datos.length < 5) {
                    log.warn("Fila CSV ignorada por columnas insuficientes: {}", datos.length);
                    continue;
                }

                String documento = datos[2].trim();
                String correo = datos[3].trim();

                if (empleadoRepository.existsByDocumentoAndActivoTrue(documento)
                        || empleadoRepository.existsByCorreoAndActivoTrue(correo)) {
                    duplicados++;
                    log.warn("Fila omitida por documento o correo duplicado: doc={}, correo={}", documento, correo);
                    continue;
                }

                Empleado empleado = Empleado.builder()
                        .nombre(datos[0].trim())
                        .apellido(datos[1].trim())
                        .documento(documento)
                        .correo(correo)
                        .cargo(datos[4].trim())
                        .departamento(departamento)
                        .activo(true)
                        .accesoPermitido(true)
                        .fechaCreacion(LocalDateTime.now())
                        .build();
                empleadoRepository.save(empleado);
                importados++;
                log.info("Empleado importado: {}", empleado.getNombre());
            }

            log.info("Importación finalizada. Importados: {}, Duplicados omitidos: {}", importados, duplicados);

        } catch (Exception e) {
            log.error("Error al procesar archivo CSV", e);
            throw new RuntimeException("Error al leer el archivo CSV: " + e.getMessage());
        }
    }

    @Override
    public List<EmpleadoResponseDTO> buscarPorNombre(String nombre){
        return empleadoRepository
                .findByNombreContainingIgnoreCaseAndActivoTrue(nombre)
                .stream()
                .map(EmpleadoMapper::toDTO)
                .toList();
    }

    @Override
    public List<EmpleadoResponseDTO> buscarPorApellido(String apellido){
        return empleadoRepository
                .findByApellidoContainingIgnoreCaseAndActivoTrue(apellido)
                .stream()
                .map(EmpleadoMapper::toDTO)
                .toList();
    }

    @Override
    public List<EmpleadoResponseDTO> buscarPorDepartamento(Long departamentoId){
        return empleadoRepository
                .findByDepartamentoIdAndActivoTrue(departamentoId)
                .stream()
                .map(EmpleadoMapper::toDTO)
                .toList();
    }
}