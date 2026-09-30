package com.room911.service.impl;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.room911.dto.AccessRequestDTO;
import com.room911.dto.AccessResponseDTO;
import com.room911.dto.ColaboradorSimuladorDTO;
import com.room911.dto.PuntoAccesoSimuladorDTO;
import com.room911.entity.AccessAttempt;
import com.room911.entity.Empleado;
import com.room911.entity.PuntoAcceso;
import com.room911.repository.AccessAttemptRepository;
import com.room911.repository.EmpleadoRepository;
import com.room911.repository.HistorialAccesoRepository;
import com.room911.repository.PuntoAccesoRepository;
import com.room911.service.interfaces.AccessService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccessServiceImpl implements AccessService {

    private static final ZoneId ZONA_HORARIA = ZoneId.of("America/Bogota");

    private final EmpleadoRepository empleadoRepository;
    private final AccessAttemptRepository accessAttemptRepository;
    private final PuntoAccesoRepository puntoAccesoRepository;
    private final HistorialAccesoRepository historialAccesoRepository;

    @Override
    @Transactional(readOnly = true)
    public java.util.List<ColaboradorSimuladorDTO> listarColaboradores() {
        // Solo personal activo: la terminal pública no debe enumerar inactivos.
        return empleadoRepository.findByActivoTrue().stream()
                .map(e -> ColaboradorSimuladorDTO.builder()
                        .id(e.getId())
                        .nombre(e.getNombre())
                        .apellido(e.getApellido())
                        .cargo(e.getCargo())
                        .departamento(e.getDepartamento() != null
                                ? e.getDepartamento().getNombre()
                                : "Sin asignar")
                        .activo(e.getActivo())
                        .accesoPermitido(e.getAccesoPermitido())
                        .build())
                .toList();
    }

    /** Fuente única del catálogo: el frontend nunca debe hardcodear puertas ni horarios. */
    @Override
    @Transactional(readOnly = true)
    public java.util.List<PuntoAccesoSimuladorDTO> listarPuntos() {
        return puntoAccesoRepository.findAllByActivoTrueOrderByNombreAsc().stream()
                .map(p -> PuntoAccesoSimuladorDTO.builder()
                        .codigo(p.getCodigo())
                        .nombre(p.getNombre())
                        .ubicacion(p.getUbicacion())
                        .nivelRestriccion(p.getNivelRestriccion())
                        .tipo(p.getTipo())
                        .zonaComun(p.getZonaComun())
                        .departamento(p.getDepartamento() != null
                                ? p.getDepartamento().getNombre()
                                : null)
                        .horaInicio(p.getHoraInicio())
                        .horaFin(p.getHoraFin())
                        .nombreHorario(p.getNombreHorario())
                        .build())
                .toList();
    }

    @Override
    @Transactional
    public AccessResponseDTO validarAcceso(AccessRequestDTO dto) {

        String tokenOValor = extraerValorUtil(dto.getDocumento());

        Optional<Empleado> empleadoOpt = buscarEmpleado(tokenOValor);

        if (empleadoOpt.isEmpty()) {

            guardarIntento(null, false, "Empleado no registrado (" + tokenOValor + ")", tokenOValor);

            return AccessResponseDTO.builder()
                    .permitido(false)
                    .resultado("DENEGADO")
                    .mensaje("Empleado no registrado")
                    .nombreEmpleado(null)
                    .build();
        }

        Empleado empleado = empleadoOpt.get();

        if (!empleado.getActivo()) {

            guardarIntento(empleado, false, "Empleado inactivo", empleado.getDocumento());

            return construirRespuesta(
                    empleado,
                    false,
                    "Empleado inactivo",
                    null
            );
        }

        if (!empleado.getAccesoPermitido()) {

            guardarIntento(empleado, false, "Acceso no permitido", empleado.getDocumento());

            return construirRespuesta(
                    empleado,
                    false,
                    "Acceso no permitido",
                    null
            );
        }

        // Anti-passback autoritativo: si ya tiene un ingreso sin salida
        // registrada, no se concede otra entrada (evita doble conteo de aforo
        // y compartición de credenciales).
        if (historialAccesoRepository.existsByEmpleadoIdAndFechaSalidaIsNull(empleado.getId())) {
            guardarIntento(empleado, false,
                    "Anti-passback: ingreso previo sin salida registrada",
                    empleado.getDocumento());
            return construirRespuesta(
                    empleado,
                    false,
                    "Acceso Bloqueado — Ya se encuentra dentro de la planta",
                    null
            );
        }

        // =====================================================================
        // Validación del punto de acceso (fuente autoritativa del servidor).
        // Si no se informa puerta, se mantiene el comportamiento legado
        // (solo identidad) por compatibilidad con lectores antiguos.
        // =====================================================================
        String puertaSolicitada = dto.getPuerta() != null ? dto.getPuerta().trim() : "";
        if (!puertaSolicitada.isEmpty()) {
            Optional<PuntoAcceso> puntoOpt = resolverPunto(puertaSolicitada);

            if (puntoOpt.isEmpty() || Boolean.FALSE.equals(puntoOpt.get().getActivo())) {
                guardarIntento(empleado, false,
                        "Punto de acceso no registrado o inactivo (" + puertaSolicitada + ")",
                        empleado.getDocumento());
                return construirRespuesta(
                        empleado,
                        false,
                        "Punto de acceso no registrado en el sistema",
                        null
                );
            }

            PuntoAcceso punto = puntoOpt.get();

            if (!cumpleHorario(punto)) {
                guardarIntento(empleado, false,
                        "Fuera del horario permitido en " + punto.getNombre()
                                + " (" + punto.getHoraInicio() + "-" + punto.getHoraFin() + ")",
                        empleado.getDocumento());
                return construirRespuesta(
                        empleado,
                        false,
                        "Acceso Bloqueado — Fuera de Horario (" + punto.getHoraInicio()
                                + " a " + punto.getHoraFin() + ")",
                        punto
                );
            }

            if (!zonaAutorizada(empleado, punto)) {
                String zonaPunto = punto.getDepartamento() != null
                        ? punto.getDepartamento().getNombre()
                        : "zona general";
                guardarIntento(empleado, false,
                        "Sin autorización para " + punto.getNombre() + " (" + zonaPunto + ")",
                        empleado.getDocumento());
                return construirRespuesta(
                        empleado,
                        false,
                        "Acceso Bloqueado — Zona No Autorizada",
                        punto
                );
            }

            guardarIntento(
                    empleado,
                    true,
                    "Acceso permitido: " + punto.getNombre(),
                    empleado.getDocumento()
            );

            return construirRespuesta(
                    empleado,
                    true,
                    "Acceso autorizado: " + punto.getNombre(),
                    punto
            );
        }

        guardarIntento(
                empleado,
                true,
                "Acceso permitido, bienvenido",
                empleado.getDocumento()
        );

        return construirRespuesta(
                empleado,
                true,
                "Acceso permitido, bienvenido",
                null
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
            } catch (NumberFormatException e) {
                log.debug("Credencial '{}' no corresponde a un id interno válido", valor);
            }
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
            } catch (URISyntaxException e) {
                log.debug("Contenido QR '{}' no es una URL válida, se intenta extracción manual", input);
                int lastSlash = input.lastIndexOf('/');
                if (lastSlash != -1 && lastSlash < input.length() - 1) {
                    return input.substring(lastSlash + 1).trim();
                }
            }
        }

        return input;
    }

    /**
     * Guarda un intento de acceso, conservando siempre la credencial leída
     * (documento_intentado) aunque el empleado no esté registrado.
     */
    private void guardarIntento(
            Empleado empleado,
            Boolean exito,
            String mensaje,
            String documentoIntentado) {

        AccessAttempt intento = AccessAttempt.builder()
                .fechaAcceso(LocalDateTime.now())
                .exito(exito)
                // Columna mensaje = 255: el input del lector (puerta) puede alargarla
                .mensaje(mensaje != null && mensaje.length() > 255
                        ? mensaje.substring(0, 254) + "…"
                        : mensaje)
                .documentoIntentado(documentoIntentado)
                .empleado(empleado)
                .build();

        accessAttemptRepository.save(intento);
    }

    private AccessResponseDTO construirRespuesta(
            Empleado empleado,
            Boolean permitido,
            String mensaje,
            PuntoAcceso punto) {

        return AccessResponseDTO.builder()
                .permitido(permitido)
                .resultado(permitido ? "CONCEDIDO" : "DENEGADO")
                .mensaje(mensaje)
                .nombreEmpleado(
                        empleado.getNombre() + " " + empleado.getApellido())
                .documento(empleado.getDocumento())
                .cargo(empleado.getCargo())
                .departamento(
                        empleado.getDepartamento() != null ? empleado.getDepartamento().getNombre() : "General")
                .activo(empleado.getActivo())
                .puntoCodigo(punto != null ? punto.getCodigo() : null)
                .puerta(punto != null ? punto.getNombre() : null)
                .build();
    }

    /**
     * Resuelve el punto por código estable (DOOR-PROD-01, insensible a
     * mayúsculas) o por nombre exacto para compatibilidad con clientes
     * que aún envían el nombre visible.
     */
    private Optional<PuntoAcceso> resolverPunto(String valor) {
        if (valor == null || valor.isBlank()) {
            return Optional.empty();
        }
        String limpio = valor.trim();
        Optional<PuntoAcceso> porCodigo = puntoAccesoRepository.findByCodigo(limpio);
        if (porCodigo.isEmpty()) {
            porCodigo = puntoAccesoRepository.findByCodigo(limpio.toUpperCase());
        }
        if (porCodigo.isPresent()) {
            return porCodigo;
        }
        return puntoAccesoRepository.findByNombre(limpio);
    }

    /**
     * Verifica la franja horaria del punto en America/Bogota.
     * Soporta turnos nocturnos que cruzan la medianoche (inicio > fin).
     * Ante configuración ilegible, niega por seguridad (fail-closed).
     */
    private boolean cumpleHorario(PuntoAcceso punto) {
        if (punto.getHoraInicio() == null || punto.getHoraInicio().isBlank()
                || punto.getHoraFin() == null || punto.getHoraFin().isBlank()) {
            return true;
        }
        try {
            LocalTime inicio = LocalTime.parse(punto.getHoraInicio().trim());
            LocalTime fin = LocalTime.parse(punto.getHoraFin().trim());
            LocalTime ahora = LocalTime.now(ZONA_HORARIA);
            if (!inicio.isAfter(fin)) {
                return !ahora.isBefore(inicio) && !ahora.isAfter(fin);
            }
            return !ahora.isBefore(inicio) || !ahora.isAfter(fin);
        } catch (DateTimeParseException e) {
            log.warn("Franja horaria ilegible en punto {}: {}-{}",
                    punto.getCodigo(), punto.getHoraInicio(), punto.getHoraFin());
            return false;
        }
    }

    /**
     * Zona común (o punto sin departamento) = acceso general.
     * En cualquier otro caso el colaborador debe pertenecer al mismo
     * departamento del punto (comparación por id, no por nombre).
     */
    private boolean zonaAutorizada(Empleado empleado, PuntoAcceso punto) {
        if (Boolean.TRUE.equals(punto.getZonaComun()) || punto.getDepartamento() == null) {
            return true;
        }
        if (empleado.getDepartamento() == null || punto.getDepartamento().getId() == null) {
            return false;
        }
        return punto.getDepartamento().getId().equals(empleado.getDepartamento().getId());
    }

}