package com.room911.exception;

/**
 * El recurso existe pero su estado actual impide la operación
 * (empleado inactivo, salida ya registrada, último SUPER_ADMIN...): HTTP 409.
 */
public class EstadoInvalidoException extends RuntimeException {

    public EstadoInvalidoException(String mensaje) {
        super(mensaje);
    }
}
