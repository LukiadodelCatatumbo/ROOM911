package com.room911.controller;

import com.room911.dto.AccessAttemptDTO;
import com.room911.dto.PaginaResponseDTO;
import com.room911.service.interfaces.AccessAttemptService;
import com.room911.service.interfaces.PdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/intento-acceso")
@RequiredArgsConstructor
public class AccessAttemptController {
    private static final int TAMANO_MAXIMO = 1000;

    private final AccessAttemptService accessAttemptService;
    private final PdfService pdfService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_ACCESOS')")
    public ResponseEntity<AccessAttemptDTO> save(@RequestBody AccessAttemptDTO dto){
        return ResponseEntity.ok(accessAttemptService.save(dto));
    }

    /**
     * Listado paginado de servidor. Filtros opcionales: exito (CONCEDIDO/
     * DENEGADO), desde/hasta (fechas ISO yyyy-MM-dd) y texto libre sobre
     * mensaje, documento, nombre, apellido o departamento.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_ACCESOS', 'ADMIN_SISTEMAS')")
    public ResponseEntity<PaginaResponseDTO<AccessAttemptDTO>> listar(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "50") int tamano,
            @RequestParam(required = false) Boolean exito,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta,
            @RequestParam(required = false) String texto) {

        int tamanoSeguro = Math.min(Math.max(tamano, 1), TAMANO_MAXIMO);
        return ResponseEntity.ok(
                accessAttemptService.listar(pagina, tamanoSeguro, exito, desde, hasta, texto));
    }

    // Lecturas visibles a los tres roles: coincide con la visibilidad de
    // /historial y /dashboard en el frontend (Sidebar roles: null).
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_ACCESOS', 'ADMIN_SISTEMAS')")
    public ResponseEntity<AccessAttemptDTO> findById(@PathVariable Long id){
        return ResponseEntity.ok(accessAttemptService.findById(id));
    }

    @GetMapping("/empleado/{empleadoId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_ACCESOS', 'ADMIN_SISTEMAS')")
    public ResponseEntity<List<AccessAttemptDTO>> historialEmpleado(
            @PathVariable Long empleadoId) {

        return ResponseEntity.ok(
                accessAttemptService.findByEmpleado(empleadoId)
        );
    }

    @GetMapping("/empleado/{empleadoId}/fechas")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_ACCESOS', 'ADMIN_SISTEMAS')")
    public ResponseEntity<List<AccessAttemptDTO>> historialPorFechas(
            @PathVariable Long empleadoId,
            @RequestParam LocalDateTime inicio,
            @RequestParam LocalDateTime fin) {

        return ResponseEntity.ok(
                accessAttemptService.findByEmpleadoAndFecha(
                        empleadoId,
                        inicio,
                        fin
                )
        );
    }

    @GetMapping("/pdf/{empleadoId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_ACCESOS')")
    public ResponseEntity<byte[]> descargarPdf(@PathVariable Long empleadoId) {

        byte[] pdf = pdfService.generarHistorialEmpleado(empleadoId);

        return ResponseEntity.ok()
                .header("Content-Disposition",
                        "attachment; filename=historial_" + empleadoId + ".pdf")
                .header("Content-Type", "application/pdf")
                .body(pdf);
    }
}
