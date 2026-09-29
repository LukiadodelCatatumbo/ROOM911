package com.room911.controller;

import com.room911.dto.AccessAttemptDTO;
import com.room911.service.interfaces.AccessAttemptService;
import com.room911.service.interfaces.PdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/intento-acceso")
@RequiredArgsConstructor
public class AccessAttemptController {
    private final AccessAttemptService accessAttemptService;
    private final PdfService pdfService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_ACCESOS')")
    public ResponseEntity<AccessAttemptDTO> save(@RequestBody AccessAttemptDTO dto){
        return ResponseEntity.ok(accessAttemptService.save(dto));
    }

    // Lecturas visibles a los tres roles: coincide con la visibilidad de
    // /historial y /dashboard en el frontend (Sidebar roles: null).
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_ACCESOS', 'ADMIN_SISTEMAS')")
    public ResponseEntity<List<AccessAttemptDTO>> findAll(){
        return ResponseEntity.ok(accessAttemptService.findAll());
    }

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
