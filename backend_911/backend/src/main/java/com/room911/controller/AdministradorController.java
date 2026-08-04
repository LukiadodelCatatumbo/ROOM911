package com.room911.controller;


import com.room911.dto.AdministradorDTO;
import com.room911.entity.Administrador;
import com.room911.service.interfaces.AdministradorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.room911.dto.AdministradorResponseDTO;
import com.room911.mapper.AdministradorMapper;

import java.util.List;

@RestController
@RequestMapping("/api/administradores")
@RequiredArgsConstructor
public class AdministradorController {
    private final AdministradorService administradorService;

    @PostMapping
    public ResponseEntity<AdministradorResponseDTO> guardar(
            @Valid @RequestBody AdministradorDTO dto) {

        Administrador administrador = administradorService.guardar(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(AdministradorMapper.toDTO(administrador));
    }

    @GetMapping
    public List<AdministradorResponseDTO> listar() {
        return administradorService.listar().stream()
                .map(AdministradorMapper::toDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdministradorResponseDTO> buscarPorId(
            @PathVariable Long id){
        return ResponseEntity.ok(
                AdministradorMapper.toDTO(administradorService.buscarPorId(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdministradorResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody AdministradorDTO dto) {

        return ResponseEntity.ok(AdministradorMapper.toDTO(administradorService.actualizar(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        administradorService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
