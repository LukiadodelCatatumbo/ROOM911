import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ScanLine,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ChevronLeft,
  Zap,
  History,
  Trash2,
  Terminal,
  Clock,
} from "lucide-react";
import { empleadoService } from "../services/empleadoService";
import { accesoService } from "../services/accesoService";
import { Employee, AccessResult } from "../types";
import { toast } from "sonner";

export interface AccessPoint {
  id: string;
  nombre: string;
  departamento: string;
  departamentoCodigo?: string;
  nivelRestriccion: "BAJA" | "MEDIA" | "ALTA" | "CRITICA" | "CRITICA_ESTERIL";
  tipo: "ESCLUSA" | "TORNIQUETE" | "BIOMETRICO" | "PUERTA_AUTOMATICA";
  ubicacion: string;
}

export interface AccessSchedule {
  nombre: string;
  horaInicio: string; // "HH:mm"
  horaFin: string; // "HH:mm"
}

interface SimulationLog {
  id: string;
  hora: string;
  empleadoNombre: string;
  empleadoId: string;
  empleadoDept: string;
  puertaNombre: string;
  puertaDept: string;
  resultado: AccessResult;
  motivo: string;
  horaLimite?: string;
}

interface AccessGrant {
  hora: string;
  puertaNombre: string;
}

/** Franjas horarias de acceso por punto de control. */
const ACCESS_POINT_SCHEDULES: Record<string, AccessSchedule> = {
  "DOOR-COMMON-01": { nombre: "Horario general", horaInicio: "06:00", horaFin: "22:00" },
  "DOOR-COMMON-02": { nombre: "Comedor y cafetería", horaInicio: "07:00", horaFin: "18:00" },
  "DOOR-PROD-01": { nombre: "Producción - turno mañana", horaInicio: "06:00", horaFin: "14:30" },
  "DOOR-PROD-02": { nombre: "Envasado primario", horaInicio: "06:00", horaFin: "16:00" },
  "DOOR-QC-01": { nombre: "Laboratorio microbiológico", horaInicio: "07:00", horaFin: "19:00" },
  "DOOR-QC-02": { nombre: "Laboratorio físico-químico", horaInicio: "07:00", horaFin: "19:00" },
  "DOOR-ID-01": { nombre: "Investigación y desarrollo", horaInicio: "08:00", horaFin: "17:30" },
  "DOOR-ALM-01": { nombre: "Muelle de carga", horaInicio: "05:30", horaFin: "20:00" },
  "DOOR-ALM-02": { nombre: "Almacén de insumos", horaInicio: "06:00", horaFin: "18:00" },
  "DOOR-ADM-01": { nombre: "Oficinas centrales", horaInicio: "07:00", horaFin: "19:00" },
  "DOOR-RRHH-01": { nombre: "Talento humano", horaInicio: "08:00", horaFin: "17:00" },
};

const DEFAULT_ACCESS_SCHEDULE: AccessSchedule = {
  nombre: "Horario general",
  horaInicio: "06:00",
  horaFin: "14:30",
};

