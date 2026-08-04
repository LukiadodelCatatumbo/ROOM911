package com.room911.controller;

import com.room911.dto.AdminUserDTO;
import com.room911.dto.LoginRequestDTO;
import com.room911.dto.LoginResponseDTO;
import com.room911.service.interfaces.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    /**
     * Registrar un administrador
     */
    @PostMapping
    public ResponseEntity<AdminUserDTO> crear(
            @RequestBody AdminUserDTO dto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(adminUserService.crear(dto));
    }

    /**
     * Listar administradores
     */
    @GetMapping
    public ResponseEntity<List<AdminUserDTO>> listar() {

        return ResponseEntity.ok(
                adminUserService.listar()
        );
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @RequestBody LoginRequestDTO dto) {

        return ResponseEntity.ok(
                adminUserService.login(dto)
        );
    }

}