package com.room911.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Protege la superficie pública /api/acceso/** (consumida por lectores
 * físicos y el simulador) con dos capas:
 *
 * 1. API key por dispositivo (cabecera X-Api-Key contra ACCESO_API_KEY),
 *    comparada en tiempo constante. Fail-closed: si la variable no está
 *    configurada se rechaza TODO para no dejar el control de acceso abierto.
 * 2. Rate limit por IP (ventana fija de 1 minuto) para impedir el spam de
 *    intentos en la auditoría y la enumeración de credenciales.
 */
@Slf4j
public class AccesoApiKeyFilter extends OncePerRequestFilter {

    private static final String CABECERA_API_KEY = "X-Api-Key";
    private static final int MAX_PETICIONES_POR_MINUTO = 60;
    private static final long VENTANA_MS = 60_000L;

    private final String apiKey;
    private final Map<String, Ventana> peticionesPorIp = new ConcurrentHashMap<>();

    private record Ventana(AtomicLong inicio, AtomicInteger contador) {}

    public AccesoApiKeyFilter(String apiKey) {
        this.apiKey = apiKey;
        if (apiKey == null || apiKey.isBlank()) {
            log.error("ACCESO_API_KEY no está definida: /api/acceso/** rechazará todas las peticiones (503)");
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getRequestURI().startsWith("/api/acceso");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        if (apiKey == null || apiKey.isBlank()) {
            response.sendError(HttpServletResponse.SC_SERVICE_UNAVAILABLE,
                    "Punto de acceso no configurado (falta ACCESO_API_KEY)");
            return;
        }

        if (!dentroDelLimite(request.getRemoteAddr())) {
            log.warn("Rate limit excedido en /api/acceso desde {}", request.getRemoteAddr());
            response.setStatus(429); // SC_TOO_MANY_REQUESTS no existe en HttpServletResponse
            response.setContentType("application/json");
            response.getWriter().write("{\"mensaje\":\"Límite de peticiones excedido\"}");
            return;
        }

        String recibida = request.getHeader(CABECERA_API_KEY);
        if (recibida == null || !comparacionSegura(recibida, apiKey)) {
            log.warn("API key inválida o ausente en /api/acceso desde {}", request.getRemoteAddr());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "API key inválida");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean dentroDelLimite(String ip) {
        long ahora = System.currentTimeMillis();
        Ventana ventana = peticionesPorIp.compute(ip, (k, actual) -> {
            if (actual == null || ahora - actual.inicio().get() >= VENTANA_MS) {
                return new Ventana(new AtomicLong(ahora), new AtomicInteger(1));
            }
            actual.contador().incrementAndGet();
            return actual;
        });
        return ventana.contador().get() <= MAX_PETICIONES_POR_MINUTO;
    }

    private boolean comparacionSegura(String recibida, String esperada) {
        return MessageDigest.isEqual(
                recibida.getBytes(StandardCharsets.UTF_8),
                esperada.getBytes(StandardCharsets.UTF_8));
    }
}
