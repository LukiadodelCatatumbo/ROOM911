package com.room911.controller;

import com.room911.dto.AccessQrRequestDTO;
import com.room911.dto.AccessRequestDTO;
import com.room911.dto.AccessResponseDTO;
import com.room911.dto.ColaboradorSimuladorDTO;
import com.room911.dto.PuntoAccesoSimuladorDTO;
import com.room911.service.interfaces.AccessService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/acceso")
@RequiredArgsConstructor
public class AccesoController {
    private final AccessService accessService;

    @PostMapping
    public ResponseEntity<AccessResponseDTO> validarAcceso(
            @Valid @RequestBody AccessRequestDTO dto){
        return ResponseEntity.ok(accessService.validarAcceso(dto));
    }

    /**
     * Lista pública mínima para el simulador/terminal (sin documento ni
     * correo). La ruta /api/acceso/** ya es pública en SecurityConfig.
     */
    @GetMapping("/colaboradores")
    public ResponseEntity<List<ColaboradorSimuladorDTO>> listarColaboradores(){
        return ResponseEntity.ok(accessService.listarColaboradores());
    }

    /** Catálogo autoritativo de puntos de acceso (el simulador ya no lo hardcodea). */
    @GetMapping("/puntos")
    public ResponseEntity<List<PuntoAccesoSimuladorDTO>> listarPuntos(){
        return ResponseEntity.ok(accessService.listarPuntos());
    }

    @PostMapping("/qr")
    public ResponseEntity<AccessResponseDTO> validarAccesoQr(
            @Valid @RequestBody AccessQrRequestDTO dto){
        AccessRequestDTO request = AccessRequestDTO.builder()
                .documento(dto.getCodigoQr())
                .puerta(dto.getPuerta())
                .build();
        return ResponseEntity.ok(accessService.validarAcceso(request));
    }
}
