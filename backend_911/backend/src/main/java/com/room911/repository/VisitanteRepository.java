package com.room911.repository;

import com.room911.entity.Visitante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VisitanteRepository  extends JpaRepository<Visitante, Long> {
    boolean existsByDocumento(String documento);

}
