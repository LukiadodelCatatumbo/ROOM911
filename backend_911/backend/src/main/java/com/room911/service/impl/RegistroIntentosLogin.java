package com.room911.service.impl;

import com.room911.exception.CuentaBloqueadaException;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Registro en memoria de intentos fallidos de login por usuario.
 * Tras MAX_INTENTOS fallos dentro de la ventana, la cuenta queda
 * bloqueada durante la misma ventana (protección anti fuerza bruta).
 * Diseño simple stateless-compatible: suficiente para despliegue de
 * instancia única; en cluster convendría Redis.
 */
@Component
public class RegistroIntentosLogin {

    private static final int MAX_INTENTOS = 5;
    private static final long VENTANA_MS = 15 * 60_000L;
    /**
     * Tope de entradas antes de expurgar: un atacante que spammea usuarios
     * inventados (que nunca llegan a `limpiar` por login exitoso) no puede
     * hacer crecer el mapa indefinidamente (DoS de memoria).
     */
    private static final int MAX_REGISTROS = 10_000;

    private record Registro(long primerFallo, int fallos) {}

    private final Map<String, Registro> fallosPorUsuario = new ConcurrentHashMap<>();

    /** Lanza CuentaBloqueadaException (→ 429) si el usuario está bloqueado. */
    public void verificarBloqueo(String usuario) {
        Registro registro = fallosPorUsuario.get(usuario);
        if (registro == null) {
            return;
        }
        long ahora = System.currentTimeMillis();
        if (ahora - registro.primerFallo() < VENTANA_MS && registro.fallos() >= MAX_INTENTOS) {
            long segundosRestantes = (VENTANA_MS - (ahora - registro.primerFallo())) / 1000;
            throw new CuentaBloqueadaException(
                    "Cuenta temporalmente bloqueada por intentos fallidos repetidos. "
                            + "Intente de nuevo en " + Math.max(1, segundosRestantes / 60 + 1) + " minuto(s).");
        }
    }

    public void registrarFallo(String usuario) {
        purgarSiNecesario();
        long ahora = System.currentTimeMillis();
        fallosPorUsuario.compute(usuario, (k, actual) -> {
            if (actual == null || ahora - actual.primerFallo() >= VENTANA_MS) {
                return new Registro(ahora, 1);
            }
            return new Registro(actual.primerFallo(), actual.fallos() + 1);
        });
    }

    public void limpiar(String usuario) {
        fallosPorUsuario.remove(usuario);
    }

    /** Expulsa del mapa las entradas cuya ventana ya expiró y que nadie va a consultar de nuevo. */
    private void purgarSiNecesario() {
        if (fallosPorUsuario.size() <= MAX_REGISTROS) {
            return;
        }
        long ahora = System.currentTimeMillis();
        fallosPorUsuario.entrySet().removeIf(
                e -> ahora - e.getValue().primerFallo() >= VENTANA_MS);
    }
}
