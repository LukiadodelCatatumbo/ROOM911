package com.room911.repository;

import com.room911.dto.DepartamentoResumenDTO;
import com.room911.entity.Departamento;
import com.room911.entity.Empleado;
import org.springframework.data.jpa.repository.EntityGraph;
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

    // EntityGraph: evita N+1 al hidratar departamento en los mapeos a DTO
    @Override
    @EntityGraph(attributePaths = "departamento")
    List<Empleado> findAll();

    @EntityGraph(attributePaths = "departamento")
    List<Empleado> findByActivoTrue();

    @EntityGraph(attributePaths = "departamento")
    List<Empleado> findByNombreContainingIgnoreCaseAndActivoTrue(String nombre);

    @EntityGraph(attributePaths = "departamento")
    List<Empleado> findByApellidoContainingIgnoreCaseAndActivoTrue(String apellido);

    @EntityGraph(attributePaths = "departamento")
    List<Empleado> findByDepartamentoIdAndActivoTrue(Long departamentoId);

    long countByActivoTrue();

    long countByActivoTrueAndAccesoPermitidoTrue();

    long countByDepartamentoIdAndActivoTrue(Long departamentoId);

    /**
     * Cuenta de empleados activos agrupada por departamento en una sola query
     * (evita el N+1 de COUNT por fila al listar departamentos).
     */
    @Query("""
SELECT e.departamento.id, COUNT(e)
FROM Empleado e
WHERE e.activo = true
AND e.departamento IS NOT NULL
GROUP BY e.departamento.id
""")
    List<Object[]> contarActivosPorDepartamento();

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

    @Query(value = """
SELECT DISTINCT cargo
FROM empleados
WHERE activo = true
AND cargo IS NOT NULL
AND cargo <> ''
ORDER BY cargo
""", nativeQuery = true)
    List<String> listarCargosDistintos();
}
