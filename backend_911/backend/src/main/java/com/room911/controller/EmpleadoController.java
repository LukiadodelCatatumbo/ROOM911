package com.room911.controller;

import com.room911.dto.EmpleadoDTO;
import com.room911.dto.EmpleadoResponseDTO;
import com.room911.service.interfaces.EmpleadoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/empleados")
@RequiredArgsConstructor
public class EmpleadoController {
    private final EmpleadoService empleadoService;

    /**
     *Registrar un nuevo empleado
     */

    @PostMapping
    public ResponseEntity<EmpleadoResponseDTO> guardar(
            @Valid @RequestBody EmpleadoDTO dto){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(empleadoService.guardar(dto));
    }

    /**
     * Listar los empleados activos
     */

    @GetMapping
    public List<EmpleadoResponseDTO> listar(){
        return empleadoService.listar();
    }

    /**
     * Buscar empleado por su id
     */
    @GetMapping("/{id}")
    public ResponseEntity<EmpleadoResponseDTO> buscarPorId(
            @PathVariable Long id){
        return ResponseEntity.ok(empleadoService.buscarPorId(id));
    }

    /**
     * Buscar empleado por su nombre
     */
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<List<EmpleadoResponseDTO>> buscarPorNombre(
            @PathVariable String nombre){
        return ResponseEntity.ok(empleadoService.buscarPorNombre(nombre));
    }

    /**
     * Buscar empleado por su apellido
     */
    @GetMapping("/apellido/{apellido}")
    public ResponseEntity<List<EmpleadoResponseDTO>> buscarPorApellido(
            @PathVariable String apellido){
        return ResponseEntity.ok(empleadoService.buscarPorApellido(apellido));
    }

    /**
     * Buscar empleados por departamento
     */
    @GetMapping("/departamento/{departamentoId}")
    public ResponseEntity<List<EmpleadoResponseDTO>> buscarPorDepartamento(
            @PathVariable Long departamentoId){
        return ResponseEntity.ok(empleadoService.buscarPorDepartamento(departamentoId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmpleadoResponseDTO> actualiza(
            @PathVariable Long id,
            @Valid @RequestBody EmpleadoDTO dto){
        return ResponseEntity.ok(empleadoService.actualizar(id, dto));
    }

    /**
     * Eliminar un empleado
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id){
        empleadoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Importar empleados desde archivo CSV y los
     * asigna a un departamento
     */
    @PostMapping("/importar/{departamentoId}")
    public ResponseEntity<String> importarCSV(
            @RequestParam("archivo") MultipartFile archivo,
            @PathVariable Long departamentoId){
        empleadoService.importarCSV(archivo, departamentoId);

        return ResponseEntity.ok("Archivo importado correctamente");
    }
}
