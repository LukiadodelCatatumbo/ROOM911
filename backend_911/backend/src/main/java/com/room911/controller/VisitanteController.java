package com.room911.controller;

import com.room911.dto.VisitanteDTO;
import com.room911.dto.VisitanteResponseDTO;
import com.room911.service.interfaces.VisitanteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador encargado de gestionar las operaciones
 * relacionadas con los visitantes
 */
@RestController
@RequestMapping("/api/visitantes")
@RequiredArgsConstructor
public class VisitanteController {

    private final VisitanteService visitanteService;

    /**
     * Registrar un visitante
     */
    @PostMapping
    public ResponseEntity<VisitanteResponseDTO> guardar(
            @Valid @RequestBody VisitanteDTO dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(visitanteService.guardar(dto));
    }

    /**
     * Listar los visitantes activos
     */
    @GetMapping
    public List<VisitanteResponseDTO> listar() {
        return visitanteService.listar();
    }

    /**
     * Buscar un visitante por id
     */
    @GetMapping("/{id}")
    public ResponseEntity<VisitanteResponseDTO> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                visitanteService.buscarPorId(id));
    }

    /**
     * Actualizar la información de un visitante
     */
    @PutMapping("/{id}")
    public ResponseEntity<VisitanteResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody VisitanteDTO dto) {

        return ResponseEntity.ok(
                visitanteService.actualizar(id, dto));
    }

    /**
     * Eliminación lógica del visitante
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {

        visitanteService.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}