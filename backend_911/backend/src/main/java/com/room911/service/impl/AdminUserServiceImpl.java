package com.room911.service.impl;

import com.room911.dto.AdminUserDTO;
import com.room911.dto.LoginRequestDTO;
import com.room911.dto.LoginResponseDTO;
import com.room911.entity.AdminUser;
import com.room911.repository.AdminUserRepository;
import com.room911.service.interfaces.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final AdminUserRepository adminUserRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public AdminUserDTO crear(AdminUserDTO dto) {

        if (adminUserRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("El usuario ya existe");
        }

        AdminUser admin = AdminUser.builder()
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .nombre(dto.getNombre())
                .activo(true)
                .build();

        AdminUser guardado = adminUserRepository.save(admin);

        return AdminUserDTO.builder()
                .id(guardado.getId())
                .username(guardado.getUsername())
                .nombre(guardado.getNombre())
                .password(null)
                .build();
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO dto) {

        AdminUser admin = adminUserRepository
                .findByUsername(dto.getUsername())
                .orElseThrow(() ->
                        new RuntimeException("Usuario no encontrado"));

        if (!admin.getActivo()) {
            throw new RuntimeException("Usuario inactivo");
        }

        if (!passwordEncoder.matches(dto.getPassword(), admin.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        return LoginResponseDTO.builder()
                .loginCorrecto(true)
                .mensaje("Inicio de sesión exitoso")
                .username(admin.getUsername())
                .nombre(admin.getNombre())
                .build();
    }

    @Override
    public List<AdminUserDTO> listar() {

        return adminUserRepository.findAll()
                .stream()
                .map(admin -> AdminUserDTO.builder()
                        .id(admin.getId())
                        .username(admin.getUsername())
                        .nombre(admin.getNombre())
                        .password(null)
                        .build())
                .toList();
    }
}