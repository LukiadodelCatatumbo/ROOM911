package com.room911.service.impl;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.room911.dto.AccessRequestDTO;
import com.room911.dto.AccessResponseDTO;
import com.room911.entity.AccessAttempt;
import com.room911.entity.Empleado;
import com.room911.repository.AccessAttemptRepository;
import com.room911.repository.EmpleadoRepository;
import com.room911.service.interfaces.AccessService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccessServiceImpl implements AccessService {

    private final EmpleadoRepository empleadoRepository;
    private final AccessAttemptRepository accessAttemptRepository;

    @Override
    public AccessResponseDTO validarAcceso(AccessRequestDTO dto) {

        String tokenOValor = extraerValorUtil(dto.getDocumento());

        Optional<Empleado> empleadoOpt = buscarEmpleado(tokenOValor);

        if (empleadoOpt.isEmpty()) {

            guardarIntento(null, false, "Empleado no registrado (" + tokenOValor + ")");

            return AccessResponseDTO.builder()
                    .permitido(false)
                    .mensaje("Empleado no registrado")
                    .nombreEmpleado(null)
                    .build();
        }

        Empleado empleado = empleadoOpt.get();

        if (!empleado.getActivo()) {

            guardarIntento(empleado, false, "Empleado inactivo");

            return construirRespuesta(
                    empleado,
                    false,
                    "Empleado inactivo"
            );
        }

        if (!empleado.getAccesoPermitido()) {

            guardarIntento(empleado, false, "Acceso no permitido");

            return construirRespuesta(
                    empleado,
                    false,
                    "Acceso no permitido"
            );
        }

        guardarIntento(
                empleado,
                true,
                "Acceso permitido, bienvenido"
        );

        return construirRespuesta(
                empleado,
                true,
                "Acceso permitido, bienvenido"
        );
    }

    /**
     * Busca al empleado intentando por documento, id (si tiene formato EMP-X) o ID interno.
     */
    private Optional<Empleado> buscarEmpleado(String valor) {
        if (valor == null || valor.isBlank()) {
            return Optional.empty();
        }

        // 1. Intentar por documento exacto
        Optional<Empleado> porDocumento = empleadoRepository.findByDocumento(valor);
        if (porDocumento.isPresent()) {
            return porDocumento;
        }

        // 2. Si el valor tiene formato EMP-123 o es numérico (ID interno)
        String valorLimpio = valor.toUpperCase().replace("EMP-", "").trim();
        if (valorLimpio.matches("\\d+")) {
            try {
                Long id = Long.parseLong(valorLimpio);
                Optional<Empleado> porId = empleadoRepository.findById(id);
                if (porId.isPresent()) {
                    return porId;
                }
            } catch (NumberFormatException ignored) {}
        }

        return Optional.empty();
    }

    /**
     * Si el contenido escaneado es una URL (ej: http://localhost:5173/activar-credencial/123456789),
     * extrae el último segmento del path ("123456789").
     */
    private String extraerValorUtil(String rawInput) {
        if (rawInput == null) return "";
        String input = rawInput.trim();

        if (input.startsWith("http://") || input.startsWith("https://")) {
            try {
                URI uri = new URI(input);
                String path = uri.getPath();
                if (path != null && !path.isBlank()) {
                    String[] segments = path.split("/");
                    for (int i = segments.length - 1; i >= 0; i--) {
                        if (!segments[i].isBlank()) {
                            return segments[i].trim();
                        }
                    }
                }
            } catch (Exception ignored) {
                int lastSlash = input.lastIndexOf('/');
                if (lastSlash != -1 && lastSlash < input.length() - 1) {
                    return input.substring(lastSlash + 1).trim();
                }
            }
        }

        return input;
    }

    /**
     * Guarda un intento de acceso.
     */
    private void guardarIntento(
            Empleado empleado,
            Boolean exito,
            String mensaje) {

        AccessAttempt intento = AccessAttempt.builder()
                .fechaAcceso(LocalDateTime.now())
                .exito(exito)
                .message(mensaje)
                .empleado(empleado)
                .build();

        accessAttemptRepository.save(intento);
    }

    private AccessResponseDTO construirRespuesta(
            Empleado empleado,
            Boolean permitido,
            String mensaje) {

        return AccessResponseDTO.builder()
                .permitido(permitido)
                .mensaje(mensaje)
                .nombreEmpleado(
                        empleado.getNombre() + " " + empleado.getApellido())
                .documento(empleado.getDocumento())
                .cargo(empleado.getCargo())
                .departamento(
                        empleado.getDepartamento().getNombre())
                .activo(empleado.getActivo())
                .build();
    }

}