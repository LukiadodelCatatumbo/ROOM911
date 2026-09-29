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
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Protege la superficie pública /api/acceso/** (consumida por lectores
 * físicos y el simulador) con dos capas:
 *
 * 1. API key por dispositivo (cabecera X-Api-Key contra ACCESO_API_KEY),
 *    comparada en tiempo constante. Fail-closed: si la variable no está
 *    configurada se rechaza TODO para no dejar el control de acceso abierto.
 * 2. Rate limit por IP (ventana deslizante de 1 minuto) para impedir el spam
 *    de intentos en la auditoría y la enumeración de credenciales. Se aplica
 *    ANTES de validar la API key para frenar también su fuerza bruta.
 *    Limitación conocida: tras un reverse proxy todas las clientes comparten
 *    la IP del proxy (no se confía en X-Forwarded-For porque es spoofeable);
 *    en ese escenario conviene limitar por IP real en el proxy.
 */
@Slf4j
public class AccesoApiKeyFilter extends OncePerRequestFilter {

    private static final String CABECERA_API_KEY = "X-Api-Key";
    private static final int MAX_PETICIONES_POR_MINUTO = 60;
    private static final long VENTANA_MS = 60_000L;
    /** Tope de IPs antes de expurgar (evita crecimiento ilimitado con IPs rotativas). */
    private static final int MAX_IPS = 10_000;

    private final String apiKey;
    private final Map<String, Deque<Long>> peticionesPorIp = new ConcurrentHashMap<>();

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
        // compute es atómico por clave: toda mutación de la cola ocurre aquí dentro.
        Deque<Long> marcas = peticionesPorIp.compute(ip, (k, actual) -> {
            Deque<Long> cola = (actual != null) ? actual : new ArrayDeque<>();
            while (!cola.isEmpty() && ahora - cola.peekFirst() >= VENTANA_MS) {
                cola.pollFirst();
            }
            cola.addLast(ahora);
            return cola;
        });
        purgarIpsVencidas(ahora);
        return marcas.size() <= MAX_PETICIONES_POR_MINUTO;
    }

    /** Descarta las colas cuya última petición ya salió de la ventana (IPs que no vuelven). */
    private void purgarIpsVencidas(long ahora) {
        if (peticionesPorIp.size() <= MAX_IPS) {
            return;
        }
        peticionesPorIp.entrySet().removeIf(e -> {
            Long ultima = e.getValue().peekLast();
            return ultima == null || ahora - ultima >= VENTANA_MS;
        });
    }

    private boolean comparacionSegura(String recibida, String esperada) {
        return MessageDigest.isEqual(
                recibida.getBytes(StandardCharsets.UTF_8),
                esperada.getBytes(StandardCharsets.UTF_8));
    }
}
