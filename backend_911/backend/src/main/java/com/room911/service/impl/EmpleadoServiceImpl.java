package com.room911.service.impl;

import com.opencsv.CSVReader;
import com.room911.dto.EmpleadoDTO;
import com.room911.dto.EmpleadoResponseDTO;
import com.room911.entity.Departamento;
import com.room911.entity.Empleado;
import com.room911.exception.RecursoDuplicadoException;
import com.room911.exception.RecursoNoEncontradoException;
import com.room911.exception.EstadoInvalidoException;
import com.room911.mapper.EmpleadoMapper;
import com.room911.repository.DepartamentoRepository;
import com.room911.repository.EmpleadoRepository;
import com.room911.service.interfaces.AuditoriaService;
import com.room911.service.interfaces.EmpleadoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class EmpleadoServiceImpl implements EmpleadoService {

    private final EmpleadoRepository empleadoRepository;
    private final DepartamentoRepository departamentoRepository;
    private final AuditoriaService auditoriaService;

    @Override
    public EmpleadoResponseDTO guardar(EmpleadoDTO dto) {
        if (empleadoRepository.existsByDocumentoAndActivoTrue(dto.getDocumento())) {
            throw new RecursoDuplicadoException("El documento ya esta registrado");
        }

        if (empleadoRepository.existsByCorreoAndActivoTrue(dto.getCorreo())) {
            throw new RecursoDuplicadoException("El correo ya esta registrado");
        }

        Departamento departamento = departamentoRepository.findById(dto.getDepartamentoId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Departamento no encontrado"));

        validarCapacidadDepartamento(departamento, 1);

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
        auditoriaService.registrarOperacion("Crear empleado",
                "documento=" + guardado.getDocumento()
                        + ", cargo=" + guardado.getCargo()
                        + ", departamento=" + departamento.getNombre());
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
                .orElseThrow(() -> new RecursoNoEncontradoException("Empleado no encontrado"));

        if (!empleado.getActivo()) {
            throw new EstadoInvalidoException("El empleado se encuentra inactivo");
        }

        return EmpleadoMapper.toDTO(empleado);
    }

    @Override
    public EmpleadoResponseDTO buscarPorDocumento(String documento) {
        Empleado empleado = empleadoRepository.findByDocumento(documento)
                .orElseThrow(() -> new RecursoNoEncontradoException("Empleado no encontrado"));

        if (!empleado.getActivo()) {
            throw new EstadoInvalidoException("El empleado se encuentra inactivo");
        }

        return EmpleadoMapper.toDTO(empleado);
    }

    @Override
    public List<String> listarCargos() {
        return empleadoRepository.listarCargosDistintos();
    }

    @Override
    public EmpleadoResponseDTO actualizar(Long id, EmpleadoDTO dto) {
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Empleado no encontrado"));

        if (!empleado.getDocumento().equals(dto.getDocumento())
                && empleadoRepository.existsByDocumentoAndActivoTrue(dto.getDocumento())) {
            throw new RecursoDuplicadoException("El documento ya esta registrado");
        }

        if (!empleado.getCorreo().equals(dto.getCorreo())
                && empleadoRepository.existsByCorreoAndActivoTrue(dto.getCorreo())) {
            throw new RecursoDuplicadoException("El correo ya esta registrado");
        }

        Departamento departamento = departamentoRepository.findById(dto.getDepartamentoId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Departamento no encontrado"));

        // La capacidad solo se consume si el empleado cambia de departamento.
        if (departamento.getId().equals(
                empleado.getDepartamento() != null ? empleado.getDepartamento().getId() : null)) {
            validarCapacidadDepartamento(departamento, 0);
        } else {
            validarCapacidadDepartamento(departamento, 1);
        }

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
        auditoriaService.registrarOperacion("Actualizar empleado",
                "id=" + actualizado.getId()
                        + ", documento=" + actualizado.getDocumento()
                        + ", departamento=" + departamento.getNombre()
                        + ", accesoPermitido=" + actualizado.getAccesoPermitido());
        return EmpleadoMapper.toDTO(actualizado);
    }

    @Override
    public void eliminar(Long id) {
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Empleado no encontrado"));

        empleado.setActivo(false);
        empleado.setFechaActualizacion(LocalDateTime.now());
        empleadoRepository.save(empleado);
        log.info("Empleado con ID {} marcado como inactivo (eliminación lógica)", id);
        auditoriaService.registrarOperacion("Eliminar empleado",
                "id=" + id + ", documento=" + empleado.getDocumento()
                        + " (borrado lógico: activo=false)");
    }

    @Override
    public void importarCSV(MultipartFile archivo, Long departamentoId) {
        if (archivo == null || archivo.isEmpty()) {
            throw new IllegalArgumentException("El archivo esta vacio o no fue recibido");
        }
        if (archivo.getSize() > 2 * 1024 * 1024) {
            throw new IllegalArgumentException("El archivo supera el tamano maximo permitido (2 MB)");
        }

        Departamento departamento = departamentoRepository.findById(departamentoId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Departamento no encontrado"));

        // Cupo disponible del departamento: se consume por cada importado.
        Integer capacidadMaxima = departamento.getCapacidadMaxima();
        long ocupados = (capacidadMaxima != null && capacidadMaxima > 0)
                ? empleadoRepository.countByDepartamentoIdAndActivoTrue(departamentoId)
                : 0;

        try (CSVReader csvReader = new CSVReader(new InputStreamReader(archivo.getInputStream()))) {
            String[] datos;
            boolean esHeader = true;
            int numeroFila = 0;
            int importados = 0;
            int duplicados = 0;

            while ((datos = csvReader.readNext()) != null) {
                numeroFila++;
                if (esHeader) {
                    esHeader = false;
                    continue;
                }
                if (datos.length < 5) {
                    throw new IllegalArgumentException(
                            "Fila " + numeroFila + ": se requieren 5 columnas (nombre, apellido, documento, correo, cargo)");
                }

                String nombre = datos[0].trim();
                String apellido = datos[1].trim();
                String documento = datos[2].trim();
                String correo = datos[3].trim();
                String cargo = datos[4].trim();

                validarFilaImportacion(numeroFila, nombre, apellido, documento, correo, cargo);

                if (empleadoRepository.existsByDocumentoAndActivoTrue(documento)
                        || empleadoRepository.existsByCorreoAndActivoTrue(correo)) {
                    duplicados++;
                    log.warn("Fila {} omitida por documento o correo duplicado: doc={}, correo={}",
                            numeroFila, documento, correo);
                    continue;
                }

                if (capacidadMaxima != null && capacidadMaxima > 0) {
                    if (ocupados + 1 > capacidadMaxima) {
                        throw new EstadoInvalidoException(
                                "Capacidad máxima del departamento '" + departamento.getNombre()
                                        + "' alcanzada (" + ocupados + "/" + capacidadMaxima
                                        + "): la fila " + numeroFila + " supera el cupo");
                    }
                    ocupados++;
                }

                Empleado empleado = Empleado.builder()
                        .nombre(nombre)
                        .apellido(apellido)
                        .documento(documento)
                        .correo(correo)
                        .cargo(cargo)
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
            if (importados > 0) {
                auditoriaService.registrarOperacion("Importar empleados (CSV)",
                        "departamento=" + departamento.getNombre()
                                + ", importados=" + importados
                                + ", duplicadosOmitidos=" + duplicados);
            }

        } catch (IllegalArgumentException | EstadoInvalidoException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error al procesar archivo CSV", e);
            throw new IllegalArgumentException("Error al leer el archivo CSV: verifique el formato del archivo");
        }
    }

    /**
     * Valida cada fila con las mismas reglas del DTO de alta manual
     * (documento de 10 digitos, correo con formato valido) para que la
     * importacion masiva no Eluda la validacion de negocio.
     */
    private void validarFilaImportacion(
            int numeroFila, String nombre, String apellido,
            String documento, String correo, String cargo) {
        if (nombre.isBlank() || apellido.isBlank() || cargo.isBlank()) {
            throw new IllegalArgumentException("Fila " + numeroFila + ": nombre, apellido y cargo son obligatorios");
        }
        // Mismos @Size que el DTO: sin esto un campo largo explota tarde en BD
        // con mensaje genérico y rollback de todo el lote.
        if (nombre.length() > 100 || apellido.length() > 100) {
            throw new IllegalArgumentException(
                    "Fila " + numeroFila + ": nombre y apellido no pueden superar 100 caracteres");
        }
        if (cargo.length() > 100) {
            throw new IllegalArgumentException(
                    "Fila " + numeroFila + ": el cargo no puede superar 100 caracteres");
        }
        if (correo.length() > 255) {
            throw new IllegalArgumentException(
                    "Fila " + numeroFila + ": el correo no puede superar 255 caracteres");
        }
        if (!documento.matches("\\d{10}")) {
            throw new IllegalArgumentException(
                    "Fila " + numeroFila + ": el documento debe tener exactamente 10 digitos numericos");
        }
        if (!correo.matches("^[\\w.+-]+@[\\w-]+\\.[\\w.]+$")) {
            throw new IllegalArgumentException("Fila " + numeroFila + ": el correo no tiene un formato valido");
        }
    }

    /**
     * La capacidad_maxima del departamento es una regla de negocio (aforo de
     * áreas GMP): si está definida, bloquea altas que la superen. Sin límite
     * definido (o <= 0) el departamento es ilimitado.
     */
    private void validarCapacidadDepartamento(Departamento departamento, int nuevos) {
        Integer capacidadMaxima = departamento.getCapacidadMaxima();
        if (capacidadMaxima == null || capacidadMaxima <= 0) {
            return;
        }
        long ocupados = empleadoRepository.countByDepartamentoIdAndActivoTrue(departamento.getId());
        if (ocupados + nuevos > capacidadMaxima) {
            throw new EstadoInvalidoException(
                    "Capacidad máxima del departamento '" + departamento.getNombre()
                            + "' alcanzada (" + ocupados + "/" + capacidadMaxima + ")");
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