/** Colaboradores base de terminal para demostración y simulación en modo público / offline */
const DEFAULT_TERMINAL_EMPLOYEES: Employee[] = [
  {
    id: "1020304050",
    nombre: "Carlos",
    apellido: "Mendoza",
    cedula: "1020304050",
    departamento: "Producción",
    cargo: "Operador de Envasado Estéril",
    email: "c.mendoza@pharma911.com",
    acceso: true,
    permisoAcceso: true,
    activo: true,
    codigoQr: "1020304050",
    documentoIdentidad: "1020304050",
  },
  {
    id: "2030405060",
    nombre: "Dra. Elena",
    apellido: "Ramos",
    cedula: "2030405060",
    departamento: "Control de Calidad",
    cargo: "Analista Microbiológica Senior",
    email: "e.ramos@pharma911.com",
    acceso: true,
    permisoAcceso: true,
    activo: true,
    codigoQr: "2030405060",
    documentoIdentidad: "2030405060",
  },
  {
    id: "3040506070",
    nombre: "Dr. Julián",
    apellido: "Castro",
    cedula: "3040506070",
    departamento: "Investigación y Desarrollo",
    cargo: "Especialista en Bioseguridad N3",
    email: "j.castro@pharma911.com",
    acceso: true,
    permisoAcceso: true,
    activo: true,
    codigoQr: "3040506070",
    documentoIdentidad: "3040506070",
  },
  {
    id: "4050607080",
    nombre: "Martín",
    apellido: "Morales",
    cedula: "4050607080",
    departamento: "Almacén y Logística",
    cargo: "Supervisor de Recepción",
    email: "m.morales@pharma911.com",
    acceso: true,
    permisoAcceso: true,
    activo: true,
    codigoQr: "4050607080",
    documentoIdentidad: "4050607080",
  },
  {
    id: "5060708090",
    nombre: "Diana",
    apellido: "Valencia",
    cedula: "5060708090",
    departamento: "Administración",
    cargo: "Coordinadora de Auditoría BPF",
    email: "d.valencia@pharma911.com",
    acceso: true,
    permisoAcceso: true,
    activo: true,
    codigoQr: "5060708090",
    documentoIdentidad: "5060708090",
  },
  {
    id: "6070809010",
    nombre: "Laura",
    apellido: "Gómez",
    cedula: "6070809010",
    departamento: "Control de Calidad",
    cargo: "Técnica de Muestreo",
    email: "l.gomez@pharma911.com",
    acceso: false,
    permisoAcceso: false,
    activo: false,
    codigoQr: "6070809010",
    documentoIdentidad: "6070809010",
  },
  {
    id: "7080901020",
    nombre: "Andrés",
    apellido: "Pineda",
    cedula: "7080901020",
    departamento: "Producción",
    cargo: "Técnico de Mantenimiento Electromecánico",
    email: "a.pineda@pharma911.com",
    acceso: true,
    permisoAcceso: true,
    activo: true,
    codigoQr: "7080901020",
    documentoIdentidad: "7080901020",
  },
  {
    id: "8090102030",
    nombre: "Sofía",
    apellido: "Herrera",
    cedula: "8090102030",
    departamento: "Recursos Humanos",
    cargo: "Especialista en Capacitación BPF",
    email: "s.herrera@pharma911.com",
    acceso: true,
    permisoAcceso: true,
    activo: true,
    codigoQr: "8090102030",
    documentoIdentidad: "8090102030",
  },
];

