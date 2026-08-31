package com.room911.controller;

import com.room911.config.SecurityConfig;
import com.room911.entity.Administrador;
import com.room911.security.JwtService;
import com.room911.service.interfaces.AdministradorService;
import com.room911.service.interfaces.DashboardService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Verifica el control de acceso por roles del backend:
 * 401 sin token, 403 con rol insuficiente y 200/201 con el rol correcto.
 */
@WebMvcTest(controllers = {DashboardController.class, AdministradorController.class})
@Import({SecurityConfig.class, JwtService.class, RoleSecurityTest.TestBeans.class})
@TestPropertySource(properties = {
        "jwt.secret=secret-de-prueba-0123456789abcdef0123456789abcdef",
        "jwt.expiration-ms=3600000"
})
class RoleSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private DashboardService dashboardService;

    @MockitoBean
    private AdministradorService administradorService;

    @TestConfiguration
    static class TestBeans {
        @Bean
        PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }
    }

    private static final String BODY_ADMIN =
            "{\"nombre\":\"Ana\",\"apellido\":\"Martínez\",\"correo\":\"a.martinez@pharma911.com\","
                    + "\"usuario\":\"a.martinez\",\"contrasena\":\"S3gura*2026\",\"rol\":\"ADMIN_ACCESOS\"}";

    @Test
    @DisplayName("GET /api/dashboard/resumen sin token devuelve 401")
    void dashboardSinToken() throws Exception {
        mockMvc.perform(get("/api/dashboard/resumen"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/dashboard/resumen con rol válido devuelve 200")
    @WithMockUser(username = "j.reyes", roles = "ADMIN_ACCESOS")
    void dashboardConRolValido() throws Exception {
        when(dashboardService.obtenerResumen()).thenReturn(new
                com.room911.dto.DashboardResumenDTO(0L, 0L, 0L, 0L, 0L, 0L));

        mockMvc.perform(get("/api/dashboard/resumen"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST /api/administradores con ADMIN_ACCESOS devuelve 403")
    @WithMockUser(username = "j.reyes", roles = "ADMIN_ACCESOS")
    void crearAdminSinRolSuficiente() throws Exception {
        mockMvc.perform(post("/api/administradores")
                        .with(csrf())
                        .contentType("application/json")
                        .content(BODY_ADMIN))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("POST /api/administradores con SUPER_ADMIN devuelve 201")
    @WithMockUser(username = "superadmin", roles = "SUPER_ADMIN")
    void crearAdminConSuperAdmin() throws Exception {
        when(administradorService.guardar(any())).thenReturn(
                Administrador.builder()
                        .id(1L)
                        .nombre("Ana")
                        .apellido("Martínez")
                        .correo("a.martinez@pharma911.com")
                        .usuario("a.martinez")
                        .rol("ADMIN_ACCESOS")
                        .activo(true)
                        .build());

        mockMvc.perform(post("/api/administradores")
                        .with(csrf())
                        .contentType("application/json")
                        .content(BODY_ADMIN))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.usuario").value("a.martinez"))
                .andExpect(jsonPath("$.rol").value("ADMIN_ACCESOS"));
    }

    @Test
    @DisplayName("DELETE /api/administradores/1 con ADMIN_SISTEMAS devuelve 403")
    @WithMockUser(username = "a.sanchez", roles = "ADMIN_SISTEMAS")
    void eliminarAdminSinSerSuper() throws Exception {
        mockMvc.perform(delete("/api/administradores/1").with(csrf()))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("DELETE /api/administradores/1 con SUPER_ADMIN devuelve 204")
    @WithMockUser(username = "superadmin", roles = "SUPER_ADMIN")
    void eliminarAdminConSuper() throws Exception {
        doNothing().when(administradorService).eliminar(1L);

        mockMvc.perform(delete("/api/administradores/1").with(csrf()))
                .andExpect(status().isNoContent());
    }
}
