package com.room911.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> manejarValidacion(MethodArgumentNotValidException ex) {
        Map<String, Object> respuesta = new HashMap<>();
        Map<String, String> errores = new HashMap<>();

        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errores.put(error.getField(), error.getDefaultMessage());
        }

        respuesta.put("fecha", LocalDateTime.now());
        respuesta.put("estado", HttpStatus.BAD_REQUEST.value());
        respuesta.put("mensaje", "Error de validación en los datos enviados");
        respuesta.put("errores", errores);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> manejarRuntime(RuntimeException ex) {
        Map<String, Object> respuesta = new HashMap<>();
        String mensaje = ex.getMessage() != null ? ex.getMessage() : "Error en el servidor";
        HttpStatus status = HttpStatus.BAD_REQUEST;

        String mensajeLower = mensaje.toLowerCase();
        if (mensajeLower.contains("no encontrado") || mensajeLower.contains("not found")) {
            status = HttpStatus.NOT_FOUND;
        } else if (mensajeLower.contains("ya existe") || mensajeLower.contains("duplicado")) {
            status = HttpStatus.CONFLICT;
        } else if (mensajeLower.contains("inactivo") || mensajeLower.contains("incorrecta") || mensajeLower.contains("no permitido")) {
            status = HttpStatus.UNAUTHORIZED;
        }

        respuesta.put("fecha", LocalDateTime.now());
        respuesta.put("estado", status.value());
        respuesta.put("mensaje", mensaje);

        return ResponseEntity.status(status).body(respuesta);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> manejarGeneral(Exception ex) {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("fecha", LocalDateTime.now());
        respuesta.put("estado", HttpStatus.INTERNAL_SERVER_ERROR.value());
        respuesta.put("mensaje", ex.getMessage() != null ? ex.getMessage() : "Error interno no controlado");

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
    }
}
