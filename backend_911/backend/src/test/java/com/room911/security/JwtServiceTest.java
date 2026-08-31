package com.room911.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pruebas unitarias del emisor/validador de tokens (HS256) sin contexto Spring.
 */
class JwtServiceTest {

    private static final String SECRETO = "secret-de-prueba-0123456789abcdef0123456789abcdef";
    private static final long EXPIRACION_MS = 3_600_000L;

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(SECRETO, EXPIRACION_MS);
    }

    @Test
    @DisplayName("generarToken produce un token válido con subject y rol")
    void generarTokenValido() {
        String token = jwtService.generarToken("superadmin", "SUPER_ADMIN");

        assertNotNull(token);
        assertTrue(jwtService.esValido(token));
        assertEquals("superadmin", jwtService.obtenerUsuario(token));
        assertEquals("SUPER_ADMIN", jwtService.obtenerRol(token));
    }

    @Test
    @DisplayName("Un token alterado se considera inválido")
    void tokenAlteradoEsInvalido() {
        String token = jwtService.generarToken("j.reyes", "ADMIN_ACCESOS");
        String alterado = token.substring(0, token.length() - 4) + "XXXX";

        assertFalse(jwtService.esValido(alterado));
    }

    @Test
    @DisplayName("Un token firmado con otro secret es inválido")
    void tokenConOtroSecretEsInvalido() {
        String token = jwtService.generarToken("j.reyes", "ADMIN_ACCESOS");

        JwtService otro = new JwtService(
                "otro-secret-distinto-0123456789abcdef0123456789abcdef", EXPIRACION_MS);

        assertFalse(otro.esValido(token));
    }

    @Test
    @DisplayName("Texto arbitrario no es un token válido")
    void basuraEsInvalida() {
        assertFalse(jwtService.esValido("no-es-un-jwt"));
        assertFalse(jwtService.esValido(""));
    }
}
