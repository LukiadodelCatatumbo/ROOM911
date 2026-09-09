package com.room911.controller;

import com.room911.dto.AuditoriaDTO;
import com.room911.dto.AuditoriaResponseDTO;
import com.room911.service.interfaces.AuditoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auditoria")
@RequiredArgsConstructor
public class AuditoriaController {

    private final AuditoriaService auditoriaService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_SISTEMAS')")
    public AuditoriaResponseDTO guardar(@Valid @RequestBody AuditoriaDTO dto) {
        return auditoriaService.guardar(dto);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_SISTEMAS')")
    public List<AuditoriaResponseDTO> listar() {
        return auditoriaService.listar();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_SISTEMAS')")
    public AuditoriaResponseDTO buscarPorId(@PathVariable Long id) {
        return auditoriaService.buscarPorId(id);
    }

    @GetMapping("/administrador/{administradorId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_SISTEMAS')")
    public List<AuditoriaResponseDTO> buscarPorAdministrador(
            @PathVariable Long administradorId) {

        return auditoriaService.buscarPorAdministrador(administradorId);
    }
}