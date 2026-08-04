package com.room911.service.interfaces;

import com.room911.dto.EmpleadoDTO;
import com.room911.dto.EmpleadoResponseDTO;
import com.room911.entity.Empleado;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface EmpleadoService {
    EmpleadoResponseDTO guardar(EmpleadoDTO dto);
    List<EmpleadoResponseDTO> listar();
    EmpleadoResponseDTO buscarPorId(Long id);
    EmpleadoResponseDTO actualizar(Long id, EmpleadoDTO dto);
    void eliminar(Long id);
    void importarCSV(MultipartFile archivo, Long departamento);

    List<EmpleadoResponseDTO> buscarPorNombre(String nombre);
    List<EmpleadoResponseDTO> buscarPorApellido(String apellido);
    List<EmpleadoResponseDTO> buscarPorDepartamento(Long departamentoId);
}
