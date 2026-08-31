package com.room911.service.impl;

import com.room911.dto.LoginRequestDTO;
import com.room911.dto.LoginResponseDTO;
import com.room911.entity.Administrador;
import com.room911.repository.AdministradorRepository;
import com.room911.security.JwtService;
import com.room911.service.interfaces.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Autenticación contra la base de datos (tabla administradores).
 * Ante credenciales incorrectas o cuenta inactiva se lanza siempre el
 * mismo error genérico para no permitir enumeración de usuarios.
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AdministradorRepository administradorRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    @Transactional(readOnly = true)
    public LoginResponseDTO login(LoginRequestDTO dto) {

        Administrador admin = administradorRepository
                .findByUsuario(dto.getUsername())
                .orElse(null);

        if (admin == null
                || !Boolean.TRUE.equals(admin.getActivo())
                || !passwordEncoder.matches(dto.getPassword(), admin.getContrasena())) {
            throw new BadCredentialsException("Credenciales inválidas");
        }

        String token = jwtService.generarToken(admin.getUsuario(), admin.getRol());

        return LoginResponseDTO.builder()
                .loginCorrecto(true)
                .mensaje("Inicio de sesión exitoso")
                .token(token)
                .username(admin.getUsuario())
                .nombre(admin.getNombre())
                .correo(admin.getCorreo())
                .rol(admin.getRol())
                .build();
    }
}
