import api from "./api";
import { DashboardStats } from "../types";

const DEPT_COLORS = ["#0B5FA5", "#1F8A47", "#7C3AED", "#B7791F", "#0284C7", "#E11D48"];

/** DashboardResumenDTO del backend. */
interface ResumenBackend {
  empleados: number;
  empleadosConPermiso: number;
  departamentos: number;
  accesosHoy: number;
  denegadosHoy: number;
  enPlanta: number;
}

/** AccesosSemanaDTO del backend. */
interface AccesoSemanaBackend {
  dia: string;
  concedidos: number;
  denegados: number;
}

/** DepartamentoResumenDTO del backend. */
interface DepartamentoResumenBackend {
  departamento: string;
  cantidad: number;
}

/** AccessAttemptDTO del backend (GET /dashboard/ultimos-accesos). */
interface UltimoAccesoBackend {
  id: number;
  fechaAcceso: string;
  exito: boolean;
  message?: string;
  empleadoId?: number;
  nombreEmpleado?: string;
  documento?: string;
  departamento?: string;
}

const partirFecha = (fechaAcceso?: string) => {
  const ts = fechaAcceso || new Date().toISOString();
  const [fechaPart, horaPart] = ts.includes("T")
    ? ts.split("T")
    : ts.split(" ");
  return {
    fecha: fechaPart || ts,
    hora: (horaPart || "").substring(0, 8) || ts.substring(11, 19),
  };
};

export const dashboardService = {
  async obtenerResumen(): Promise<DashboardStats> {
    const [resumenRes, semanaRes, deptosRes, ultimosRes] = await Promise.all([
      api.get<ResumenBackend>("/dashboard/resumen"),
      api.get<AccesoSemanaBackend[]>("/dashboard/accesos-semana"),
      api.get<DepartamentoResumenBackend[]>("/dashboard/departamentos"),
      api.get<UltimoAccesoBackend[]>("/dashboard/ultimos-accesos"),
    ]);

    const resumen = resumenRes.data;
    const totalDeptos = deptosRes.data.reduce((acc, d) => acc + (d.cantidad || 0), 0);

    return {
      kpis: {
        totalEmpleados: resumen.empleados ?? 0,
        empleadosActivos: resumen.empleadosConPermiso ?? 0,
        accesosHoy: resumen.accesosHoy ?? 0,
        intentosFallidosHoy: resumen.denegadosHoy ?? 0,
        fallasSensor: 0,
        aforoActual: resumen.enPlanta ?? 0,
      },
      accesosPorDia: semanaRes.data.map((s) => ({
        dia: s.dia,
        concedidos: s.concedidos ?? 0,
        denegados: s.denegados ?? 0,
      })),
      departamentosData: deptosRes.data.map((d, i) => ({
        name: d.departamento,
        value: d.cantidad ?? 0,
        percentage:
          totalDeptos > 0 ? Math.round(((d.cantidad || 0) / totalDeptos) * 100) : 0,
        color: DEPT_COLORS[i % DEPT_COLORS.length],
      })),
      ultimosAccesos: ultimosRes.data.map((u) => {
        const { fecha, hora } = partirFecha(u.fechaAcceso);
        return {
          id: `EVT-${u.id}`,
          hora,
          fecha,
          empleadoId: u.documento || (u.empleadoId ? `EMP-${u.empleadoId}` : "—"),
          empleadoNombre: u.nombreEmpleado || "Personal Identificado",
          puerta: u.departamento || "—",
          resultado: u.exito ? "CONCEDIDO" : "DENEGADO",
          motivo: u.message || (u.exito ? "Validación conforme" : "Acceso denegado"),
        };
      }),
    };
  },
};
