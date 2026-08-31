package com.room911.controller;

import com.room911.config.SecurityConfig;
import com.room911.dto.LoginRequestDTO;
import com.room911.dto.LoginResponseDTO;
import com.room911.security.JwtService;
import com.room911.service.interfaces.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Pruebas de POST /api/auth/login con la configuración de seguridad real
 * (SecurityConfig + filtro JWT) y el servicio de autenticación simulado.
 */
@WebMvcTest(AuthController.class)
@Import({SecurityConfig.class, JwtService.class, AuthControllerTest.TestBeans.class})
@TestPropertySource(properties = {
        "jwt.secret=secret-de-prueba-0123456789abcdef0123456789abcdef",
        "jwt.expiration-ms=3600000"
})
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    @TestConfiguration
    static class TestBeans {
        // DataInitializer define este bean; se provee para el contexto de test
        @Bean
        PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }
    }

    private static final String BODY_OK =
            "{\"username\":\"superadmin\",\"password\":\"S3gura*2026\"}";

    @Test
    @DisplayName("Login correcto devuelve 200 con token y rol")
    void loginCorrecto() throws Exception {
        when(authService.login(any(LoginRequestDTO.class))).thenReturn(
                LoginResponseDTO.builder()
                        .loginCorrecto(true)
                        .mensaje("Inicio de sesión exitoso")
                        .token("jwt-de-prueba")
                        .username("superadmin")
                        .nombre("Super Administrador")
                        .correo("superadmin@pharma911.com")
                        .rol("SUPER_ADMIN")
                        .build());

        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType("application/json")
                        .content(BODY_OK))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.loginCorrecto").value(true))
                .andExpect(jsonPath("$.token").value("jwt-de-prueba"))
                .andExpect(jsonPath("$.rol").value("SUPER_ADMIN"));
    }

    @Test
    @DisplayName("Credenciales inválidas devuelven 401 genérico (anti-enumeración)")
    void loginIncorrecto() throws Exception {
        when(authService.login(any(LoginRequestDTO.class)))
                .thenThrow(new BadCredentialsException("Credenciales inválidas"));

        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType("application/json")
                        .content(BODY_OK))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.mensaje").value("Credenciales inválidas"));
    }

    @Test
    @DisplayName("Campos vacíos devuelven 400 por validación del DTO")
    void loginSinCampos() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType("application/json")
                        .content("{\"username\":\"\",\"password\":\"\"}"))
                .andExpect(status().isBadRequest());
    }
}
