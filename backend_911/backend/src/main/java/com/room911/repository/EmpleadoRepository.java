package com.room911.repository;

import com.room911.dto.DepartamentoResumenDTO;
import com.room911.entity.Departamento;
import com.room911.entity.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {
    Optional<Empleado> findByDocumento(String documento);

    // Unicidad solo entre filas activas (índices únicos parciales WHERE activo)
    boolean existsByDocumentoAndActivoTrue(String documento);
    boolean existsByCorreoAndActivoTrue(String correo);

    List<Empleado> findByActivoTrue();

    List<Empleado> findByNombreContainingIgnoreCaseAndActivoTrue(String nombre);

    List<Empleado> findByApellidoContainingIgnoreCaseAndActivoTrue(String apellido);

    List<Empleado> findByDepartamentoIdAndActivoTrue(Long departamentoId);

    long countByActivoTrue();

    long countByActivoTrueAndAccesoPermitidoTrue();

    long countByDepartamentoIdAndActivoTrue(Long departamentoId);

    @Query("""
SELECT new com.room911.dto.DepartamentoResumenDTO(
d.nombre,
COUNT(e)
)
FROM Empleado e
JOIN e.departamento d
WHERE e.activo = true
GROUP BY d.nombre
ORDER BY d.nombre
""")
    List<DepartamentoResumenDTO> obtenerResumenDepartamentos();
}
