package com.room911.service.impl;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.room911.entity.AccessAttempt;
import com.room911.entity.Empleado;
import com.room911.repository.AccessAttemptRepository;
import com.room911.repository.EmpleadoRepository;
import com.room911.service.interfaces.PdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PdfServiceImpl implements PdfService {

    private final AccessAttemptRepository accessAttemptRepository;
    private final EmpleadoRepository empleadoRepository;

    @Override
    public byte[] generarHistorialEmpleado(Long empleadoId) {

        Empleado empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() ->
                        new RuntimeException("Empleado no encontrado"));

        List<AccessAttempt> intentos =
                accessAttemptRepository.findByEmpleadoId(empleadoId);

        try {

            Document document = new Document();

            ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream();

            PdfWriter.getInstance(document, outputStream);

            document.open();

            Font titulo =
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);

            Font subtitulo =
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);

            document.add(new Paragraph("ROOM_911", titulo));
            document.add(new Paragraph(" "));
            document.add(new Paragraph(
                    "Historial de intentos de acceso",
                    subtitulo));

            document.add(new Paragraph(" "));

            document.add(new Paragraph(
                    "Empleado: "
                            + empleado.getNombre()
                            + " "
                            + empleado.getApellido()));

            document.add(new Paragraph(
                    "Documento: "
                            + empleado.getDocumento()));

            document.add(new Paragraph(
                    "Departamento: "
                            + empleado.getDepartamento().getNombre()));

            document.add(new Paragraph(
                    "Cargo: "
                            + empleado.getCargo()));

            document.add(new Paragraph(
                    "Fecha de generación: "
                            + LocalDateTime.now().format(
                            DateTimeFormatter.ofPattern(
                                    "dd/MM/yyyy HH:mm"))));

            document.add(new Paragraph(" "));
            document.add(new Paragraph(
                    "=========================================="));

            if (intentos.isEmpty()) {

                document.add(new Paragraph(
                        "No existen intentos registrados."
                ));

            } else {

                for (AccessAttempt intento : intentos) {

                    document.add(new Paragraph(
                            "Fecha: "
                                    + intento.getFechaAcceso()));

                    document.add(new Paragraph(
                            "Resultado: "
                                    + (intento.getExito()
                                    ? "PERMITIDO"
                                    : "DENEGADO")));

                    document.add(new Paragraph(
                            "Mensaje: "
                                    + intento.getMessage()));

                    document.add(new Paragraph(
                            "--------------------------------------"));

                }

            }

            document.close();

            return outputStream.toByteArray();

        } catch (DocumentException e) {

            throw new RuntimeException(
                    "Error al generar el PDF",
                    e
            );

        }

    }

}