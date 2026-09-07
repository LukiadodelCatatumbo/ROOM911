package com.room911.config;

import com.room911.entity.AccessAttempt;
import com.room911.entity.Administrador;
import com.room911.entity.Departamento;
import com.room911.entity.Empleado;
import com.room911.entity.PuntoAcceso;
import com.room911.repository.AccessAttemptRepository;
import com.room911.repository.AdministradorRepository;
import com.room911.repository.DepartamentoRepository;
import com.room911.repository.EmpleadoRepository;
import com.room911.repository.PuntoAccesoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
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
    private final PuntoAccesoRepository puntoAccesoRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Value("${room911.seed-password:}")
    private String seedPassword;

    @Value("${room911.sync-seed-password:false}")
    private boolean syncSeedPassword;

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

        // 1b. Puntos de acceso: catálogo físico + franjas horarias (fuente autoritativa
        // para la validación del backend; el frontend solo los muestra).
        if (puntoAccesoRepository.count() == 0) {
            log.info("Sembrando puntos de acceso y franjas horarias...");
            Departamento prod = departamentoRepository.findByNombre("Producción").orElse(null);
            Departamento qc = departamentoRepository.findByNombre("Control de Calidad").orElse(null);
            Departamento ind = departamentoRepository.findByNombre("Investigación y Desarrollo").orElse(null);
            Departamento alm = departamentoRepository.findByNombre("Almacén y Logística").orElse(null);
            Departamento adm = departamentoRepository.findByNombre("Administración").orElse(null);
            Departamento rrhh = departamentoRepository.findByNombre("Recursos Humanos").orElse(null);

            List<PuntoAcceso> puntos = List.of(
                    PuntoAcceso.builder().codigo("DOOR-COMMON-01").nombre("Torniquete Principal")
                            .ubicacion("Acceso Peatonal Exterior").nivelRestriccion("BAJA").tipo("TORNIQUETE")
                            .zonaComun(true).departamento(null)
                            .nombreHorario("Horario general").horaInicio("06:00").horaFin("22:00")
                            .activo(true).fechaCreacion(LocalDateTime.now()).build(),
                    PuntoAcceso.builder().codigo("DOOR-COMMON-02").nombre("Acceso General Comedor & Cafetería")
                            .ubicacion("Edificio de Servicios").nivelRestriccion("BAJA").tipo("PUERTA_AUTOMATICA")
                            .zonaComun(true).departamento(null)
                            .nombreHorario("Comedor y cafetería").horaInicio("07:00").horaFin("18:00")
                            .activo(true).fechaCreacion(LocalDateTime.now()).build(),
                    PuntoAcceso.builder().codigo("DOOR-PROD-01").nombre("Esclusa 1: Sala de Producción A")
                            .ubicacion("Nave Industrial - Planta Baja").nivelRestriccion("ALTA").tipo("ESCLUSA")
                            .zonaComun(false).departamento(prod)
                            .nombreHorario("Producción - turno mañana").horaInicio("06:00").horaFin("14:30")
                            .activo(true).fechaCreacion(LocalDateTime.now()).build(),
                    PuntoAcceso.builder().codigo("DOOR-PROD-02").nombre("Esclusa 2: Línea de Envasado Primario")
                            .ubicacion("Nave Industrial - Área Limpia").nivelRestriccion("ALTA").tipo("ESCLUSA")
                            .zonaComun(false).departamento(prod)
                            .nombreHorario("Envasado primario").horaInicio("06:00").horaFin("16:00")
                            .activo(true).fechaCreacion(LocalDateTime.now()).build(),
                    PuntoAcceso.builder().codigo("DOOR-QC-01").nombre("Lector Biométrico: Lab QC Microbiológico")
                            .ubicacion("Edificio de Laboratorios - Piso 2").nivelRestriccion("CRITICA_ESTERIL").tipo("BIOMETRICO")
                            .zonaComun(false).departamento(qc)
                            .nombreHorario("Laboratorio microbiológico").horaInicio("07:00").horaFin("19:00")
                            .activo(true).fechaCreacion(LocalDateTime.now()).build(),
                    PuntoAcceso.builder().codigo("DOOR-QC-02").nombre("Esclusa de Control de Calidad Físico-Químico")
                            .ubicacion("Edificio de Laboratorios - Piso 1").nivelRestriccion("ALTA").tipo("ESCLUSA")
                            .zonaComun(false).departamento(qc)
                            .nombreHorario("Laboratorio físico-químico").horaInicio("07:00").horaFin("19:00")
                            .activo(true).fechaCreacion(LocalDateTime.now()).build(),
                    PuntoAcceso.builder().codigo("DOOR-ID-01").nombre("Esclusa Estéril: Lab B-2 Bioequivalencia")
                            .ubicacion("Área de Bioseguridad Nivel 3").nivelRestriccion("CRITICA_ESTERIL").tipo("BIOMETRICO")
                            .zonaComun(false).departamento(ind)
                            .nombreHorario("Investigación y desarrollo").horaInicio("08:00").horaFin("17:30")
                            .activo(true).fechaCreacion(LocalDateTime.now()).build(),
                    PuntoAcceso.builder().codigo("DOOR-ALM-01").nombre("Torniquete Muelle de Carga & Recepción")
                            .ubicacion("Patio de Maniobras").nivelRestriccion("MEDIA").tipo("TORNIQUETE")
                            .zonaComun(false).departamento(alm)
                            .nombreHorario("Muelle de carga").horaInicio("05:30").horaFin("20:00")
                            .activo(true).fechaCreacion(LocalDateTime.now()).build(),
                    PuntoAcceso.builder().codigo("DOOR-ALM-02").nombre("Almacén de Materias Primas e Insumos")
                            .ubicacion("Bodega Central").nivelRestriccion("MEDIA").tipo("PUERTA_AUTOMATICA")
                            .zonaComun(false).departamento(alm)
                            .nombreHorario("Almacén de insumos").horaInicio("06:00").horaFin("18:00")
                            .activo(true).fechaCreacion(LocalDateTime.now()).build(),
                    PuntoAcceso.builder().codigo("DOOR-ADM-01").nombre("Puerta de Acceso: Oficinas Centrales & Gerencia")
                            .ubicacion("Edificio Corporativo - Piso 3").nivelRestriccion("BAJA").tipo("PUERTA_AUTOMATICA")
                            .zonaComun(false).departamento(adm)
                            .nombreHorario("Oficinas centrales").horaInicio("07:00").horaFin("19:00")
                            .activo(true).fechaCreacion(LocalDateTime.now()).build(),
                    PuntoAcceso.builder().codigo("DOOR-RRHH-01").nombre("Puerta de Acceso: Talento Humano & Capacitación")
                            .ubicacion("Edificio Corporativo - Piso 1").nivelRestriccion("BAJA").tipo("PUERTA_AUTOMATICA")
                            .zonaComun(false).departamento(rrhh)
                            .nombreHorario("Talento humano").horaInicio("08:00").horaFin("17:00")
                            .activo(true).fechaCreacion(LocalDateTime.now()).build()
            );
            puntoAccesoRepository.saveAll(puntos);
            log.info("Puntos de acceso sembrados exitosamente ({} creados).", puntos.size());
        }

        // 2. Administradores (credenciales definidas por entorno, nunca en el código)
        if (administradorRepository.count() == 0) {
            log.info("Sembrando administradores y supervisores de acceso...");
            String contrasena = resolverContrasenaInicial();
            List<Administrador> admins = List.of(
                    Administrador.builder()
                            .nombre("Super").apellido("Administrador")
                            .usuario("superadmin").correo("superadmin@pharma911.com")
                            .contrasena(passwordEncoder.encode(contrasena))
                            .rol("SUPER_ADMIN")
                            .activo(true).fechaCreacion(LocalDateTime.now()).build(),
                    Administrador.builder()
                            .nombre("Dr. Jorge").apellido("Reyes Montoya")
                            .usuario("j.reyes").correo("j.reyes@pharma911.com")
                            .contrasena(passwordEncoder.encode(contrasena))
                            .rol("ADMIN_ACCESOS")
                            .activo(true).fechaCreacion(LocalDateTime.now()).build(),
                    Administrador.builder()
                            .nombre("Ing. Andrea").apellido("Sánchez")
                            .usuario("a.sanchez").correo("a.sanchez@pharma911.com")
                            .contrasena(passwordEncoder.encode(contrasena))
                            .rol("ADMIN_SISTEMAS")
                            .activo(true).fechaCreacion(LocalDateTime.now()).build()
            );
            administradorRepository.saveAll(admins);
            log.info("Administradores sembrados exitosamente ({} creados).", admins.size());
        } else if (syncSeedPassword && seedPassword != null && !seedPassword.isBlank()) {
            sincronizarContrasenaSemilla();
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
                            AccessAttempt.builder().empleado(empleados.get(0)).documentoIntentado(empleados.get(0).getDocumento()).exito(true).mensaje("Acceso autorizado: Esclusa 1 Producción A").fechaAcceso(LocalDateTime.now().minusHours(4)).build(),
                            AccessAttempt.builder().empleado(empleados.get(1)).documentoIntentado(empleados.get(1).getDocumento()).exito(true).mensaje("Acceso autorizado: Lector Biométrico Lab QC").fechaAcceso(LocalDateTime.now().minusHours(3)).build(),
                            AccessAttempt.builder().empleado(empleados.get(5)).documentoIntentado(empleados.get(5).getDocumento()).exito(false).mensaje("Acceso denegado: Credencial inactiva en sistema").fechaAcceso(LocalDateTime.now().minusHours(2)).build(),
                            AccessAttempt.builder().empleado(empleados.get(2)).documentoIntentado(empleados.get(2).getDocumento()).exito(true).mensaje("Acceso autorizado: Lab B-2 Bioequivalencia").fechaAcceso(LocalDateTime.now().minusHours(1)).build(),
                            AccessAttempt.builder().empleado(empleados.get(3)).documentoIntentado(empleados.get(3).getDocumento()).exito(true).mensaje("Acceso autorizado: Torniquete Muelle de Carga").fechaAcceso(LocalDateTime.now().minusMinutes(45)).build(),
                            AccessAttempt.builder().empleado(empleados.get(0)).documentoIntentado(empleados.get(0).getDocumento()).exito(true).mensaje("Acceso autorizado: Torniquete Entrada Principal").fechaAcceso(LocalDateTime.now().minusMinutes(20)).build(),
                            AccessAttempt.builder().empleado(empleados.get(4)).documentoIntentado(empleados.get(4).getDocumento()).exito(true).mensaje("Acceso autorizado: Entrada Principal").fechaAcceso(LocalDateTime.now().minusDays(1)).build(),
                            AccessAttempt.builder().empleado(empleados.get(1)).documentoIntentado(empleados.get(1).getDocumento()).exito(true).mensaje("Acceso autorizado: Lab QC").fechaAcceso(LocalDateTime.now().minusDays(2)).build(),
                            AccessAttempt.builder().empleado(empleados.get(2)).documentoIntentado(empleados.get(2).getDocumento()).exito(true).mensaje("Acceso autorizado: Lab B-2").fechaAcceso(LocalDateTime.now().minusDays(3)).build()
                    );
                    accessAttemptRepository.saveAll(attempts);
                    log.info("Historial de accesos sembrado exitosamente ({} registros).", attempts.size());
                }
            }
        }

        log.info("Base de datos ROOM911 inicializada y sincronizada.");
    }

    /**
     * La contraseña inicial de los usuarios sembrados llega por la variable
     * ROOM911_SEED_PASSWORD; si no se define, se genera una aleatoria y se
     * registra una única vez en el log para que el operador la recupere.
     */
    private String resolverContrasenaInicial() {
        if (seedPassword != null && !seedPassword.isBlank()) {
            return seedPassword;
        }
        String alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!#%*";
        SecureRandom random = new SecureRandom();
        StringBuilder generada = new StringBuilder(16);
        for (int i = 0; i < 16; i++) {
            generada.append(alfabeto.charAt(random.nextInt(alfabeto.length())));
        }
        log.warn("ROOM911_SEED_PASSWORD no definida. Contraseña inicial generada para usuarios sembrados: {}",
                generada);
        return generada.toString();
    }

    /**
     * Permite actualizar explícitamente las cuentas existentes en un entorno local
     * cuando cambia ROOM911_SEED_PASSWORD. Nunca se ejecuta por defecto.
     */
    private void sincronizarContrasenaSemilla() {
        List<Administrador> administradores = administradorRepository.findAll();
        int actualizados = 0;

        for (Administrador administrador : administradores) {
            String hashActual = administrador.getContrasena();
            if (hashActual == null || !passwordEncoder.matches(seedPassword, hashActual)) {
                administrador.setContrasena(passwordEncoder.encode(seedPassword));
                actualizados++;
            }
        }

        if (actualizados > 0) {
            administradorRepository.saveAll(administradores);
            log.warn("Se sincronizó la contraseña semilla en {} administrador(es) por configuración explícita de desarrollo.", actualizados);
        }
    }
}