export default function SimuladorAcceso() {
  const [employees, setEmployees] = useState<Employee[]>(DEFAULT_TERMINAL_EMPLOYEES);
  const [selectedCargo, setSelectedCargo] = useState("Operador de Envasado Estéril");
  const [selectedDoorId, setSelectedDoorId] = useState("DOOR-PROD-01");
  const [simulating, setSimulating] = useState(false);
  const [recentLogs, setRecentLogs] = useState<SimulationLog[]>([]);
  // Accesos vigentes por colaborador + punto (clave `${empleadoId}::${puntoId}`).
  const [accessGrants, setAccessGrants] = useState<Record<string, AccessGrant>>({});

  // Control de horario para probar el acceso con una hora específica.
  const [useSimulatedTime, setUseSimulatedTime] = useState(false);
  const [simulatedTime, setSimulatedTime] = useState("09:00");

  const [result, setResult] = useState<{
    status: "IDLE" | "SCANNING" | "CONCEDIDO" | "DENEGADO";
    mensaje: string;
    employeeName?: string;
    details?: string;
  }>({
    status: "IDLE",
    mensaje: "Terminal lista para validación de acceso.",
  });

  // Physical Access Points linked to departments & restriction levels
  const accessPoints: AccessPoint[] = [
    {
      id: "DOOR-COMMON-01",
      nombre: "Torniquete Principal",
      departamento: "Zona Común",
      departamentoCodigo: "GLOBAL",
      nivelRestriccion: "BAJA",
      tipo: "TORNIQUETE",
      ubicacion: "Acceso Peatonal Exterior",
    },
    {
      id: "DOOR-COMMON-02",
      nombre: "Acceso General Comedor & Cafetería",
      departamento: "Zona Común",
      departamentoCodigo: "GLOBAL",
      nivelRestriccion: "BAJA",
      tipo: "PUERTA_AUTOMATICA",
      ubicacion: "Edificio de Servicios",
    },
    {
      id: "DOOR-PROD-01",
      nombre: "Esclusa 1: Sala de Producción A",
      departamento: "Producción",
      departamentoCodigo: "PROD",
      nivelRestriccion: "ALTA",
      tipo: "ESCLUSA",
      ubicacion: "Nave Industrial - Planta Baja",
    },
    {
      id: "DOOR-PROD-02",
      nombre: "Esclusa 2: Línea de Envasado Primario",
      departamento: "Producción",
      departamentoCodigo: "PROD",
      nivelRestriccion: "ALTA",
      tipo: "ESCLUSA",
      ubicacion: "Nave Industrial - Área Limpia",
    },
    {
      id: "DOOR-QC-01",
      nombre: "Lector Biométrico: Lab QC Microbiológico",
      departamento: "Control de Calidad",
      departamentoCodigo: "QC",
      nivelRestriccion: "CRITICA_ESTERIL",
      tipo: "BIOMETRICO",
      ubicacion: "Edificio de Laboratorios - Piso 2",
    },
    {
      id: "DOOR-QC-02",
      nombre: "Esclusa de Control de Calidad Físico-Químico",
      departamento: "Control de Calidad",
      departamentoCodigo: "QC",
      nivelRestriccion: "ALTA",
      tipo: "ESCLUSA",
      ubicacion: "Edificio de Laboratorios - Piso 1",
    },
    {
      id: "DOOR-ID-01",
      nombre: "Esclusa Estéril: Lab B-2 Bioequivalencia",
      departamento: "Investigación y Desarrollo",
      departamentoCodigo: "I+D",
      nivelRestriccion: "CRITICA_ESTERIL",
      tipo: "BIOMETRICO",
      ubicacion: "Área de Bioseguridad Nivel 3",
    },
    {
      id: "DOOR-ALM-01",
      nombre: "Torniquete Muelle de Carga & Recepción",
      departamento: "Almacén y Logística",
      departamentoCodigo: "ALM",
      nivelRestriccion: "MEDIA",
      tipo: "TORNIQUETE",
      ubicacion: "Patio de Maniobras",
    },
    {
      id: "DOOR-ALM-02",
      nombre: "Almacén de Materias Primas e Insumos",
      departamento: "Almacén y Logística",
      departamentoCodigo: "ALM",
      nivelRestriccion: "MEDIA",
      tipo: "PUERTA_AUTOMATICA",
      ubicacion: "Bodega Central",
    },
    {
      id: "DOOR-ADM-01",
      nombre: "Puerta de Acceso: Oficinas Centrales & Gerencia",
      departamento: "Administración",
      departamentoCodigo: "ADM",
      nivelRestriccion: "BAJA",
      tipo: "PUERTA_AUTOMATICA",
      ubicacion: "Edificio Corporativo - Piso 3",
    },
    {
      id: "DOOR-RRHH-01",
      nombre: "Puerta de Acceso: Talento Humano & Capacitación",
      departamento: "Recursos Humanos",
      departamentoCodigo: "RRHH",
      nivelRestriccion: "BAJA",
      tipo: "PUERTA_AUTOMATICA",
      ubicacion: "Edificio Corporativo - Piso 1",
    },
  ];

  useEffect(() => {
    const init = async () => {
      try {
        const emps = await empleadoService.listarTodos();
        if (emps && emps.length > 0) {
          setEmployees(emps);
          if (emps[0]?.cargo) setSelectedCargo(emps[0].cargo);
        }
      } catch {
        // Sin sesión o sin conexión: modo demo con colaboradores locales.
      }
    };
    init();
  }, []);

  // Cargos según los empleados cargados (BD con sesión, demo sin sesión).
  const cargos = [
    ...new Set(
      employees.map((e) => e.cargo).filter((c) => c && c.trim() !== "")
    ),
  ];

  // Colaborador representante del cargo (para credencial y departamento).
  const selectedEmployee =
    employees.find((e) => e.cargo === selectedCargo) ?? employees[0];

  // Si el cargo seleccionado deja de existir (recarga de datos), usa el primero.
  useEffect(() => {
    if (cargos.length > 0 && !cargos.includes(selectedCargo)) {
      setSelectedCargo(cargos[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees]);

  // Puntos asignados al colaborador (su departamento + zona común) primero;
  // el resto se sigue mostrando para probar denegaciones: el servidor decide.
  const assignedPoints = selectedEmployee
    ? accessPoints.filter(
        (p) =>
          p.departamento === "Zona Común" ||
          p.departamento.toLowerCase() ===
            selectedEmployee.departamento.toLowerCase()
      )
    : accessPoints;
  const otherPoints = accessPoints.filter(
    (ap) => !assignedPoints.some((p) => p.id === ap.id)
  );
  const filteredAccessPoints = assignedPoints;

  // Si el punto seleccionado no pertenece al cargo, auto-seleccionar el primero asignado.
  useEffect(() => {
    if (
      filteredAccessPoints.length > 0 &&
      !filteredAccessPoints.some((p) => p.id === selectedDoorId)
    ) {
      setSelectedDoorId(filteredAccessPoints[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCargo, employees]);

  const selectedAccessPoint =
    accessPoints.find((p) => p.id === selectedDoorId) ||
    filteredAccessPoints[0] ||
    accessPoints[0];

  // Acceso ya vigente para esta combinación colaborador + punto.
  const currentGrant =
    accessGrants[`${selectedEmployee?.id}::${selectedDoorId}`];

  const accessSchedule =
    ACCESS_POINT_SCHEDULES[selectedAccessPoint.id] || DEFAULT_ACCESS_SCHEDULE;

  // Access validation evaluation
  const isEmployeeActive =
    selectedEmployee?.permisoAcceso ??
    selectedEmployee?.acceso ??
    selectedEmployee?.activo ??
    true;

  // Paridad con el backend (PuntoAcceso.zonaComun): solo la zona común
  // es de acceso general; ADM/RRHH exigen pertenecer al departamento.
  const isCommonZone =
    selectedAccessPoint.departamento === "Zona Común";

  const departmentMatches =
    isCommonZone ||
    (selectedEmployee &&
      selectedAccessPoint &&
      selectedEmployee.departamento.toLowerCase() ===
        selectedAccessPoint.departamento.toLowerCase());

  // Helper de verificación de turno
  const checkScheduleCompliance = (
    timeToCheck: string,
    schedule: AccessSchedule
  ): boolean => {
    return timeToCheck >= schedule.horaInicio && timeToCheck <= schedule.horaFin;
  };

  const handleSimulate = async () => {
    if (!selectedEmployee) return;

    setSimulating(true);
    setResult({
      status: "SCANNING",
      mensaje: "Verificando punto de acceso del colaborador...",
    });

    const now = new Date();
    const systemTimeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const evaluatedHourMin = useSimulatedTime
      ? simulatedTime
      : `${String(now.getHours()).padStart(2, "0")}:${String(
          now.getMinutes()
        ).padStart(2, "0")}`;

    const effectiveTimeStr = useSimulatedTime
      ? `${simulatedTime}:00 (Simulada)`
      : systemTimeStr;

    // Pequeño retardo para emular procesamiento del punto de acceso
    setTimeout(async () => {
      const targetEmp = selectedEmployee;
      if (!targetEmp) {
        setSimulating(false);
        return;
      }

      const empIdKey = targetEmp.id;
      const empName = targetEmp
        ? `${targetEmp.nombre} ${targetEmp.apellido}`
        : "Colaborador";

      const empDept = targetEmp.departamento || "Sin asignar";
      const schedule =
        ACCESS_POINT_SCHEDULES[selectedAccessPoint.id] || DEFAULT_ACCESS_SCHEDULE;
      const credencial =
        targetEmp.codigoQr || targetEmp.documentoIdentidad || targetEmp.id;

      // Acceso ya vigente para este colaborador en este mismo punto:
      // se informa sin volver a validar ni duplicar la auditoría.
      const grantKey = `${empIdKey}::${selectedDoorId}`;
      const existingGrant = accessGrants[grantKey];
      if (existingGrant) {
        setSimulating(false);
        setResult({
          status: "DENEGADO",
          employeeName: empName,
          mensaje: "Ya tiene acceso permitido",
          details: `Acceso concedido a las ${existingGrant.hora} en ${existingGrant.puertaNombre}. No se necesita validar de nuevo.`,
        });
        toast.warning("Este colaborador ya tiene acceso permitido en este punto");

        setRecentLogs((prev) => [
          {
            id: `SIM-${Date.now()}`,
            hora: effectiveTimeStr,
            empleadoNombre: empName,
            empleadoId: empIdKey,
            empleadoDept: empDept,
            puertaNombre: selectedAccessPoint.nombre,
            puertaDept: selectedAccessPoint.departamento,
            resultado: "DENEGADO",
            motivo: `Acceso repetido: ya permitido desde las ${existingGrant.hora}`,
            horaLimite: schedule.horaFin,
          },
          ...prev,
        ]);
        return;
      }

      // =========================================================================
      // VEREDICTO DEL SERVIDOR (autoritativo: valida punto, horario y zona
      // contra el catálogo de puntos_acceso en America/Bogota).
      // =========================================================================
      try {
        const veredicto = await accesoService.validarAcceso(credencial, selectedDoorId);
        setSimulating(false);
        const concedido = veredicto.permitido;

        setResult({
          status: concedido ? "CONCEDIDO" : "DENEGADO",
          employeeName: veredicto.empleadoNombre || empName,
          mensaje: veredicto.mensaje,
          details: veredicto.puntoCodigo
            ? `${veredicto.puntoCodigo} · Veredicto del servidor.`
            : "Veredicto del servidor.",
        });
        if (concedido) {
          setAccessGrants((prev) => ({
            ...prev,
            [grantKey]: {
              hora: effectiveTimeStr,
              puertaNombre: veredicto.puerta || selectedAccessPoint.nombre,
            },
          }));
          toast.success("Acceso concedido por el servidor");
        } else {
          toast.error(veredicto.mensaje);
        }

        setRecentLogs((prev) => [
          {
            id: `SIM-${Date.now()}`,
            hora: effectiveTimeStr,
            empleadoNombre: veredicto.empleadoNombre || empName,
            empleadoId: empIdKey,
            empleadoDept: veredicto.departamento || empDept,
            puertaNombre: veredicto.puerta || selectedAccessPoint.nombre,
            puertaDept: selectedAccessPoint.departamento,
            resultado: veredicto.resultado,
            motivo: veredicto.mensaje,
            horaLimite: schedule.horaFin,
          },
          ...prev,
        ]);
        return;
      } catch {
        toast.warning("Sin conexión con el backend: se aplica validación local.");
      }

      setSimulating(false);

      // =========================================================================
      // FALLBACK LOCAL (solo sin conexión): replica las reglas del servidor
      // para demo/offline. El resumen superior ya lo advierte.
      // =========================================================================

      // =========================================================================
      // 1. REGLA DE CREDENCIAL ACTIVA
      // =========================================================================
      if (!isEmployeeActive) {
        setResult({
          status: "DENEGADO",
          employeeName: empName,
          mensaje: "Acceso Bloqueado — Credencial Inactiva",
          details: `El colaborador ${targetEmp.id} tiene la credencial inhabilitada o revocada en el sistema.`,
        });
        toast.error("Acceso denegado: Credencial inactiva");

        setRecentLogs((prev) => [
          {
            id: `SIM-${Date.now()}`,
            hora: effectiveTimeStr,
            empleadoNombre: empName,
            empleadoId: empIdKey,
            empleadoDept: empDept,
            puertaNombre: selectedAccessPoint.nombre,
            puertaDept: selectedAccessPoint.departamento,
            resultado: "DENEGADO",
            motivo: "Credencial inactiva o revocada en el sistema",
            horaLimite: schedule.horaFin,
          },
          ...prev,
        ]);
        return;
      }

      // =========================================================================
      // 2. REGLA DE TURNO / HORA LÍMITE DE ACCESO
      // =========================================================================
      const isScheduleValid = checkScheduleCompliance(evaluatedHourMin, schedule);
      if (!isScheduleValid) {
        setResult({
          status: "DENEGADO",
          employeeName: empName,
          mensaje: "Acceso Bloqueado — Fuera de Horario / Turno Límite",
          details: `El punto de acceso tiene '${schedule.nombre}' (${schedule.horaInicio} a ${schedule.horaFin}). Hora evaluada: ${evaluatedHourMin}.`,
        });
        toast.error(
          `Acceso denegado: fuera del horario del punto (${schedule.horaInicio} - ${schedule.horaFin})`
        );

        setRecentLogs((prev) => [
          {
            id: `SIM-${Date.now()}`,
            hora: effectiveTimeStr,
            empleadoNombre: empName,
            empleadoId: empIdKey,
            empleadoDept: empDept,
            puertaNombre: selectedAccessPoint.nombre,
            puertaDept: selectedAccessPoint.departamento,
            resultado: "DENEGADO",
            motivo: `Fuera del horario permitido (${schedule.horaInicio}-${schedule.horaFin})`,
            horaLimite: schedule.horaFin,
          },
          ...prev,
        ]);
        return;
      }

      // =========================================================================
      // 3. REGLA DE RESTRICCIÓN BPF POR DEPARTAMENTO
      // =========================================================================
      if (!departmentMatches) {
        setResult({
          status: "DENEGADO",
          employeeName: empName,
          mensaje: "Acceso Bloqueado — Zona No Autorizada",
          details: `El colaborador pertenece a '${empDept}' y no tiene autorización para ${selectedAccessPoint.departamento}.`,
        });
        toast.error(
          `Acceso denegado: Sin permisos para ${selectedAccessPoint.departamento}`
        );

        setRecentLogs((prev) => [
          {
            id: `SIM-${Date.now()}`,
            hora: effectiveTimeStr,
            empleadoNombre: empName,
            empleadoId: empIdKey,
            empleadoDept: empDept,
            puertaNombre: selectedAccessPoint.nombre,
            puertaDept: selectedAccessPoint.departamento,
            resultado: "DENEGADO",
            motivo: `Sin autorización para el área ${selectedAccessPoint.departamento}`,
            horaLimite: schedule.horaFin,
          },
          ...prev,
        ]);
        return;
      }

      // =========================================================================
      // 4. ACCESO CONCEDIDO (fallback local)
      // =========================================================================
      setResult({
        status: "CONCEDIDO",
        employeeName: empName,
        mensaje: "Acceso autorizado (validación local)",
        details: isCommonZone
          ? `Acceso permitido a zona común: ${selectedAccessPoint.nombre}.`
          : `Acceso permitido para ${empDept}.`,
      });
      toast.success("Acceso concedido (validación local)");
      setAccessGrants((prev) => ({
        ...prev,
        [grantKey]: { hora: effectiveTimeStr, puertaNombre: selectedAccessPoint.nombre },
      }));

      setRecentLogs((prev) => [
        {
          id: `SIM-${Date.now()}`,
          hora: effectiveTimeStr,
          empleadoNombre: empName,
          empleadoId: empIdKey,
          empleadoDept: empDept,
          puertaNombre: selectedAccessPoint.nombre,
          puertaDept: selectedAccessPoint.departamento,
          resultado: "CONCEDIDO",
          motivo: isCommonZone
            ? "Acceso permitido en zona común"
            : "Área autorizada para el colaborador",
          horaLimite: schedule.horaFin,
          },
        ...prev,
      ]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-14 border-b border-border bg-card px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Volver</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-500 dark:text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="truncate">Simulador de Acceso</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* Consola de acceso - solo punto asignado al colaborador */}
        <div className="grid grid-cols-1 gap-6">
          {/* Right Card: Controls & Access Policy Matrix */}
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Zap size={18} className="text-primary" />
                <span>Consola de Pruebas de Acceso</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                El veredicto lo emite el servidor (punto, horario y zona). El resumen inferior es solo una estimación local.
              </p>
            </div>

            {/* Time Control / Simulated Hour */}
            <div className="p-3 bg-muted/40 rounded-xl border border-border/70 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-primary shrink-0" />
                <div>
                  <span className="font-semibold text-foreground block">Horario de acceso</span>
                  <span className="text-[10px] text-muted-foreground">
                    {useSimulatedTime ? "Hora de prueba personalizada" : "Hora actual del sistema"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={useSimulatedTime}
                    onChange={(e) => setUseSimulatedTime(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span>Usar hora de prueba</span>
                </label>
                {useSimulatedTime && (
                  <input
                    type="time"
                    value={simulatedTime}
                    onChange={(e) => setSimulatedTime(e.target.value)}
                    className="px-2 py-1 bg-background border border-border rounded font-mono text-xs text-foreground focus:ring-1 focus:ring-primary"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Cargo Selector (según base de datos) */}
              <div>
                <label className="block text-foreground font-semibold mb-1.5">
                  Cargo
                </label>
                <select
                  value={selectedCargo}
                  onChange={(e) => setSelectedCargo(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-xs focus:outline-hidden focus:ring-1 focus:ring-primary"
                >
                  {cargos.map((cargo) => {
                    const rep = employees.find((e) => e.cargo === cargo);
                    const isActivo = rep?.permisoAcceso ?? rep?.acceso ?? rep?.activo ?? true;
                    return (
                      <option key={cargo} value={cargo}>
                        {cargo} ({isActivo ? "Activo" : "Inactivo"})
                      </option>
                    );
                  })}
                </select>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {selectedEmployee
                    ? `Departamento: ${selectedEmployee.departamento}.`
                    : "Seleccione un cargo para ver sus puntos permitidos."}
                </p>
              </div>

              {/* Door Selector - todos los puntos; el servidor autoriza o deniega */}
              <div>
                <label className="block text-foreground font-semibold mb-1.5">
                  Punto de acceso a probar
                </label>
                <select
                  value={selectedDoorId}
                  onChange={(e) => setSelectedDoorId(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-xs focus:outline-hidden focus:ring-1 focus:ring-primary"
                >
                  <optgroup
                    label={
                      selectedEmployee
                        ? `Asignados a ${selectedEmployee.departamento} + zona común`
                        : "Puntos de acceso"
                    }
                  >
                    {assignedPoints.map((door) => (
                      <option key={door.id} value={door.id}>
                        {door.nombre}
                      </option>
                    ))}
                  </optgroup>
                  {otherPoints.length > 0 && (
                    <optgroup label="Otros puntos (el servidor los denegará)">
                      {otherPoints.map((door) => (
                        <option key={door.id} value={door.id}>
                          {door.nombre}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Puedes probar cualquier punto: el servidor autoriza o deniega según el cargo.
                </p>
              </div>
            </div>

            {/* Resumen de la prueba */}
            {selectedEmployee && selectedAccessPoint && (
              <div className="p-4 rounded-xl bg-muted border border-border space-y-3 text-xs">
                <div className="flex items-center justify-between gap-3 border-b border-border pb-2">
                  <span className="font-semibold text-foreground">Resumen de acceso (estimación local)</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    !isEmployeeActive || !departmentMatches
                      ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  }`}>
                    {!isEmployeeActive || !departmentMatches ? "No autorizado" : "Autorizado"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-muted-foreground block">Cargo</span>
                    <p className="font-medium text-foreground">{selectedCargo}</p>
                    <p className="text-[10px] text-muted-foreground">{selectedEmployee.departamento}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Punto de acceso</span>
                    <p className="font-medium text-foreground truncate">{selectedAccessPoint.nombre}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {accessSchedule.nombre}: {accessSchedule.horaInicio} a {accessSchedule.horaFin}
                    </p>
                  </div>
                </div>

                <p className={`pt-2 border-t border-border ${
                  !isEmployeeActive || !departmentMatches ? "text-rose-400" : "text-emerald-400"
                }`}>
                  {!isEmployeeActive
                    ? "La credencial está inactiva."
                    : !departmentMatches
                    ? `El colaborador no tiene autorización para ${selectedAccessPoint.departamento}.`
                    : `El acceso está disponible dentro del horario configurado.`}
                </p>
                {currentGrant && (
                  <p className="pt-2 border-t border-border text-emerald-500 dark:text-emerald-400 font-semibold">
                    Acceso vigente desde las {currentGrant.hora} en este punto: si valida de nuevo se informará que ya tiene acceso permitido.
                  </p>
                )}
              </div>
            )}

            {/* Resultado de la validación */}
            {result.status !== "IDLE" && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                  result.status === "CONCEDIDO"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : result.status === "DENEGADO"
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
                    : "bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400"
                }`}
              >
                {result.status === "CONCEDIDO" ? (
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                ) : result.status === "DENEGADO" ? (
                  <XCircle size={16} className="shrink-0 mt-0.5" />
                ) : (
                  <RefreshCw size={16} className="shrink-0 mt-0.5 animate-spin" />
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-xs">
                    {result.employeeName ? `${result.mensaje} — ${result.employeeName}` : result.mensaje}
                  </p>
                  {result.details && (
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      {result.details}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-1">
              <button
                onClick={() => handleSimulate()}
                disabled={simulating}
                className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
              >
                <ScanLine size={16} />
                <span>Simular Validación de Acceso</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Full-width Rectangle: Registro de Pruebas Recientes */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xl space-y-3 w-full">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <History size={16} className="text-primary" />
              <h4 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider">
                REGISTRO DE PRUEBAS RECIENTES
              </h4>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-muted-foreground font-mono">
                {recentLogs.length === 0
                  ? "En espera de lecturas"
                  : `${recentLogs.length} ${
                      recentLogs.length === 1 ? "evento registrado" : "eventos registrados"
                    }`}
              </span>
              {recentLogs.length > 0 && (
                <button
                  onClick={() => {
                    setRecentLogs([]);
                  }}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Limpiar registro"
                >
                  <Trash2 size={12} />
                  <span>Limpiar</span>
                </button>
              )}
            </div>
          </div>

          {/* Internal scroll container (max-height prevents page scroll-down) */}
          {recentLogs.length === 0 ? (
            <div className="py-8 flex flex-col items-center justify-center text-center text-muted-foreground gap-2">
              <Terminal size={32} className="text-muted-foreground/50 animate-pulse" />
              <p className="text-xs font-semibold text-muted-foreground">Terminal en espera de lecturas</p>
              <p className="text-[11px] text-muted-foreground max-w-md">
                Seleccione un cargo y punto de control en la consola superior para ejecutar y auditar pruebas de acceso en tiempo real.
              </p>
            </div>
          ) : (
            <div className="max-h-[260px] overflow-y-auto pr-1 space-y-2 divide-y divide-border/60">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="pt-2 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 sm:gap-4 p-2.5 rounded-lg bg-muted/50 hover:bg-muted border border-border/80 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        log.resultado === "CONCEDIDO"
                          ? "bg-emerald-400 shadow-xs shadow-emerald-400"
                          : log.resultado === "ERROR_SENSOR"
                          ? "bg-amber-400 shadow-xs shadow-amber-400"
                          : "bg-rose-400 shadow-xs shadow-rose-400"
                      }`}
                    />
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground truncate text-xs">
                          {log.empleadoNombre}{" "}
                          <span className="text-muted-foreground font-normal">
                            ({log.empleadoDept})
                          </span>
                        </p>
                        {log.horaLimite === "14:30" && (
                          <span className="text-[9px] font-mono bg-sky-500/10 text-sky-500 dark:text-sky-400 border border-sky-500/30 px-1.5 py-0.2 rounded font-bold shrink-0">
                            Hora de salida: 14:30
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                        <span className="text-foreground font-medium">{log.puertaNombre}</span>{" "}
                        · <span className="italic text-muted-foreground">{log.motivo}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <span className="text-[10px] text-muted-foreground font-mono">{log.hora}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        log.resultado === "CONCEDIDO"
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
                          : log.resultado === "ERROR_SENSOR"
                          ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800"
                          : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800"
                      }`}
                    >
                      {log.resultado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

    </div>
  );
}
