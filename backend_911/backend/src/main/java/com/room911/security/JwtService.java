package com.room911.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Genera y valida tokens JWT (HS256) con el rol del usuario como claim.
 * El secret y la expiración se resuelven desde variables de entorno
 * (jwt.secret / jwt.expiration-ms en application.properties).
 */
@Component
public class JwtService {

    private final SecretKey clave;
    private final long expiracionMs;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-ms}") long expiracionMs) {
        // Fail-fast: sin secret commiteado, el sistema no debe arrancar jamás
        // con una clave conocida (permitiría forjar tokens SUPER_ADMIN).
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException(
                    "JWT_SECRET no está definida. Configúrala en el entorno "
                            + "(mínimo 32 caracteres aleatorios) y vuelve a arrancar.");
        }
        if (secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException(
                    "JWT_SECRET es demasiado corta: se requieren al menos 32 caracteres "
                            + "para una firma HS256 segura.");
        }
        this.clave = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiracionMs = expiracionMs;
    }

    public String generarToken(String usuario, String rol) {
        Date ahora = new Date();
        return Jwts.builder()
                .subject(usuario)
                .claim("rol", rol)
                .issuedAt(ahora)
                .expiration(new Date(ahora.getTime() + expiracionMs))
                .signWith(clave)
                .compact();
    }

    public String obtenerUsuario(String token) {
        return parsear(token).getSubject();
    }

    public String obtenerRol(String token) {
        return parsear(token).get("rol", String.class);
    }

    public boolean esValido(String token) {
        try {
            parsear(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    private Claims parsear(String token) {
        return Jwts.parser()
                .verifyWith(clave)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
