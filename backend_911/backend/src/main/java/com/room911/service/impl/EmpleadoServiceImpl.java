package com.room911.service.impl;

import com.room911.dto.EmpleadoDTO;
import com.room911.dto.EmpleadoResponseDTO;
import com.room911.entity.Departamento;
import com.room911.entity.Empleado;
import com.room911.mapper.EmpleadoMapper;
import com.room911.repository.DepartamentoRepository;
import com.room911.repository.EmpleadoRepository;
import com.room911.service.interfaces.EmpleadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmpleadoServiceImpl implements EmpleadoService {

    private final EmpleadoRepository empleadoRepository;
    private final DepartamentoRepository departamentoRepository;

    @Override
    public EmpleadoResponseDTO guardar(EmpleadoDTO dto) {
        if (empleadoRepository.existsByDocumento(dto.getDocumento())){
            throw new RuntimeException("El documento ya esta registrado");
        }

        if (empleadoRepository.existsByCorreo(dto.getCorreo())){
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
        return EmpleadoMapper.toDTO(guardado);
    }

    @Override
    public List<EmpleadoResponseDTO> listar() {
        List<Empleado> empleados = empleadoRepository.findByActivoTrue();

        System.out.println("Empleados activos encontrados: " + empleados.size());

        return empleados.stream()
                .map(EmpleadoMapper::toDTO)
                .toList();
    }

    @Override
    public EmpleadoResponseDTO buscarPorId(Long id) {
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        if (!empleado.getActivo()){
            throw new RuntimeException("El empleado se encuentra inactivo");
        }

        return EmpleadoMapper.toDTO(empleado);
    }

    @Override
    public EmpleadoResponseDTO actualizar(Long id, EmpleadoDTO dto) {
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        if (!empleado.getDocumento().equals(dto.getDocumento())
        && empleadoRepository.existsByDocumento(dto.getDocumento())){
            throw new RuntimeException("El documento ya esta registrado");
        }

        if (!empleado.getCorreo().equals(dto.getCorreo())
        && empleadoRepository.existsByCorreo(dto.getCorreo())){
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
        if (dto.getAccesoPermitido() != null){
            empleado.setAccesoPermitido(dto.getAccesoPermitido());
        }
        empleado.setFechaActualizacion(LocalDateTime.now());

        Empleado actualizado = empleadoRepository.save(empleado);
        return EmpleadoMapper.toDTO(actualizado);
    }

    @Override
    public void eliminar(Long id) {

        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        /**
         * Se usa la eliminacion logica para conservar el historial del empleado
         * y asi evitar problemas de integridad referencial con otras entidades
         * que pueden estar relacionadas
         */
        empleado.setActivo(false);
        empleado.setFechaActualizacion(LocalDateTime.now());
        empleadoRepository.save(empleado);
    }

    @Override
    public void importarCSV(MultipartFile archivo, Long departamentoId){
        Departamento departamento = departamentoRepository.findById(departamentoId)
                .orElseThrow(() -> new RuntimeException("Departamento no encontrado"));

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(archivo.getInputStream()))){

            String linea = reader.readLine();

            int importados = 0;
            int duplicados = 0;

            while ((linea = reader.readLine()) != null){
                String[] datos = linea.split("[,\t]");

                System.out.println("Columnas detectadas: " + datos.length);
                if (datos.length < 5){
                    System.out.println("Fila ignorada");
                    continue;
                }

                System.out.println("Documento: " + datos[2].trim());

                if (empleadoRepository.existsByDocumento(datos[2].trim())){
                    duplicados++;
                    System.out.println("Documento duplicado");
                    continue;
                }

                Empleado empleado = Empleado.builder()
                        .nombre(datos[0].trim())
                        .apellido(datos[1].trim())
                        .documento(datos[2].trim())
                        .correo(datos[3].trim())
                        .cargo(datos[4].trim())
                        .departamento(departamento)
                        .activo(true)
                        .accesoPermitido(true)
                        .fechaCreacion(LocalDateTime.now())
                        .build();
                empleadoRepository.save(empleado);
                importados++;
                System.out.println("Empleado guardado: " + empleado.getNombre());
            }

            System.out.println("Importacion de empleados finalizada");
            System.out.println("Empleados importados : " + importados);
            System.out.println("Empleados duplicados : " + duplicados);

        } catch (IOException e){
            throw new RuntimeException("Error al leer el archivo CSV");
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