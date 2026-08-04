package com.room911.service.impl;

import com.room911.dto.AccessAttemptDTO;
import com.room911.entity.AccessAttempt;
import com.room911.entity.Empleado;
import com.room911.mapper.AccessAttemptMapper;
import com.room911.repository.AccessAttemptRepository;
import com.room911.repository.EmpleadoRepository;
import com.room911.service.interfaces.AccessAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccessAttemptServiceImpl implements AccessAttemptService {
    private final AccessAttemptRepository accessAttemptRepository;
    private final EmpleadoRepository empleadoRepository;

    @Override
    public AccessAttemptDTO save(AccessAttemptDTO dto){
        Empleado empleado = empleadoRepository.findById(dto.getEmpleadoId())
                .orElse(null);

        AccessAttempt intento = AccessAttempt.builder()
                .fechaAcceso(LocalDateTime.now())
                .exito(dto.getExito())
                .message(dto.getMessage())
                .empleado(empleado)
                .build();

        return AccessAttemptMapper.toDTO(accessAttemptRepository.save(intento));
    }

    @Override
    public List<AccessAttemptDTO> findAll(){
        return accessAttemptRepository.findAll()
                .stream()
                .map(AccessAttemptMapper::toDTO)
                .toList();
    }

    @Override
    public AccessAttemptDTO findById(Long id){
        return accessAttemptRepository.findById(id)
                .map(AccessAttemptMapper::toDTO)
                .orElse(null);
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
