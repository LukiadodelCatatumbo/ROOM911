package com.room911.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> manejarRuntime(RuntimeException exception){
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("fecha", LocalDateTime.now());
        respuesta.put("estado", HttpStatus.NOT_FOUND.value());
        respuesta.put("mensaje", exception.getMessage());
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(respuesta);
    }
}
