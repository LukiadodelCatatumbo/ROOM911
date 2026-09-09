package com.room911.exception;

/** Violación de unicidad (documento, correo, usuario, código...): HTTP 409. */
public class RecursoDuplicadoException extends RuntimeException {

    public RecursoDuplicadoException(String mensaje) {
        super(mensaje);
    }
}
