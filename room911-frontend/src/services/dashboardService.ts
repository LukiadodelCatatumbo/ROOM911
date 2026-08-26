import api from "./api";
import { DashboardStats } from "../types";
import { MOCK_DASHBOARD } from "../data/mockData";

const DEPT_COLORS = ["#0B5FA5", "#1F8A47", "#7C3AED", "#B7791F", "#0284C7", "#E11D48"];

export const dashboardService = {
  async obtenerResumen(): Promise<DashboardStats> {
    try {
      const [resumenRes, semanaRes] = await Promise.allSettled([
        api.get("/dashboard/resumen"),
        api.get("/dashboard/accesos-semana"),
      ]);

      const data = resumenRes.status === "fulfilled" ? resumenRes.value.data : null;
      const semana = semanaRes.status === "fulfilled" ? semanaRes.value.data : null;

      const totalEmpleados = data?.empleados ?? data?.totalEmpleados ?? MOCK_DASHBOARD.totalEmpleados;
      const empleadosActivos = data?.empleados ?? data?.empleadosConAcceso ?? MOCK_DASHBOARD.empleadosConAcceso;
      const accesosHoy = data?.accesosHoy ?? data?.accesosConcedidosHoy ?? MOCK_DASHBOARD.accesosConcedidosHoy;
      const intentosFallidosHoy = data?.denegadosHoy ?? data?.accesosDenegadosHoy ?? MOCK_DASHBOARD.accesosDenegadosHoy;
      const fallasSensor = data?.accesosErrorHoy ?? 0;
      const aforoActual = data?.empleados ?? data?.aforoActualPlanta ?? MOCK_DASHBOARD.aforoActualPlanta;

      const accesosPorDia = Array.isArray(semana) && semana.length > 0
        ? semana.map((s: any) => ({
            dia: s.dia || "Hoy",
            concedidos: s.cantidad ?? s.concedidos ?? 0,
            denegados: s.denegados ?? 0,
          }))
        : MOCK_DASHBOARD.accesosPorSemana.map((s) => ({ dia: s.dia, concedidos: s.concedidos, denegados: s.denegados }));

      const departamentosData = MOCK_DASHBOARD.distribucionDepartamentos.map((d, i) => ({
        name: d.nombre,
        value: d.cantidad,
        percentage: d.porcentaje,
        color: DEPT_COLORS[i % DEPT_COLORS.length],
      }));

      const ultimosAccesos = MOCK_DASHBOARD.ultimosAccesos.map((u, i) => ({
        id: u.id || `EVT-${i + 1}`,
        hora: u.hora || u.timestamp?.split(" ")[1] || "09:30:00",
        fecha: u.fecha || u.timestamp?.split(" ")[0] || "2024-01-15",
        empleadoId: u.empleadoId || "EMP-0042",
        empleadoNombre: u.empleadoNombre || "Personal",
        puerta: u.puerta || "Esclusa Principal",
        resultado: u.resultado || "CONCEDIDO",
        motivo: u.motivo || "Validación conforme",
      }));

      return {
        kpis: {
          totalEmpleados,
          empleadosActivos,
          accesosHoy,
          intentosFallidosHoy,
          fallasSensor,
          aforoActual,
        },
        accesosPorDia,
        departamentosData,
        ultimosAccesos,
      };
    } catch {
      return {
        kpis: {
          totalEmpleados: MOCK_DASHBOARD.totalEmpleados,
          empleadosActivos: MOCK_DASHBOARD.empleadosConAcceso,
          accesosHoy: MOCK_DASHBOARD.accesosConcedidosHoy,
          intentosFallidosHoy: MOCK_DASHBOARD.accesosDenegadosHoy,
          fallasSensor: MOCK_DASHBOARD.accesosErrorHoy,
          aforoActual: MOCK_DASHBOARD.aforoActualPlanta,
        },
        accesosPorDia: MOCK_DASHBOARD.accesosPorSemana.map((s) => ({
          dia: s.dia,
          concedidos: s.concedidos,
          denegados: s.denegados,
        })),
        departamentosData: MOCK_DASHBOARD.distribucionDepartamentos.map((d, i) => ({
          name: d.nombre,
          value: d.cantidad,
          percentage: d.porcentaje,
          color: DEPT_COLORS[i % DEPT_COLORS.length],
        })),
        ultimosAccesos: MOCK_DASHBOARD.ultimosAccesos.map((u, i) => ({
          id: u.id || `EVT-${i + 1}`,
          hora: u.hora || u.timestamp?.split(" ")[1] || "09:30:00",
          fecha: u.fecha || u.timestamp?.split(" ")[0] || "2024-01-15",
          empleadoId: u.empleadoId || "EMP-0042",
          empleadoNombre: u.empleadoNombre || "Personal",
          puerta: u.puerta || "Esclusa Principal",
          resultado: u.resultado || "CONCEDIDO",
          motivo: u.motivo || "Validación conforme",
        })),
      };
    }
  },
};
