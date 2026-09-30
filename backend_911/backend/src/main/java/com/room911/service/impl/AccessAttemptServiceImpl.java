package com.room911.service.impl;

import com.room911.dto.AccessAttemptDTO;
import com.room911.dto.PaginaResponseDTO;
import com.room911.entity.AccessAttempt;
import com.room911.entity.Empleado;
import com.room911.exception.RecursoNoEncontradoException;
import com.room911.mapper.AccessAttemptMapper;
import com.room911.repository.AccessAttemptRepository;
import com.room911.repository.EmpleadoRepository;
import com.room911.service.interfaces.AccessAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AccessAttemptServiceImpl implements AccessAttemptService {
    private final AccessAttemptRepository accessAttemptRepository;
    private final EmpleadoRepository empleadoRepository;

    @Override
    public AccessAttemptDTO save(AccessAttemptDTO dto){
        Empleado empleado = null;
        if (dto.getEmpleadoId() != null) {
            empleado = empleadoRepository.findById(dto.getEmpleadoId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "El empleado con id " + dto.getEmpleadoId() + " no existe"));
        }

        AccessAttempt intento = AccessAttempt.builder()
                .fechaAcceso(LocalDateTime.now())
                .exito(dto.getExito())
                .mensaje(dto.getMensaje())
                .documentoIntentado(empleado != null ? empleado.getDocumento() : null)
                .empleado(empleado)
                .build();

        return AccessAttemptMapper.toDTO(accessAttemptRepository.save(intento));
    }

    @Override
    @Transactional(readOnly = true)
    public PaginaResponseDTO<AccessAttemptDTO> listar(
            int pagina,
            int tamano,
            Boolean exito,
            LocalDate desde,
            LocalDate hasta,
            String texto) {

        LocalDateTime inicio = (desde != null) ? desde.atStartOfDay() : null;
        LocalDateTime fin = (hasta != null) ? hasta.atTime(23, 59, 59) : null;
        if (inicio != null && fin != null && inicio.isAfter(fin)) {
            throw new IllegalArgumentException(
                    "La fecha 'desde' no puede ser posterior a la fecha 'hasta'");
        }
        String patron = (texto != null && !texto.isBlank())
                ? "%" + texto.trim() + "%"
                : "%";

        Pageable pageable = PageRequest.of(pagina, tamano, Sort.by(Sort.Direction.DESC, "fechaAcceso"));
        Page<AccessAttemptDTO> page = accessAttemptRepository
                .buscarConFiltros(exito, inicio, fin, patron, pageable)
                .map(AccessAttemptMapper::toDTO);

        return PaginaResponseDTO.<AccessAttemptDTO>builder()
                .contenido(page.getContent())
                .pagina(page.getNumber())
                .tamano(page.getSize())
                .totalElementos(page.getTotalElements())
                .totalPaginas(page.getTotalPages())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AccessAttemptDTO findById(Long id){
        return accessAttemptRepository.findById(id)
                .map(AccessAttemptMapper::toDTO)
                .orElseThrow(() -> new RecursoNoEncontradoException("Intento de acceso no encontrado"));
    }

    @Override
    public List<AccessAttemptDTO> findByEmpleado(Long empleadoId) {

        return accessAttemptRepository.findByEmpleadoId(empleadoId)
                .stream()
                .map(AccessAttemptMapper::toDTO)
                .toList();
    }

    @Override
    public List<AccessAttemptDTO> findByEmpleadoAndFecha(
            Long empleadoId,
            LocalDateTime inicio,
            LocalDateTime fin) {

        return accessAttemptRepository
                .findByEmpleadoIdAndFechaAccesoBetween(
                        empleadoId,
                        inicio,
                        fin
                )
                .stream()
                .map(AccessAttemptMapper::toDTO)
                .toList();
    }

}
