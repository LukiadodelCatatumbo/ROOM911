package com.room911.controller;

import com.room911.dto.HistorialAccesoDTO;
import com.room911.dto.HistorialAccesoResponseDTO;
import com.room911.service.interfaces.HistorialAccesoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historial-acceso")
@RequiredArgsConstructor
public class HistorialAccesoController {
    private final HistorialAccesoService historialAccesoService;

    /**
     * Registrar un ingreso
     */
    @PostMapping
    public ResponseEntity<HistorialAccesoResponseDTO> guardar(
            @Valid @RequestBody HistorialAccesoDTO dto){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(historialAccesoService.guardar(dto));
    }

    /**
     * Listar todo el historial
     */

    @GetMapping
    public List<HistorialAccesoResponseDTO> listar(){
        return historialAccesoService.listar();
    }

    /**
     * Buscar registro por ID
     */

    @GetMapping("/{id}")
    public ResponseEntity<HistorialAccesoResponseDTO> buscarPorId(
            @PathVariable Long id){
        return ResponseEntity.ok(historialAccesoService.buscarPorId(id));
    }

    /**
     * Consultar historial de empleado
     */

    @GetMapping("/empleado/{empleadoId}")
    public ResponseEntity<List<HistorialAccesoResponseDTO>> listarPorEmpleado(
            @PathVariable Long empleadoId){
        return ResponseEntity.ok(historialAccesoService.listarPorEmpleado(empleadoId));
    }

    /**
     * Registrar salida de un empleado
     */

    @PutMapping("/{id}/salida")
    public ResponseEntity<HistorialAccesoResponseDTO> RegistrarSalida(
            @PathVariable Long id){
        return ResponseEntity.ok(historialAccesoService.registrarSalida(id));
    }
}
