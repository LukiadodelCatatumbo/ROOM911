package com.room911.controller;

import com.room911.dto.AccessRequestDTO;
import com.room911.dto.AccessResponseDTO;
import com.room911.service.interfaces.AccessService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
