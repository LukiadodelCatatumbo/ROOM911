import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ShieldCheck,
  Zap,
  Building2,
  Lock,
  Unlock,
  ShieldAlert,
  History,
  DoorClosed,
  Trash2,
  Terminal,
} from "lucide-react";
import { empleadoService } from "../services/empleadoService";
import { accesoService } from "../services/accesoService";
import { departamentoService } from "../services/departamentoService";
import { Employee, Department, AccessResult } from "../types";
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
}

export default function SimuladorAcceso() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [selectedDoorId, setSelectedDoorId] = useState("DOOR-PROD-01");
  const [simulating, setSimulating] = useState(false);
  const [recentLogs, setRecentLogs] = useState<SimulationLog[]>([]);

  const [result, setResult] = useState<{
    status: "IDLE" | "SCANNING" | "CONCEDIDO" | "DENEGADO" | "ERROR_SENSOR";
    message: string;
    employeeName?: string;
    details?: string;
  }>({
    status: "IDLE",
    message: "Terminal lista para lectura de credencial.",
  });

  // Physical Access Points linked to departments & restriction levels
  const accessPoints: AccessPoint[] = [
    {
      id: "DOOR-COMMON-01",
      nombre: "Torniquete Entrada Principal",
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
        const [emps, depts] = await Promise.all([
          empleadoService.listarTodos(),
          departamentoService.listarTodos(),
        ]);
        setEmployees(emps);
        setDepartments(depts);
        if (emps.length > 0) {
          setSelectedEmpId(emps[0].id);
        }
      } catch {
        // Fallback handled by mock data
      }
    };
    init();
  }, []);

  const selectedEmployee = employees.find((e) => e.id === selectedEmpId);
  const selectedAccessPoint =
    accessPoints.find((p) => p.id === selectedDoorId) || accessPoints[0];

  // Access validation evaluation
  const isEmployeeActive =
    selectedEmployee?.permisoAcceso ??
    selectedEmployee?.acceso ??
    selectedEmployee?.activo ??
    true;

  const isCommonZone =
    selectedAccessPoint.departamento === "Zona Común" ||
    selectedAccessPoint.nivelRestriccion === "BAJA";

  const departmentMatches =
    isCommonZone ||
    (selectedEmployee &&
      selectedAccessPoint &&
      selectedEmployee.departamento.toLowerCase() ===
        selectedAccessPoint.departamento.toLowerCase());

  const handleSimulate = async (forceOutcome?: "ERROR_SENSOR") => {
    if (!selectedEmployee && !forceOutcome) return;
    setSimulating(true);
    setResult({
      status: "SCANNING",
      message: "Procesando firma criptográfica de código QR...",
    });

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    setTimeout(async () => {
      setSimulating(false);

      if (forceOutcome === "ERROR_SENSOR") {
        setResult({
          status: "ERROR_SENSOR",
          message: "Falla de Lectura en Sensor Óptico",
          details:
            "El código QR presenta distorsión óptica o baja reflectancia. Por favor reintente la lectura.",
        });
        toast.error("Error de lectura en sensor biométrico");

        if (selectedEmployee) {
          setRecentLogs((prev) => [
            {
              id: `SIM-${Date.now()}`,
              hora: timeStr,
              empleadoNombre: `${selectedEmployee.nombre} ${selectedEmployee.apellido}`,
              empleadoId: selectedEmployee.id,
              empleadoDept: selectedEmployee.departamento,
              puertaNombre: selectedAccessPoint.nombre,
              puertaDept: selectedAccessPoint.departamento,
              resultado: "ERROR_SENSOR",
              motivo: "Falla óptica de lectura en sensor",
            },
            ...prev,
          ]);
        }
        return;
      }

      if (!selectedEmployee) return;

      if (!isEmployeeActive) {
        setResult({
          status: "DENEGADO",
          employeeName: `${selectedEmployee.nombre} ${selectedEmployee.apellido}`,
          message: "Acceso Bloqueado — Credencial Inactiva",
          details: `El colaborador ${selectedEmployee.id} tiene la credencial inhabilitada o revocada en el sistema.`,
        });
        toast.error("Acceso denegado: Credencial inactiva");

        setRecentLogs((prev) => [
          {
            id: `SIM-${Date.now()}`,
            hora: timeStr,
            empleadoNombre: `${selectedEmployee.nombre} ${selectedEmployee.apellido}`,
            empleadoId: selectedEmployee.id,
            empleadoDept: selectedEmployee.departamento,
            puertaNombre: selectedAccessPoint.nombre,
            puertaDept: selectedAccessPoint.departamento,
            resultado: "DENEGADO",
            motivo: "Credencial inactiva o revocada",
          },
          ...prev,
        ]);
        return;
      }

      if (!departmentMatches) {
        setResult({
          status: "DENEGADO",
          employeeName: `${selectedEmployee.nombre} ${selectedEmployee.apellido}`,
          message: "Acceso Bloqueado — Zona No Autorizada",
          details: `El colaborador pertenece a '${selectedEmployee.departamento}', sin privilegios para ingresar al área restringida de '${selectedAccessPoint.departamento}' (${selectedAccessPoint.nivelRestriccion}).`,
        });
        toast.error(
          `Acceso denegado: Sin permisos para ${selectedAccessPoint.departamento}`
        );

        setRecentLogs((prev) => [
          {
            id: `SIM-${Date.now()}`,
            hora: timeStr,
            empleadoNombre: `${selectedEmployee.nombre} ${selectedEmployee.apellido}`,
            empleadoId: selectedEmployee.id,
            empleadoDept: selectedEmployee.departamento,
            puertaNombre: selectedAccessPoint.nombre,
            puertaDept: selectedAccessPoint.departamento,
            resultado: "DENEGADO",
            motivo: `Sin autorización para área ${selectedAccessPoint.departamento}`,
          },
          ...prev,
        ]);
        return;
      }

      // Valid access
      setResult({
        status: "CONCEDIDO",
        employeeName: `${selectedEmployee.nombre} ${selectedEmployee.apellido}`,
        message: "Acceso Autorizado — Esclusa Abierta",
        details: isCommonZone
          ? `Acceso general permitido a zona común (${selectedAccessPoint.nombre}).`
          : `Acreditación validada para el departamento ${selectedEmployee.departamento} (${selectedEmployee.cargo}).`,
      });
      toast.success("Acceso concedido exitosamente");

      try {
        await accesoService.validarAcceso(
          selectedEmployee.codigoQr ||
            selectedEmployee.documentoIdentidad ||
            selectedEmployee.id,
          selectedAccessPoint.nombre
        );
      } catch {
        // Handled gracefully
      }

      setRecentLogs((prev) => [
        {
          id: `SIM-${Date.now()}`,
          hora: timeStr,
          empleadoNombre: `${selectedEmployee.nombre} ${selectedEmployee.apellido}`,
          empleadoId: selectedEmployee.id,
          empleadoDept: selectedEmployee.departamento,
          puertaNombre: selectedAccessPoint.nombre,
          puertaDept: selectedAccessPoint.departamento,
          resultado: "CONCEDIDO",
          motivo: isCommonZone
            ? "Acceso a zona común"
            : "Validación de departamento conforme",
        },
        ...prev,
      ]);
    }, 850);
  };

  const getRestrictionColor = (level: string) => {
    switch (level) {
      case "CRITICA_ESTERIL":
      case "CRITICA":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40";
      case "ALTA":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "MEDIA":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      default:
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    }
  };

  return (
    <div className="min-h-screen bg-[#0A111E] text-white flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-14 border-b border-slate-800 bg-[#0D1B2E] px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-medium transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Volver al Panel Principal</span>
          </Link>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-xs font-mono text-primary font-bold hidden sm:inline">
            TERMINAL_SIM_V4
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="truncate">SISTEMA EN LÍNEA (BPF / ISO 27001)</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* Row 1: Dual Top Cards (Terminal Scanner + Controls Console) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Card: Terminal Scanner Simulation (5 cols on lg) */}
          <div className="lg:col-span-5 bg-[#0F172A] border-2 border-slate-700 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col items-center justify-between text-center relative overflow-hidden">
            <div className="absolute top-3 left-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>

            <div className="mt-4 mb-3 w-full">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                CONTROL DE ACCESO BIOMÉTRICO
              </span>
              <h2 className="text-base font-bold text-white mt-0.5 truncate">
                {selectedAccessPoint.nombre}
              </h2>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">
                {selectedAccessPoint.ubicacion}
              </p>
            </div>

            {/* Scanner Optical Viewport */}
            <div
              className={`w-52 h-52 sm:w-56 sm:h-56 rounded-2xl border-4 flex flex-col items-center justify-center transition-all duration-300 relative my-2 ${
                result.status === "SCANNING"
                  ? "border-sky-400 bg-sky-950/30 animate-pulse shadow-lg shadow-sky-500/20"
                  : result.status === "CONCEDIDO"
                  ? "border-emerald-500 bg-emerald-950/40 shadow-lg shadow-emerald-500/30"
                  : result.status === "DENEGADO"
                  ? "border-rose-500 bg-rose-950/40 shadow-lg shadow-rose-500/30"
                  : result.status === "ERROR_SENSOR"
                  ? "border-amber-500 bg-amber-950/40 shadow-lg shadow-amber-500/30"
                  : "border-slate-700 bg-slate-900"
              }`}
            >
              {result.status === "IDLE" && (
                <div className="flex flex-col items-center gap-3 text-slate-500">
                  <ScanLine size={44} className="animate-pulse text-sky-400" />
                  <span className="text-xs font-mono">LISTO PARA ESCANEAR</span>
                </div>
              )}

              {result.status === "SCANNING" && (
                <div className="flex flex-col items-center gap-3 text-sky-400">
                  <RefreshCw size={40} className="animate-spin" />
                  <span className="text-xs font-mono font-bold">VALIDANDO QR...</span>
                </div>
              )}

              {result.status === "CONCEDIDO" && (
                <div className="flex flex-col items-center gap-2 text-emerald-400 animate-in zoom-in-90">
                  <CheckCircle2 size={52} />
                  <span className="text-sm font-bold font-mono">ACCESO CONCEDIDO</span>
                </div>
              )}

              {result.status === "DENEGADO" && (
                <div className="flex flex-col items-center gap-2 text-rose-400 animate-in zoom-in-90">
                  <XCircle size={52} />
                  <span className="text-sm font-bold font-mono">ACCESO DENEGADO</span>
                </div>
              )}

              {result.status === "ERROR_SENSOR" && (
                <div className="flex flex-col items-center gap-2 text-amber-400 animate-in zoom-in-90">
                  <AlertTriangle size={52} />
                  <span className="text-sm font-bold font-mono">FALLA DE SENSOR</span>
                </div>
              )}
            </div>

            {/* Feedback message */}
            <div className="mt-3 min-h-[56px] w-full flex flex-col items-center justify-center">
              <p className="font-semibold text-sm text-white">{result.message}</p>
              {result.employeeName && (
                <p className="text-xs text-primary font-bold mt-0.5">
                  {result.employeeName}
                </p>
              )}
              {result.details && (
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-relaxed">
                  {result.details}
                </p>
              )}
            </div>
          </div>

          {/* Right Card: Controls & Access Policy Matrix (7 cols on lg) */}
          <div className="lg:col-span-7 bg-[#0D1B2E] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap size={18} className="text-primary" />
                <span>Consola de Pruebas de Acceso Físico</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulación de lectura de torniquetes y validación de reglas de acceso por departamento.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Employee Selector */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  1. Colaborador a Evaluar
                </label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-hidden focus:border-primary"
                >
                  {employees.map((emp) => {
                    const isActivo = emp.permisoAcceso ?? emp.acceso ?? emp.activo ?? true;
                    return (
                      <option key={emp.id} value={emp.id}>
                        {emp.id} — {emp.nombre} {emp.apellido} ({emp.departamento} ·{" "}
                        {isActivo ? "Activo" : "Inactivo"})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Door Selector */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  2. Punto de Control / Esclusa
                </label>
                <select
                  value={selectedDoorId}
                  onChange={(e) => setSelectedDoorId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-hidden focus:border-primary"
                >
                  {accessPoints.map((door) => (
                    <option key={door.id} value={door.id}>
                      {door.nombre} ({door.departamento} · {door.nivelRestriccion})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Real-time Policy Matrix Preview */}
            {selectedEmployee && selectedAccessPoint && (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono border-b border-slate-800 pb-2">
                  <span className="text-slate-400 uppercase font-bold">
                    Evaluación de Compatibilidad
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      !isEmployeeActive
                        ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                        : departmentMatches
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                    }`}
                  >
                    {!isEmployeeActive ? (
                      <>
                        <ShieldAlert size={11} />
                        <span>Credencial Inactiva</span>
                      </>
                    ) : departmentMatches ? (
                      <>
                        <Unlock size={11} />
                        <span>Acceso Autorizado</span>
                      </>
                    ) : (
                      <>
                        <Lock size={11} />
                        <span>Zona Restringida</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  {/* Employee Info */}
                  <div className="space-y-0.5">
                    <span className="text-slate-400 block font-semibold">Departamento Colaborador:</span>
                    <div className="flex items-center gap-1.5 text-white font-medium">
                      <Building2 size={13} className="text-sky-400 shrink-0" />
                      <span className="truncate">{selectedEmployee.departamento}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">
                      Cargo: {selectedEmployee.cargo} · {selectedEmployee.id}
                    </p>
                  </div>

                  {/* Door Info */}
                  <div className="space-y-0.5">
                    <span className="text-slate-400 block font-semibold">Departamento Punto de Control:</span>
                    <div className="flex items-center gap-1.5 text-white font-medium">
                      <DoorClosed size={13} className="text-amber-400 shrink-0" />
                      <span className="truncate">{selectedAccessPoint.departamento}</span>
                    </div>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-semibold ${getRestrictionColor(
                          selectedAccessPoint.nivelRestriccion
                        )}`}
                      >
                        Nivel {selectedAccessPoint.nivelRestriccion}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Policy Diagnostic explanation */}
                <div className="text-[11px] pt-2 border-t border-slate-800 text-slate-300">
                  {!isEmployeeActive ? (
                    <p className="text-rose-400 flex items-center gap-1.5">
                      <ShieldAlert size={13} className="shrink-0" />
                      <span>El carnet del empleado está inactivo en base de datos. Ningún torniquete concederá paso.</span>
                    </p>
                  ) : isCommonZone ? (
                    <p className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="shrink-0" />
                      <span>Punto de control en Zona Común: habilitado para todos los colaboradores activos.</span>
                    </p>
                  ) : departmentMatches ? (
                    <p className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="shrink-0" />
                      <span>El colaborador pertenece a la misma área operativa ({selectedEmployee.departamento}). Paso permitido.</span>
                    </p>
                  ) : (
                    <p className="text-rose-400 flex items-center gap-1.5">
                      <Lock size={13} className="shrink-0" />
                      <span>
                        Restricción BPF: El colaborador es de <strong>{selectedEmployee.departamento}</strong> y no puede ingresar a esclusas de <strong>{selectedAccessPoint.departamento}</strong>.
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-1 space-y-2.5">
              <button
                onClick={() => handleSimulate()}
                disabled={simulating}
                className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
              >
                <ScanLine size={16} />
                <span>Simular Lectura de Credencial QR</span>
              </button>

              <button
                onClick={() => handleSimulate("ERROR_SENSOR")}
                disabled={simulating}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <AlertTriangle size={15} />
                <span>Simular Falla Óptica de Sensor</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Full-width Rectangle: Registro de Pruebas Recientes */}
        <div className="bg-[#0D1B2E] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-3 w-full">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <History size={16} className="text-primary" />
              <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                REGISTRO DE PRUEBAS RECIENTES
              </h4>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400 font-mono">
                {recentLogs.length === 0
                  ? "En espera de lecturas"
                  : `${recentLogs.length} ${
                      recentLogs.length === 1 ? "evento registrado" : "eventos registrados"
                    }`}
              </span>
              {recentLogs.length > 0 && (
                <button
                  onClick={() => setRecentLogs([])}
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
            <div className="py-8 flex flex-col items-center justify-center text-center text-slate-500 gap-2">
              <Terminal size={32} className="text-slate-600 animate-pulse" />
              <p className="text-xs font-semibold text-slate-400">Terminal en espera de lecturas</p>
              <p className="text-[11px] text-slate-500 max-w-md">
                Seleccione un colaborador y punto de control en la consola superior para ejecutar y auditar pruebas de acceso en tiempo real.
              </p>
            </div>
          ) : (
            <div className="max-h-[220px] overflow-y-auto pr-1 space-y-2 divide-y divide-slate-800/60">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="pt-2 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 sm:gap-4 p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 transition-colors"
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
                      <p className="font-semibold text-white truncate text-xs">
                        {log.empleadoNombre}{" "}
                        <span className="text-slate-400 font-normal">
                          ({log.empleadoDept})
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        <span className="text-slate-300 font-medium">{log.puertaNombre}</span>{" "}
                        · <span className="italic text-slate-400">{log.motivo}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <span className="text-[10px] text-slate-400 font-mono">{log.hora}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        log.resultado === "CONCEDIDO"
                          ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                          : log.resultado === "ERROR_SENSOR"
                          ? "bg-amber-950/60 text-amber-400 border-amber-800"
                          : "bg-rose-950/60 text-rose-400 border-rose-800"
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
