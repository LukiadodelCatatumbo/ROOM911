package com.room911.config;

import com.room911.entity.AccessAttempt;
import com.room911.entity.Administrador;
import com.room911.entity.Departamento;
import com.room911.entity.Empleado;
import com.room911.repository.AccessAttemptRepository;
import com.room911.repository.AdministradorRepository;
import com.room911.repository.DepartamentoRepository;
import com.room911.repository.EmpleadoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final DepartamentoRepository departamentoRepository;
    private final EmpleadoRepository empleadoRepository;
    private final AdministradorRepository administradorRepository;
    private final AccessAttemptRepository accessAttemptRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Verificando inicialización de datos base para ROOM911...");

        // 1. Departamentos
        if (departamentoRepository.count() == 0) {
            log.info("Sembrando departamentos iniciales BPF...");
            List<Departamento> depts = List.of(
                    Departamento.builder().nombre("Producción").descripcion("Líneas de manufactura y envasado estéril").activo(true).fechaCreacion(LocalDateTime.now()).build(),
                    Departamento.builder().nombre("Control de Calidad").descripcion("Laboratorios de microbiología y físico-química").activo(true).fechaCreacion(LocalDateTime.now()).build(),
                    Departamento.builder().nombre("Investigación y Desarrollo").descripcion("Área de bioseguridad y formulación avanzada").activo(true).fechaCreacion(LocalDateTime.now()).build(),
                    Departamento.builder().nombre("Almacén y Logística").descripcion("Muelle de carga y bodega de materias primas").activo(true).fechaCreacion(LocalDateTime.now()).build(),
                    Departamento.builder().nombre("Administración").descripcion("Gerencia de planta y oficinas corporativas").activo(true).fechaCreacion(LocalDateTime.now()).build(),
                    Departamento.builder().nombre("Recursos Humanos").descripcion("Talento humano, bienestar y capacitación").activo(true).fechaCreacion(LocalDateTime.now()).build()
            );
            departamentoRepository.saveAll(depts);
            log.info("Departamentos sembrados exitosamente ({} creados).", depts.size());
        }

        // 2. Administradores
        if (administradorRepository.count() == 0) {
            log.info("Sembrando administradores y supervisores de acceso...");
            List<Administrador> admins = List.of(
                    Administrador.builder()
                            .nombre("Super").apellido("Administrador")
                            .usuario("superadmin").correo("superadmin@pharma911.com")
                            .contrasena(passwordEncoder.encode("Admin123*!"))
                            .activo(true).fechaCreacion(LocalDateTime.now()).build(),
                    Administrador.builder()
                            .nombre("Dr. Jorge").apellido("Reyes Montoya")
                            .usuario("j.reyes").correo("j.reyes@pharma911.com")
                            .contrasena(passwordEncoder.encode("Admin123*!"))
                            .activo(true).fechaCreacion(LocalDateTime.now()).build(),
                    Administrador.builder()
                            .nombre("Ing. Andrea").apellido("Sánchez")
                            .usuario("a.sanchez").correo("a.sanchez@pharma911.com")
                            .contrasena(passwordEncoder.encode("Admin123*!"))
                            .activo(true).fechaCreacion(LocalDateTime.now()).build()
            );
            administradorRepository.saveAll(admins);
            log.info("Administradores sembrados exitosamente ({} creados).", admins.size());
        }

        // 3. Empleados
        if (empleadoRepository.count() == 0) {
            log.info("Sembrando colaboradores y credenciales activas...");
            Departamento prod = departamentoRepository.findByNombre("Producción").orElse(null);
            Departamento qc = departamentoRepository.findByNombre("Control de Calidad").orElse(null);
            Departamento id = departamentoRepository.findByNombre("Investigación y Desarrollo").orElse(null);
            Departamento alm = departamentoRepository.findByNombre("Almacén y Logística").orElse(null);
            Departamento adm = departamentoRepository.findByNombre("Administración").orElse(null);
            Departamento rrhh = departamentoRepository.findByNombre("Recursos Humanos").orElse(null);

            if (prod != null && qc != null) {
                List<Empleado> empleados = List.of(
                        Empleado.builder().nombre("Carlos").apellido("Mendoza").documento("1020304050")
                                .correo("c.mendoza@pharma911.com").cargo("Operador de Envasado Estéril")
                                .departamento(prod).activo(true).accesoPermitido(true).fechaCreacion(LocalDateTime.now().minusDays(30)).build(),
                        Empleado.builder().nombre("Dra. Elena").apellido("Ramos").documento("2030405060")
                                .correo("e.ramos@pharma911.com").cargo("Analista Microbiológica Senior")
                                .departamento(qc).activo(true).accesoPermitido(true).fechaCreacion(LocalDateTime.now().minusDays(25)).build(),
                        Empleado.builder().nombre("Dr. Julián").apellido("Castro").documento("3040506070")
                                .correo("j.castro@pharma911.com").cargo("Especialista en Bioseguridad N3")
                                .departamento(id != null ? id : prod).activo(true).accesoPermitido(true).fechaCreacion(LocalDateTime.now().minusDays(20)).build(),
                        Empleado.builder().nombre("Martín").apellido("Morales").documento("4050607080")
                                .correo("m.morales@pharma911.com").cargo("Supervisor de Recepción")
                                .departamento(alm != null ? alm : prod).activo(true).accesoPermitido(true).fechaCreacion(LocalDateTime.now().minusDays(15)).build(),
                        Empleado.builder().nombre("Diana").apellido("Valencia").documento("5060708090")
                                .correo("d.valencia@pharma911.com").cargo("Coordinadora de Auditoría BPF")
                                .departamento(adm != null ? adm : prod).activo(true).accesoPermitido(true).fechaCreacion(LocalDateTime.now().minusDays(10)).build(),
                        Empleado.builder().nombre("Laura").apellido("Gómez").documento("6070809010")
                                .correo("l.gomez@pharma911.com").cargo("Técnica de Muestreo")
                                .departamento(qc).activo(false).accesoPermitido(false).fechaCreacion(LocalDateTime.now().minusDays(8)).build(),
                        Empleado.builder().nombre("Andrés").apellido("Pineda").documento("7080901020")
                                .correo("a.pineda@pharma911.com").cargo("Técnico de Mantenimiento Electromecánico")
                                .departamento(prod).activo(true).accesoPermitido(true).fechaCreacion(LocalDateTime.now().minusDays(5)).build(),
                        Empleado.builder().nombre("Sofía").apellido("Herrera").documento("8090102030")
                                .correo("s.herrera@pharma911.com").cargo("Especialista en Capacitación BPF")
                                .departamento(rrhh != null ? rrhh : prod).activo(true).accesoPermitido(true).fechaCreacion(LocalDateTime.now().minusDays(3)).build()
                );
                empleadoRepository.saveAll(empleados);
                log.info("Empleados sembrados exitosamente ({} registros).", empleados.size());

                // 4. Intentos de Acceso
                if (accessAttemptRepository.count() == 0) {
                    log.info("Sembrando registros de auditoría de acceso...");
                    List<AccessAttempt> attempts = List.of(
                            AccessAttempt.builder().empleado(empleados.get(0)).exito(true).message("Acceso autorizado: Esclusa 1 Producción A").fechaAcceso(LocalDateTime.now().minusHours(4)).build(),
                            AccessAttempt.builder().empleado(empleados.get(1)).exito(true).message("Acceso autorizado: Lector Biométrico Lab QC").fechaAcceso(LocalDateTime.now().minusHours(3)).build(),
                            AccessAttempt.builder().empleado(empleados.get(5)).exito(false).message("Acceso denegado: Credencial inactiva en sistema").fechaAcceso(LocalDateTime.now().minusHours(2)).build(),
                            AccessAttempt.builder().empleado(empleados.get(2)).exito(true).message("Acceso autorizado: Lab B-2 Bioequivalencia").fechaAcceso(LocalDateTime.now().minusHours(1)).build(),
                            AccessAttempt.builder().empleado(empleados.get(3)).exito(true).message("Acceso autorizado: Torniquete Muelle de Carga").fechaAcceso(LocalDateTime.now().minusMinutes(45)).build(),
                            AccessAttempt.builder().empleado(empleados.get(0)).exito(true).message("Acceso autorizado: Torniquete Entrada Principal").fechaAcceso(LocalDateTime.now().minusMinutes(20)).build(),
                            AccessAttempt.builder().empleado(empleados.get(4)).exito(true).message("Acceso autorizado: Entrada Principal").fechaAcceso(LocalDateTime.now().minusDays(1)).build(),
                            AccessAttempt.builder().empleado(empleados.get(1)).exito(true).message("Acceso autorizado: Lab QC").fechaAcceso(LocalDateTime.now().minusDays(2)).build(),
                            AccessAttempt.builder().empleado(empleados.get(2)).exito(true).message("Acceso autorizado: Lab B-2").fechaAcceso(LocalDateTime.now().minusDays(3)).build()
                    );
                    accessAttemptRepository.saveAll(attempts);
                    log.info("Historial de accesos sembrado exitosamente ({} registros).", attempts.size());
                }
            }
        }

        log.info("Base de datos ROOM911 inicializada y sincronizada.");
    }
}
