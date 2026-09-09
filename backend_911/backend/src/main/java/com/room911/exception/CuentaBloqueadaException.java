package com.room911.exception;

/**
 * Login bloqueado temporalmente por intentos fallidos repetidos
 * (protección anti fuerza bruta): HTTP 429.
 */
public class CuentaBloqueadaException extends RuntimeException {

    public CuentaBloqueadaException(String mensaje) {
        super(mensaje);
    }
}
