import api from "./api";
import { AccessEntry, AccessResult } from "../types";
import { MOCK_HISTORIAL } from "../data/mockData";

export interface ValidateAccessResponse {
  permitido: boolean;
  resultado: AccessResult;
  mensaje: string;
  empleadoNombre?: string;
  empleadoId?: string;
  departamento?: string;
  timestamp: string;
}

export const accesoService = {
  async validarAcceso(documento: string, puerta: string = "Puerta Principal"): Promise<ValidateAccessResponse> {
    try {
      const response = await api.post("/acceso", { documento, puerta });
      const data = response.data;
      return {
        permitido: data.permitido ?? (data.estado === "CONCEDIDO"),
        resultado: (data.estado as AccessResult) || (data.permitido ? "CONCEDIDO" : "DENEGADO"),
        mensaje: data.mensaje || (data.permitido ? "Acceso autorizado" : "Acceso no autorizado"),
        empleadoNombre: data.nombreEmpleado || (data.empleado?.nombre ? `${data.empleado.nombre} ${data.empleado.apellido || ""}` : undefined),
        empleadoId: data.documento || data.empleado?.codigoQr || documento,
        departamento: data.departamento || data.empleado?.departamento?.nombre || "General",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      };
    } catch {
      // Offline simulation
      const concedido = !documento.includes("DENY") && !documento.includes("0081") && !documento.includes("0199");
      return {
        permitido: concedido,
        resultado: concedido ? "CONCEDIDO" : "DENEGADO",
        mensaje: concedido ? "Acceso autorizado a instalaciones" : "Acceso denegado: Sin autorización para el área",
        empleadoNombre: "Personal Identificado",
        empleadoId: documento,
        departamento: "Producción",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      };
    }
  },

  async validarAccesoQr(codigoQr: string, puerta: string = "Torniquete A-1"): Promise<ValidateAccessResponse> {
    try {
      const response = await api.post("/acceso/qr", { codigoQr, puerta });
      const data = response.data;
      return {
        permitido: data.permitido ?? (data.estado === "CONCEDIDO"),
        resultado: (data.estado as AccessResult) || (data.permitido ? "CONCEDIDO" : "DENEGADO"),
        mensaje: data.mensaje || (data.permitido ? "Acceso autorizado" : "Acceso denegado"),
        empleadoNombre: data.nombreEmpleado || (data.empleado?.nombre ? `${data.empleado.nombre} ${data.empleado.apellido || ""}` : undefined),
        empleadoId: data.documento || data.empleado?.codigoQr || codigoQr,
        departamento: data.departamento || data.empleado?.departamento?.nombre || "General",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      };
    } catch {
      const concedido = !codigoQr.includes("0081") && !codigoQr.includes("0199") && !codigoQr.includes("0312");
      return {
        permitido: concedido,
        resultado: concedido ? "CONCEDIDO" : "DENEGADO",
        mensaje: concedido ? "Identidad biométrica validada" : "Acceso no autorizado a zona restringida",
        empleadoNombre: concedido ? "Personal Verificado" : "Acceso Restringido",
        empleadoId: codigoQr,
        departamento: "Laboratorio BPF",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      };
    }
  },

  async listarHistorial(): Promise<AccessEntry[]> {
    try {
      let response;
      try {
        response = await api.get("/intento-acceso");
      } catch {
        response = await api.get("/historial-acceso");
      }
      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        return data.map((d: any) => {
          const ts = d.fechaAcceso || d.fechaIngreso || d.timestamp || new Date().toISOString();
          const [fechaPart, horaPart] = ts.includes("T") ? ts.split("T") : ts.split(" ");
          const esExitoso = d.exito ?? d.accesoPermitido ?? d.permitido ?? true;
          return {
            id: d.id ? `ACC-2024-${String(d.id).padStart(4, "0")}` : "ACC-LOG",
            dbId: d.id,
            timestamp: ts,
            fecha: fechaPart || "2024-01-15",
            hora: horaPart?.substring(0, 8) || "09:00:00",
            puerta: d.puerta || "Puerta Principal",
            resultado: (d.resultado as AccessResult) || (esExitoso ? "CONCEDIDO" : "DENEGADO"),
            motivo: d.message || d.mensaje || d.observaciones || (esExitoso ? "Validación conforme" : "Acceso denegado"),
            empleadoId: d.documento || (d.empleadoId ? `EMP-${d.empleadoId}` : (d.empleado?.codigoQr || `EMP-${d.empleado?.id || "0000"}`)),
            empleadoNombre: d.nombreEmpleado || (d.empleado ? `${d.empleado.nombre} ${d.empleado.apellido || ""}` : "Personal Identificado"),
            departamento: d.departamento || d.empleado?.departamento?.nombre || "General",
          };
        });
      }
      return MOCK_HISTORIAL.map(h => ({
        ...h,
        fecha: h.fecha || h.timestamp?.split(" ")[0] || "2024-01-15",
        hora: h.hora || h.timestamp?.split(" ")[1] || "08:30:00",
      }));
    } catch {
      return MOCK_HISTORIAL.map(h => ({
        ...h,
        fecha: h.fecha || h.timestamp?.split(" ")[0] || "2024-01-15",
        hora: h.hora || h.timestamp?.split(" ")[1] || "08:30:00",
      }));
    }
  },

  async obtenerHistorialGlobal(): Promise<AccessEntry[]> {
    return this.listarHistorial();
  },

  async listarPorEmpleado(empleadoId: string | number): Promise<AccessEntry[]> {
    try {
      const dbId = typeof empleadoId === "number" ? empleadoId : parseInt(String(empleadoId).replace(/\D/g, ""), 10) || 1;
      const response = await api.get(`/historial-acceso/empleado/${dbId}`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data.map((d: any) => ({
          id: `ACC-${d.id || "001"}`,
          fecha: d.fecha || "2024-01-15",
          hora: d.hora || "09:30:00",
          puerta: d.puerta || "Esclusa",
          resultado: d.resultado || "CONCEDIDO",
          motivo: d.motivo || "Validación conforme",
          empleadoId: String(empleadoId),
        }));
      }
      return MOCK_HISTORIAL.filter(h => h.empleadoId === empleadoId).map(h => ({
        ...h,
        fecha: h.fecha || "2024-01-15",
        hora: h.hora || "08:32:14",
      }));
    } catch {
      return MOCK_HISTORIAL.filter(h => h.empleadoId === empleadoId || h.empleadoId === "EMP-0042").map(h => ({
        ...h,
        fecha: h.fecha || "2024-01-15",
        hora: h.hora || "08:32:14",
      }));
    }
  },
};
