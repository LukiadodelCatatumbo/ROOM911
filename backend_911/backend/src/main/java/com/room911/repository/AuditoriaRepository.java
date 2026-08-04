package com.room911.repository;

import com.room911.entity.Auditoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditoriaRepository  extends JpaRepository<Auditoria, Long> {
    List<Auditoria> findByAdministradorId(Long administradorId);
}
