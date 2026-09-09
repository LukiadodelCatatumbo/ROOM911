package com.room911.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Verifica la protección de la superficie pública /api/acceso/**:
 * API key obligatoria (fail-closed si ACCESO_API_KEY no está configurada)
 * y 401 ante claves inválidas.
 */
@WebMvcTest(controllers = com.room911.controller.AccesoController.class)
@Import({com.room911.config.SecurityConfig.class, com.room911.security.JwtService.class, AccesoApiKeyTest.TestBeans.class})
@TestPropertySource(properties = {
        "jwt.secret=secret-de-prueba-0123456789abcdef0123456789abcdef",
        "jwt.expiration-ms=3600000",
        "acceso.api-key=apikey-de-prueba-0123456789abcdef"
})
class AccesoApiKeyTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private com.room911.service.interfaces.AccessService accessService;

    @TestConfiguration
    static class TestBeans {
        @Bean
        PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }
    }

    @Test
    @DisplayName("GET /api/acceso/colaboradores sin API key devuelve 401")
    void sinApiKey() throws Exception {
        mockMvc.perform(get("/api/acceso/colaboradores"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/acceso/colaboradores con API key inválida devuelve 401")
    void conApiKeyInvalida() throws Exception {
        mockMvc.perform(get("/api/acceso/colaboradores").header("X-Api-Key", "clave-equivocada"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/acceso/colaboradores con API key válida pasa el filtro")
    void conApiKeyValida() throws Exception {
        whenListaVacia();
        mockMvc.perform(get("/api/acceso/colaboradores").header("X-Api-Key", "apikey-de-prueba-0123456789abcdef"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST /api/acceso sin API key devuelve 401 (no se puede operar la puerta)")
    void postSinApiKey() throws Exception {
        mockMvc.perform(post("/api/acceso")
                        .contentType("application/json")
                        .content("{\"documento\":\"1234567890\",\"puerta\":\"DOOR-PROD-01\"}"))
                .andExpect(status().isUnauthorized());
    }

    private void whenListaVacia() {
        org.mockito.Mockito.when(accessService.listarColaboradores()).thenReturn(java.util.List.of());
    }
}
